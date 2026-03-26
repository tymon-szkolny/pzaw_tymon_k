import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import recipes from "./models/recipes.js";
import session from "./models/session.js";
import auth from "./controllers/auth.js";

const port = process.env.PORT || 8000;
const LAST_VIEWED_COOKIE = "__Host-fisz-last-viewed";
const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_MONTH = 30 * ONE_DAY;
const SECRET = process.env.SECRET;

if (SECRET == null) {
  console.error(
    `SECRET environment variable missing.
     Please create an env file or provide SECRET via environment variables.`,
  );
  process.exit(1);
}

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(cookieParser(SECRET));
app.use(morgan("dev"));
app.use(session.sessionHandler);

const authRouter = express.Router();
authRouter.get("/signup", auth.signup_get);
authRouter.post("/signup", auth.signup_post);
authRouter.get("/login", auth.login_get);
authRouter.post("/login", auth.login_post);
authRouter.get("/logout", auth.logout);
app.use("/auth", authRouter);

app.get("/", auth.login_required, (req, res) => {
  res.render("index", {
    title: "Moje Przepisy",
  });
});

app.get("/przepisy", (req, res) => {
  res.render("recipes", {
    title: "Przepisy",
    categories: recipes.getCategories(),
  });
});

app.get("/przepisy/:category_slug", (req, res) => {
  const category_slug = req.params.category_slug;
  const category = recipes.getCategory(category_slug);
  if (category != null) {
    res.render("category", {
      title: category.name,
      category,
    });
  } else {
    res.sendStatus(404);
  }
});

app.post("/przepisy/:category_slug/new", auth.login_required, (req, res) => {
  const category_slug = req.params.category_slug;
  if (!recipes.hasCategory(category_slug)) {
    res.sendStatus(404);
  } else {
    let recipe_data = {
      name: req.body.name,
      time: req.body.time,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
    };
    var errors = recipes.validateRecipe(recipe_data);
    if (errors.length == 0) {
      recipes.addRecipe(category_slug, recipe_data, res.locals.user);
      res.redirect(`/przepisy/${category_slug}`);
    } else {
      res.status(400);
      res.render("new_recipe", {
        errors,
        title: "Nowy Przepis",
        name: req.body.name,
        time: req.body.time,
        ingredients: req.body.ingredients,
        steps: req.body.steps,
        category: {
          slug: category_slug,
        },
      });
    }
  }
});

app.get("/przepisy/:category_slug/edit/:recipe_id", auth.login_required, (req, res) => {
  const category_slug = req.params.category_slug;
  const recipe_id = req.params.recipe_id;
  
  const recipe = recipes.getRecipe(recipe_id);
  if (recipe != null) {
    const isAdmin = res.locals.user && res.locals.user.username === "admin";
    const isOwner = res.locals.user && recipe.owner_id != null && Number(res.locals.user.id) == Number(recipe.owner_id);
    if (!isAdmin && !isOwner) {
      res.sendStatus(403);
      return;
    }

    res.render("edit_recipe", {
      title: "Edytuj Przepis",
      recipe,
      category: {
        slug: category_slug,
      },
      errors: [],
    });
  } else {
    res.sendStatus(404);
  }
});

app.post("/przepisy/:category_slug/edit/:recipe_id", auth.login_required, (req, res) => {
  const category_slug = req.params.category_slug;
  const recipe_id = req.params.recipe_id;
  
  const recipe = recipes.getRecipe(recipe_id);
  if (recipe == null) {
    res.sendStatus(404);
  } else {
    const isAdmin = res.locals.user && res.locals.user.username === "admin";
    const isOwner = res.locals.user && recipe.owner_id != null && Number(res.locals.user.id) == Number(recipe.owner_id);
    if (!isAdmin && !isOwner) {
      res.sendStatus(403);
      return;
    }

    let recipe_data = {
      name: req.body.name,
      time: req.body.time,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
    };
    var errors = recipes.validateRecipe(recipe_data);
    if (errors.length == 0) {
      recipes.updateRecipe(recipe_id, recipe_data);
      res.redirect(`/przepisy/${category_slug}`);
    } else {
      res.status(400);
      res.render("edit_recipe", {
        errors,
        title: "Edytuj Przepis",
        recipe: {
          id: recipe_id,
          ...recipe_data,
        },
        category: {
          slug: category_slug,
        },
      });
    }
  }
});

app.post("/przepisy/:category_slug/delete/:recipe_id", auth.login_required, (req, res) => {
  const category_slug = req.params.category_slug;
  const recipe_id = req.params.recipe_id;
  
  const recipe = recipes.getRecipe(recipe_id);
  if (!recipe) {
    res.sendStatus(404);
    return;
  }
  const isAdmin = res.locals.user && res.locals.user.username === "admin";
  const isOwner = res.locals.user && recipe.owner_id != null && Number(res.locals.user.id) == Number(recipe.owner_id);
  if (!isAdmin && !isOwner) {
    res.sendStatus(403);
    return;
  }

  recipes.deleteRecipe(recipe_id);
  res.redirect(`/przepisy/${category_slug}`);
});

app.get("/przepisy/:category_slug/:recipe_id", (req, res) => {
  const category_slug = req.params.category_slug;
  const recipe_id = req.params.recipe_id;

  const recipe = recipes.getRecipe(recipe_id);
  if (!recipe) {
    res.sendStatus(404);
    return;
  }

  res.render("recipe", {
    title: recipe.name,
    recipe,
    category: { slug: category_slug },
    errors: [],
    user: res.locals.user,
  });
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});