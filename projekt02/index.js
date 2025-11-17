import express from "express";
import recipes from "./models/recipes.js";

const port = 8000;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());

app.get("/", (req, res) => {
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

app.get("/przepisy/:category_id", (req, res) => {
  const category = recipes.getCategory(req.params.category_id);
  if (category != null) {
    res.render("category", {
      title: category.name,
      category,
    });
  } else {
    res.sendStatus(404);
  }
});

app.post("/przepisy/:category_id/new", (req, res) => {
  const category_id = req.params.category_id;
  if (!recipes.hasCategory(category_id)) {
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
      recipes.addRecipe(category_id, recipe_data);
      res.redirect(`/przepisy/${category_id}`);
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
          id: category_id,
        },
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});