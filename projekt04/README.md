# Książka Kucharska

Aplikacja webowa do zarządzania przepisami kulinarnymi. Umożliwia przeglądanie przepisów podzielonych na kategorie oraz dodawanie, edycję i usuwanie własnych przepisów. Dane przechowywane są w bazie SQLite.

## Uruchomienie

```bash
npm install
bash utils/generate_env.sh > .env
node utils/populate_db.js
node index.js
```

Aplikacja dostępna na: `http://localhost:8000`

**Testowe konto:**
- Login: `test`
- Hasło: `testpassword123`