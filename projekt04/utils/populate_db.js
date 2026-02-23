import recipes from "../models/recipes.js";

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
      {
        name: "Owsianka z owocami",
        time: "15 minut",
        ingredients: "Płatki owsiane, mleko, banan, jabłko, miód, orzechy",
        steps: "Ugotuj płatki owsiane z mlekiem. Dodaj pokrojone owoce. Polej miodem i posyp orzechami.",
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
      {
        name: "Spaghetti carbonara",
        time: "25 minut",
        ingredients: "Makaron spaghetti, boczek, jajka, parmezan, czosnek, pieprz",
        steps: "Ugotuj makaron. Podsmaż boczek z czosnkiem. Wymieszaj z jajkami i parmezanem. Połącz z makaronem.",
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
      {
        name: "Rosół",
        time: "2 godziny",
        ingredients: "Kurczak, marchew, pietruszka, seler, cebula, liść laurowy, makaron",
        steps: "Ugotuj kurczaka z warzywami. Gotuj na małym ogniu 2 godziny. Odcedź i dodaj makaron.",
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
      {
        name: "Sernik",
        time: "1.5 godziny",
        ingredients: "Ser biały, jajka, cukier, mąka ziemniaczana, budyń waniliowy, rodzynki",
        steps: "Ubij ser z jajkami i cukrem. Dodaj budyń, mąkę i rodzynki. Piecz 1 godzinę w 170 stopniach.",
      },
    ],
  },
};

console.log("Populating db...");

Object.entries(recipe_categories).map(([id, data]) => {
  let category = recipes.addCategory(id, data.name);
  console.log("Created category:", category);
  for (let recipe of data.recipes) {
    let r = recipes.addRecipe(category.id, recipe);
    console.log("Created recipe:", r);
  }
});

console.log("Database populated successfully!");