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

## Struktura projektu

- `controllers/` — logika uwierzytelniania
- `models/` — dane przepisów, sesji oraz użytkowników
- `views/` — szablony EJS stron
- `public/css/` — stylizacja interfejsu
- `utils/` — pomocnicze skrypty do ustawień i bazy danych