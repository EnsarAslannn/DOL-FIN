# 🐬 DOL-FIN

[![CI](https://github.com/EnsarAslannn/DOL-FIN/actions/workflows/ci.yml/badge.svg)](https://github.com/EnsarAslannn/DOL-FIN/actions/workflows/ci.yml)

DOL-FIN, .NET Web API ve React (TypeScript) mimarisi üzerine kurulu; ilişkisel veri akışlarını, dinamik portföy yönetimini ve kullanıcı etkileşimlerini merkezine alan kurumsal odaklı bir finansal yönetim platformudur.

**Canlı Demo:** [dol-fin.com](https://dol-fin.com)

Bu repo frontend'i içerir. Backend (.NET Web API) ayrı bir repoda: [DOL-FIN-api](https://github.com/EnsarAslannn/DOL-FIN-api).

## Özellikler

- **Portföy & Varlık Yönetimi:** Kullanıcı bazlı sanal cüzdan ve varlık takibi sistemi.
- **Güvenli Kimlik Doğrulama:** ASP.NET Core Identity altyapısı ile httpOnly cookie tabanlı JWT korumalı API uç noktaları, rol bazlı yetkilendirme (Admin/User) ve CSRF (double-submit cookie) koruması.
- **İlişkisel Yorum Katmanı:** Hisse senedi sembolleriyle (ticker) doğrudan ilişkilendirilmiş dinamik yorum mimarisi.
- **Yerel Simüle Veri:** Harici API bağımlılığı olmadan, TSLA, NVDA, AAPL, GOOGL ve MSFT için elle üretilmiş yerel finansal veri seti.

## Teknoloji

**Backend:** .NET 10.0 & ASP.NET Core Web API, Entity Framework Core & PostgreSQL, ASP.NET Core Identity & JWT, Serilog, Scalar API UI

**Frontend:** React 19 (TypeScript), Vite, Axios, Tailwind CSS

**Test & CI:** xUnit + Moq (backend), Vitest + React Testing Library (frontend), GitHub Actions

## Kurulum

Proje iki ayrı repodan oluşur; ikisini de çalıştırmanız gerekir.

### 1. Backend ([DOL-FIN-api](https://github.com/EnsarAslannn/DOL-FIN-api))

```bash
git clone https://github.com/EnsarAslannn/DOL-FIN-api.git
cd DOL-FIN-api
dotnet restore
```

Gizli bilgileri (connection string, JWT imzalama anahtarı) `dotnet user-secrets` ile yerel olarak ayarlayın — bunlar `appsettings.json`'a hiçbir zaman yazılmamalıdır:

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Database=dolfin;Username=postgres;Password=..."
dotnet user-secrets set "JWT:SigningKey" "<en az 64 karakterlik rastgele bir anahtar>"
```

Veritabanını oluşturup uygulamayı başlatın:

```bash
dotnet ef database update
dotnet run
```

API varsayılan olarak `https://localhost:7109` üzerinde ayağa kalkar; interaktif API dokümantasyonuna `/scalar` üzerinden erişebilirsiniz.

### 2. Frontend (bu repo)

```bash
git clone https://github.com/EnsarAslannn/DOL-FIN.git
cd DOL-FIN
npm install
```

`.env` dosyası oluşturup API adresini tanımlayın:

```env
VITE_API_URL=https://localhost:7109
```

Ardından çalıştırın:

```bash
npm run dev
```

## Testler

```bash
npm run lint
npm test
npm run build
```

## Lisans

[MIT](./LICENSE)

## İletişim

**Ensar Aslan** — [GitHub](https://github.com/EnsarAslannn)

---

# 🐬 DOL-FIN (English)

[![CI](https://github.com/EnsarAslannn/DOL-FIN/actions/workflows/ci.yml/badge.svg)](https://github.com/EnsarAslannn/DOL-FIN/actions/workflows/ci.yml)

DOL-FIN is an enterprise-focused financial management platform centered on relational data flows, dynamic portfolio management, and user interactions, built on a .NET Web API and React (TypeScript) architecture.

**Live Demo:** [dol-fin.com](https://dol-fin.com)

This repo holds the frontend. The backend (.NET Web API) lives in a separate repo: [DOL-FIN-api](https://github.com/EnsarAslannn/DOL-FIN-api).

## Features

- **Portfolio & Asset Management:** Per-user virtual wallet and asset tracking.
- **Secure Authentication:** ASP.NET Core Identity backing httpOnly-cookie JWT auth, role-based authorization (Admin/User), and CSRF (double-submit cookie) protection.
- **Relational Comment Layer:** Dynamic comment architecture directly linked to stock tickers.
- **Local Mock Data:** Hand-crafted local financial data set for TSLA, NVDA, AAPL, GOOGL, and MSFT, with no external API dependency.

## Tech Stack

**Backend:** .NET 10.0 & ASP.NET Core Web API, Entity Framework Core & PostgreSQL, ASP.NET Core Identity & JWT, Serilog, Scalar API UI

**Frontend:** React 19 (TypeScript), Vite, Axios, Tailwind CSS

**Testing & CI:** xUnit + Moq (backend), Vitest + React Testing Library (frontend), GitHub Actions

## Setup

The project spans two repos; you'll need both running.

### 1. Backend ([DOL-FIN-api](https://github.com/EnsarAslannn/DOL-FIN-api))

```bash
git clone https://github.com/EnsarAslannn/DOL-FIN-api.git
cd DOL-FIN-api
dotnet restore
```

Set secrets (connection string, JWT signing key) locally via `dotnet user-secrets` — never commit these to `appsettings.json`:

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Database=dolfin;Username=postgres;Password=..."
dotnet user-secrets set "JWT:SigningKey" "<a random key at least 64 characters long>"
```

Create the database and run the API:

```bash
dotnet ef database update
dotnet run
```

The API listens on `https://localhost:7109` by default; interactive API docs are available at `/scalar`.

### 2. Frontend (this repo)

```bash
git clone https://github.com/EnsarAslannn/DOL-FIN.git
cd DOL-FIN
npm install
```

Create a `.env` file pointing at the API:

```env
VITE_API_URL=https://localhost:7109
```

Then run it:

```bash
npm run dev
```

## Tests

```bash
npm run lint
npm test
npm run build
```

## License

[MIT](./LICENSE)

## Contact

**Ensar Aslan** — [GitHub](https://github.com/EnsarAslannn)
