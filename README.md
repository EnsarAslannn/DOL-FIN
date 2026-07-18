# 🐬 DOL-FIN

DOL-FIN, .NET Web API ve React (TypeScript) mimarisi üzerine kurulu; ilişkisel veri akışlarını, dinamik portföy yönetimini ve kullanıcı etkileşimlerini merkezine alan kurumsal odaklı bir finansal yönetim platformudur.

**Canlı Demo:** [ensaraslannn.github.io/DOL-FIN](https://ensaraslannn.github.io/DOL-FIN/)

## Özellikler

- **Portföy & Varlık Yönetimi:** Kullanıcı bazlı sanal cüzdan ve varlık takibi sistemi.
- **Güvenli Kimlik Doğrulama:** ASP.NET Core Identity altyapısı ile JWT (JSON Web Token) korumalı API uç noktaları.
- **İlişkisel Yorum Katmanı:** Hisse senedi sembolleriyle (ticker) doğrudan ilişkilendirilmiş dinamik yorum mimarisi.
- **Yerel Simüle Veri:** Harici API bağımlılığı olmadan, TSLA, NVDA, AAPL, GOOGL ve MSFT için elle üretilmiş yerel finansal veri seti.

## Teknoloji Yığını

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
