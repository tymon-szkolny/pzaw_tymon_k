import { DatabaseSync } from "node:sqlite";

const db_path = "./db.sqlite";
const db = new DatabaseSync(db_path);

db.exec(
  `CREATE TABLE IF NOT EXISTS recipe_categories (
    category_id   INTEGER PRIMARY KEY,
    id            TEXT UNIQUE NOT NULL,
    name          TEXT NOT NULL
  ) STRICT;
  CREATE TABLE IF NOT EXISTS recipes (
    recipe_id     INTEGER PRIMARY KEY,
    category_id   INTEGER NOT NULL REFERENCES recipe_categories(category_id) ON DELETE NO ACTION,
    name          TEXT NOT NULL,
    time          TEXT NOT NULL,
    ingredients   TEXT NOT NULL,
    steps         TEXT NOT NULL
  ) STRICT;`
);

const db_ops = {
  insert_category: db.prepare(
    `INSERT INTO recipe_categories (id, name)
        VALUES (?, ?) RETURNING category_id, id, name;`
  ),
  insert_recipe: db.prepare(
    `INSERT INTO recipes (category_id, name, time, ingredients, steps) VALUES (
      (SELECT category_id FROM recipe_categories WHERE id = ?),
      ?, ?, ?, ?
    ) 
    RETURNING recipe_id, name, time, ingredients, steps;`
  ),
  get_categories: db.prepare("SELECT id, name FROM recipe_categories;"),
  get_category_by_id: db.prepare(
    "SELECT category_id, id, name FROM recipe_categories WHERE id = ?;"
  ),
  get_recipes_by_category_id: db.prepare(
    "SELECT recipe_id, name, time, ingredients, steps FROM recipes WHERE category_id = ?;"
  ),
  get_recipe_by_id: db.prepare(
    "SELECT recipe_id, category_id, name, time, ingredients, steps FROM recipes WHERE recipe_id = ?;"
  ),
  update_recipe: db.prepare(
    `UPDATE recipes 
     SET name = ?, time = ?, ingredients = ?, steps = ? 
     WHERE recipe_id = ?
     RETURNING recipe_id, name, time, ingredients, steps;`
  ),
  delete_recipe: db.prepare(
    "DELETE FROM recipes WHERE recipe_id = ?;"
  ),
};

export function getCategories() {
  var categories = db_ops.get_categories.all();
  return categories;
}

export function hasCategory(categoryId) {
  let category = db_ops.get_category_by_id.get(categoryId);
  return category != null;
}

export function getCategory(categoryId) {
  let category = db_ops.get_category_by_id.get(categoryId);
  if (category != null) {
    category.recipes = db_ops.get_recipes_by_category_id.all(category.category_id);
    return category;
  }
  return null;
}

export function getRecipe(recipeId) {
  return db_ops.get_recipe_by_id.get(recipeId);
}

export function addRecipe(categoryId, recipe) {
  return db_ops.insert_recipe.get(
    categoryId, 
    recipe.name, 
    recipe.time, 
    recipe.ingredients, 
    recipe.steps
  );
}

export function updateRecipe(recipeId, recipe) {
  return db_ops.update_recipe.get(
    recipe.name,
    recipe.time,
    recipe.ingredients,
    recipe.steps,
    recipeId
  );
}

export function deleteRecipe(recipeId) {
  return db_ops.delete_recipe.run(recipeId);
}

export function addCategory(categoryId, name) {
  return db_ops.insert_category.get(categoryId, name);
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