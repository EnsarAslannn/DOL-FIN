# 🐬 DOL-FIN

DOL-FIN, .NET Web API ve React (TypeScript) mimarisi üzerine kurulu; ilişkisel veri akışlarını, dinamik portföy yönetimini ve kullanıcı etkileşimlerini merkezine alan kurumsal odaklı bir finansal yönetim platformudur.

**Canlı Demo:** [ensaraslannn.github.io/DOL-FIN](https://ensaraslannn.github.io/DOL-FIN/)

## Özellikler

- **Portföy & Varlık Yönetimi:** Kullanıcı bazlı sanal cüzdan ve varlık takibi sistemi.
- **Güvenli Kimlik Doğrulama:** ASP.NET Core Identity altyapısı ile JWT (JSON Web Token) korumalı API uç noktaları.
- **İlişkisel Yorum Katmanı:** Hisse senedi sembolleriyle (ticker) doğrudan ilişkilendirilmiş dinamik yorum mimarisi.
- **Yerel Simüle Veri:** Harici API bağımlılığı olmadan, TSLA, NVDA, AAPL, GOOGL ve MSFT için elle üretilmiş yerel finansal veri seti.

## Teknoloji

**Backend:** .NET 10.0 & ASP.NET Core Web API, Entity Framework Core & SQL Server, ASP.NET Core Identity & JWT, Serilog, Scalar API UI

**Frontend:** React (TypeScript), Vite, Axios, Tailwind CSS

## Kurulum

```bash
git clone https://github.com/EnsarAslannn/DOL-FIN.git
cd DOL-FIN
npm install
```

`.env` dosyasında API adresini tanımlayın:

```env
VITE_API_BASE_URL=https://localhost:5001/api
```

Ardından çalıştırın:

```bash
npm run dev
```

## Lisans

Bu proje şu anda bir lisans dosyası içermemektedir.

## İletişim

**Ensar Aslan** — [GitHub](https://github.com/EnsarAslannn)




##🐬 DOL-FIN

DOL-FIN is a financial management platform focusing on relational data flows, dynamic portfolio management, and user interactions, built on a .NET Web API and React (TypeScript) architecture.

Live Demo: ensaraslannn.github.io/DOL-FIN

Features


Portfolio & Asset Management: User-based virtual wallet and asset tracking system.
Secure Authentication: API endpoints protected by JWT (JSON Web Token), integrated with ASP.NET Core Identity infrastructure.
Relational Comment Layer: Dynamic comment architecture directly linked to stock symbols (tickers).
Local Mock Data: Hand-crafted local financial data set for TSLA, NVDA, AAPL, GOOGL, and MSFT, with no external API dependency.


Tech Stack

Backend: .NET 10.0 & ASP.NET Core Web API, Entity Framework Core & SQL Server, ASP.NET Core Identity & JWT, Serilog, Scalar API UI

Frontend: React (TypeScript), Vite, Axios, Tailwind CSS

Installation

bashgit clone https://github.com/EnsarAslannn/DOL-FIN.git
cd DOL-FIN
npm install

Define the API address in your .env file:

envVITE_API_BASE_URL=https://localhost:5001/api

Then run:

bashnpm run dev

License

This project does not currently include a license file.

Contact

Ensar Aslan — GitHub
