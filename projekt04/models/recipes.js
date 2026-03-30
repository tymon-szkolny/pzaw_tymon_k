import { DatabaseSync } from "node:sqlite";

const db_path = "./db.sqlite";
const db = new DatabaseSync(db_path);

// create tables (ensure owner_id exists if table already present)
db.exec(
  `CREATE TABLE IF NOT EXISTS recipe_categories (
    category_id   INTEGER PRIMARY KEY,
    slug          TEXT UNIQUE NOT NULL,
    name          TEXT NOT NULL
  ) STRICT;
  CREATE TABLE IF NOT EXISTS recipes (
    recipe_id     INTEGER PRIMARY KEY,
    category_id   INTEGER NOT NULL,
    name          TEXT NOT NULL,
    time          TEXT NOT NULL,
    ingredients   TEXT NOT NULL,
    steps         TEXT NOT NULL,
    owner_id      INTEGER
  ) STRICT;`
);

// ensure owner_id column exists for older databases
const cols = db.prepare("PRAGMA table_info(recipes);").all();
if (!cols.some(c => c.name === "owner_id")) {
  db.exec("ALTER TABLE recipes ADD COLUMN owner_id INTEGER;");
}

const db_ops = {
  insert_category: db.prepare(
    `INSERT INTO recipe_categories (slug, name)
        VALUES (?, ?) RETURNING category_id AS id, slug, name;`
  ),
  update_category_by_slug: db.prepare(
    `UPDATE recipe_categories SET slug = $new_slug, name = $new_name
       WHERE slug = $slug RETURNING category_id AS id, slug, name;`
  ),
  insert_recipe_by_category_slug: db.prepare(
    `INSERT INTO recipes (category_id, name, time, ingredients, steps, owner_id) VALUES (
      (SELECT category_id FROM recipe_categories WHERE slug = ?),
      ?, ?, ?, ?, ?
    ) 
    RETURNING recipe_id AS id, name, time, ingredients, steps, owner_id;`
  ),
  get_category_summaries: db.prepare(
    "SELECT slug, name FROM recipe_categories;"
  ),
  get_category_summary_by_category_id: db.prepare(
    "SELECT slug, name FROM recipe_categories WHERE category_id = ?;"
  ),
  get_category_by_slug: db.prepare(
    "SELECT category_id AS id, slug, name FROM recipe_categories WHERE slug = ?;"
  ),
  get_recipe_by_id: db.prepare(
    `SELECT r.recipe_id AS id, r.category_id, r.name, r.time, r.ingredients, r.steps, r.owner_id,
            u.username AS owner_username
     FROM recipes r
     LEFT JOIN fc_users u ON r.owner_id = u.id
     WHERE r.recipe_id = ?;`
  ),
  get_recipes_by_category_id: db.prepare(
    `SELECT r.recipe_id AS id, r.name, r.time, r.ingredients, r.steps, r.owner_id,
            u.username AS owner_username
     FROM recipes r
     LEFT JOIN fc_users u ON r.owner_id = u.id
     WHERE r.category_id = ?;`
  ),
  update_recipe_by_id: db.prepare(
    `UPDATE recipes 
     SET name = ?, time = ?, ingredients = ?, steps = ?
     WHERE recipe_id = ?
     RETURNING recipe_id AS id, name, time, ingredients, steps, owner_id;`
  ),
  delete_recipe_by_id: db.prepare(
    "DELETE FROM recipes WHERE recipe_id = ?;"
  ),
};

export function getCategories() {
  return db_ops.get_category_summaries.all().map((c) => {
    return { slug: c.slug, name: c.name };
  });
}

export function hasCategory(categorySlug) {
  let category = db_ops.get_category_by_slug.get(categorySlug);
  return category != null;
}

export function getCategory(categorySlug) {
  const row = db_ops.get_category_by_slug.get(categorySlug);
  if (row != null) {
    const category = { slug: row.slug, name: row.name };
    category.recipes = db_ops.get_recipes_by_category_id.all(row.id);
    return category;
  }
  return null;
}

export function getRecipe(recipeId) {
  return db_ops.get_recipe_by_id.get(recipeId);
}

export function addRecipe(categorySlug, recipe, owner = null) {
  const owner_id = owner && owner.id ? owner.id : null;
  return db_ops.insert_recipe_by_category_slug.get(
    categorySlug, 
    recipe.name, 
    recipe.time, 
    recipe.ingredients, 
    recipe.steps,
    owner_id
  );
}

export function updateRecipe(recipeId, recipe) {
  return db_ops.update_recipe_by_id.get(
    recipe.name,
    recipe.time,
    recipe.ingredients,
    recipe.steps,
    recipeId
  );
}

export function deleteRecipe(recipeId) {
  return db_ops.delete_recipe_by_id.run(recipeId);
}

export function addCategory(categorySlug, name) {
  return db_ops.insert_category.get(categorySlug, name);
}

export function validateRecipe(recipe) {
  var errors = [];
  var fields = ["name", "time", "ingredients", "steps"];
  for (let field of fields) {
    if (!recipe.hasOwnProperty(field)) errors.push(`Brakuje pola '${field}'`);
    else {
      if (typeof recipe[field] != "string")
        errors.push(`Pole '${field}' musi być tekstem`);
      else {
        if (field === "name") {
          if (recipe[field].length < 3 || recipe[field].length > 100)
            errors.push(`Nazwa musi mieć 3-100 znaków`);
        } else if (field === "time") {
          if (recipe[field].length < 1 || recipe[field].length > 50)
            errors.push(`Czas musi mieć 1-50 znaków`);
        } else {
          if (recipe[field].length < 5 || recipe[field].length > 1000)
            errors.push(`Pole '${field}' musi mieć 5-1000 znaków`);
        }
      }
    }
  }
  return errors;
}

export default {
  getCategories,
  hasCategory,
  getCategory,
  getRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  addCategory,
  validateRecipe,
};