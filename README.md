# 🐬 DOL-FIN (monorepo)

DOL-FIN, .NET Web API ve React (TypeScript) mimarisi üzerine kurulu; ilişkisel veri akışlarını, dinamik portföy yönetimini ve kullanıcı etkileşimlerini merkezine alan kurumsal odaklı bir finansal yönetim platformudur.

Bu repo, önceden ayrı iki repoda tutulan frontend ([DOL-FIN](https://github.com/EnsarAslannn/DOL-FIN)) ve backend ([DOL-FIN-api](https://github.com/EnsarAslannn/DOL-FIN-api)) kodunu, her ikisinin de commit geçmişi korunarak tek bir monorepo altında birleştirir.

**Canlı Demo:** [dol-fin.com](https://dol-fin.com)
**Live API Docs (Scalar):** [api-production-a1b64.up.railway.app/scalar](https://api-production-a1b64.up.railway.app/scalar)

## Yapı

| Klasör | İçerik | Detaylı README |
|---|---|---|
| [`frontend/`](./frontend) | React + TypeScript + Vite istemcisi | [frontend/README.md](./frontend/README.md) |
| [`backend/`](./backend) | ASP.NET Core 10 Web API + PostgreSQL | [backend/README.md](./backend/README.md) |

Her iki alt klasör de kendi bağımsız proje dosyalarını (`package.json`, `api.csproj`, kendi `.gitignore`'ları, kendi `.env.example`'ları vb.) korur — birleştirme sadece dizin yapısını değiştirdi, build/test komutları alt klasörlerin kendi README'lerinde anlatıldığı gibi çalışmaya devam ediyor.

## Geliştirme

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
dotnet restore api.Tests/api.Tests.csproj
dotnet run --project api.csproj
```

## CI

`.github/workflows/frontend-ci.yml` ve `.github/workflows/backend-ci.yml`, sadece ilgili klasörde değişiklik olduğunda (`paths:` filtresi ile) tetiklenir; her biri önceki ayrı repolardaki CI adımlarının birebir aynısını, ilgili alt klasörde çalışacak şekilde uygular.

## Lisans

[MIT](./LICENSE)
