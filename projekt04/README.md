# Książka Kucharska

Aplikacja webowa do zarządzania przepisami kulinarnymi. Pozwala przeglądać przepisy w podziale na kategorie, a także dodawać, edytować i usuwać własne przepisy po zalogowaniu.

Projekt używa:
- `Express` i `EJS` do serwowania stron i renderowania widoków
- `SQLite` jako prostą lokalną bazę danych
- `argon2` do bezpiecznego haszowania haseł
- sesji cookies do utrzymania zalogowanego użytkownika

## Funkcje

- rejestracja i logowanie użytkowników
- ochrona tras wymagających zalogowania
- lista kategorii przepisów
- przeglądanie szczegółów przepisu
- tworzenie nowego przepisu po zalogowaniu
- edycja i usuwanie przepisów przez właściciela lub administratora
- estetyczny, responsywny interfejs CSS

## Instalacja i uruchomienie

### Krok 1: Zainstaluj zależności i przygotuj środowisko

```bash
npm run setup
```

### Krok 2: Uruchom aplikację

```bash
npm start
```

Serwer będzie dostępny pod adresem: `http://localhost:8000`

## Dostępne polecenia npm

| Komenda | Opis |
|---------|------|
| `npm start` | Uruchamia serwer aplikacji |
| `npm run setup` | Instaluje zależności, generuje `.env` i umieszcza dane testowe |
| `npm run generate-env` | Generuje plik `.env` z losowymi sekretami |
| `npm run populate-db` | Dodaje dane testowe do bazy danych |

## Testowe konto

- Login: `test`
- Hasło: `testpassword123`

**Konto admin**
- Login: `admin`
- Hasło: `adminpassword123`
- Uprawnienia: może edytować i usuwać wszystkie przepisy

## Obsługiwane ścieżki

| Metoda | Ścieżka | Opis | Wymaga zalogowania |
|--------|---------|------|-------------------|
| `GET` | `/auth/signup` | Formularz rejestracji nowego użytkownika | nie |
| `POST` | `/auth/signup` | Przesyłanie danych rejestracyjnych | nie |
| `GET` | `/auth/login` | Formularz logowania | nie |
| `POST` | `/auth/login` | Przesyłanie danych logowania | nie |
| `GET` | `/auth/logout` | Wylogowanie użytkownika | tak |
| `GET` | `/` | Strona główna dla zalogowanego użytkownika | tak |
| `GET` | `/przepisy` | Lista kategorii przepisów | nie |
| `GET` | `/przepisy/:category_slug` | Lista przepisów dla danej kategorii | nie |
| `POST` | `/przepisy/:category_slug/new` | Dodanie nowego przepisu do kategorii | tak |
| `GET` | `/przepisy/:category_slug/edit/:recipe_id` | Formularz edycji przepisu | tak (właściciel/admin) |
| `POST` | `/przepisy/:category_slug/edit/:recipe_id` | Zapis edycji przepisu | tak (właściciel/admin) |
| `POST` | `/przepisy/:category_slug/delete/:recipe_id` | Usunięcie przepisu | tak (właściciel/admin) |
| `GET` | `/przepisy/:category_slug/:recipe_id` | Szczegóły wybranego przepisu | nie |

### Parametry i walidacja

- `:category_slug` — identyfikator kategorii w URL
- `:recipe_id` — identyfikator przepisu
- pola formularza przepisu: `name`, `time`, `ingredients`, `steps`

> Nieznane trasy przekierowują na stronę główną `/`.

## Struktura projektu

- `controllers/` — logika uwierzytelniania
- `models/` — dane przepisów, sesji oraz użytkowników
- `views/` — szablony EJS stron
- `public/css/` — stylizacja interfejsu
- `utils/` — pomocnicze skrypty do ustawień i bazy danych
