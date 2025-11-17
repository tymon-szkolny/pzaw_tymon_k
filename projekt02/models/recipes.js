const recipe_categories = {
  "sniadania": {
    name: "Śniadania",
    recipes: [
      {
        name: "Jajecznica na maśle",
        time: "10 minut",
        ingredients: "4 jajka, 2 łyżki masła, sól, pieprz, szczypiorek",
        steps: "Roztrzep jajka widelcem. Rozgrzej masło na patelni. Wlej jajka i smaż mieszając. Dopraw solą i pieprzem. Posyp szczypiorkiem.",
      },
      {
        name: "Naleśniki z dżemem",
        time: "20 minut",
        ingredients: "2 jajka, szklanka mąki, szklanka mleka, olej, dżem",
        steps: "Wymieszaj jajka z mlekiem i mąką. Smaż naleśniki na patelni. Posmaruj dżemem i zwiń.",
      },
    ],
  },
  "obiady": {
    name: "Obiady",
    recipes: [
      {
        name: "Kotlet schabowy",
        time: "30 minut",
        ingredients: "4 kotlety schabowe, 2 jajka, bułka tarta, mąka, sól, pieprz, olej",
        steps: "Rozbij kotlety tłuczkiem. Posól i popieprz. Obtocz w mące, jajku i bułce. Smaż na złoty kolor z obu stron.",
      },
      {
        name: "Pierogi ruskie",
        time: "1 godzina",
        ingredients: "Mąka, woda, ziemniaki, ser biały, cebula, sól, pieprz",
        steps: "Zrób ciasto z mąki i wody. Przygotuj farsz z ziemniaków i sera. Uleź pierogi i gotuj w osolonej wodzie.",
      },
    ],
  },
  "zupy": {
    name: "Zupy",
    recipes: [
      {
        name: "Żurek",
        time: "1 godzina",
        ingredients: "Zakwas żurowy, kiełbasa, jajka, ziemniaki, marchew, czosnek, majeranek",
        steps: "Ugotuj bulion z kiełbasą i warzywami. Dodaj zakwas i przyprawy. Gotuj 20 minut. Podawaj z jajkiem.",
      },
      {
        name: "Pomidorowa",
        time: "30 minut",
        ingredients: "Koncentrat pomidorowy, bulion, śmietana, makaron, cebula",
        steps: "Podsmaż cebulę. Dodaj koncentrat i bulion. Gotuj 15 minut. Dodaj śmietanę i makaron.",
      },
    ],
  },
  "desery": {
    name: "Desery",
    recipes: [
      {
        name: "Brownie",
        time: "45 minut",
        ingredients: "200g czekolady, 150g masła, 3 jajka, 200g cukru, 100g mąki",
        steps: "Roztop czekoladę z masłem. Ubij jajka z cukrem. Połącz wszystko, dodaj mąkę. Piecz 25 min w 180 stopniach.",
      },
    ],
  },
};

export function getCategories() {
  return Object.entries(recipe_categories).map(([id, category]) => {
    return { id, name: category.name };
  });
}

export function hasCategory(categoryId) {
  return recipe_categories.hasOwnProperty(categoryId);
}

export function getCategory(categoryId) {
  if (hasCategory(categoryId))
    return { id: categoryId, ...recipe_categories[categoryId] };
  return null;
}

export function addRecipe(categoryId, recipe) {
  if (hasCategory(categoryId)) recipe_categories[categoryId].recipes.push(recipe);
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
  addRecipe,
  validateRecipe,
};