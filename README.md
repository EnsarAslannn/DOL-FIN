# 🐬 DOL-FIN 

DOL-FIN, .NET Web API ve React (TypeScript) mimarisi üzerine kurulu; ilişkisel veri akışlarını, dinamik portföy yönetimini ve kullanıcı etkileşimlerini merkezine alan kurumsal odaklı bir finansal yönetim platformudur.

## Özellikler
* **Portföy & Varlık Yönetimi:** Kullanıcı bazlı sanal cüzdan ve varlık takibi sistemi.
* **Güvenli Kimlik Doğrulama:** ASP.NET Core Identity altyapısı entegre edilerek, JWT (JSON Web Token) Bearer şemasıyla korunan API uç noktaları.
* **İlişkisel Yorum ve Etkileşim Katmanı:** Veritabanı seviyesinde hisse senedi sembolleri (tickers) ile doğrudan ilişkilendirilmiş dinamik yorum mimarisi.

## Teknik Kapsam ve Veri Yapısı 
* **Yerel Simüle Veri Seti (Local Mock Data):** Bu proje herhangi bir harici üçüncü parti API anahtarı bağımlılığı olmaksızın, tamamen yerel olarak simüle edilmiş finansal verilerle çalışmaktadır. Platform Tesla (TSLA), NVIDIA (NVDA), Apple (AAPL), Google (GOOGL) ve Microsoft (MSFT) olmak üzere 5 ana finansal enstrüman odağında yapılandırılmıştır. Sistemdeki `CompanyProfile` ve tüm finansal tablolar, SQL Server üzerinde el ile üretilmiş ve birbiriyle ilişkili yerel verilerle beslenmiştir.

## Backend 
* **Framework:** .NET 10.0 & ASP.NET Core Web API 
* **Veritabanı:** Entity Framework Core & SQL Server
* **Güvenlik:** ASP.NET Core Identity Altyapısı & JWT Authentication
* **Loglama:** Serilog 
* **API Dökümantasyon:** Scalar API UI entegrasyonu

## Frontend 
* **Framework:** React (TypeScript) 
* **Derleme Aracı:** Vite 
* **HTTP İstemcisi:** Axios 

---

## English Version

# 🐬 DOL-FIN 

DOL-FIN is a financial management platform focusing on relational data flows, dynamic portfolio management, and user interactions, built on a .NET Web API and React (TypeScript) architecture.

## Features
* **Portfolio & Asset Management:** User-based virtual wallet and asset tracking system.
* **Secure Authentication:** Secure API endpoints protected by JWT (JSON Web Token) Bearer scheme, integrated with ASP.NET Core Identity infrastructure.
* **Relational Comment and Interaction Layer:** Dynamic comment architecture directly linked with stock symbols (tickers) at the database level.

## Technical Scope and Data Structure 
* **Local Mock Data Set:** This project operates entirely with locally simulated financial data without any external third-party API key dependency. The platform is structured around 5 major financial instruments: Tesla (TSLA), NVIDIA (NVDA), Apple (AAPL), Google (GOOGL), and Microsoft (MSFT). The `CompanyProfile` and all financial tables in the system are populated with hand-crafted, interconnected local data on SQL Server.

## Backend 
* **Framework:** .NET 10.0 & ASP.NET Core Web API 
* **Database:** Entity Framework Core & SQL Server
* **Security:** ASP.NET Core Identity Infrastructure & JWT Authentication
* **Logging:** Serilog 
* **API Documentation:** Scalar API UI integration

## Frontend 
* **Framework:** React (TypeScript) 
* **Build Tool:** Vite 
* **HTTP Client:** Axios
