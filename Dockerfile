FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY api.csproj .
RUN dotnet restore api.csproj

COPY . .
RUN dotnet publish api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# curl only, for the HEALTHCHECK below -- installed as root, before dropping
# to the unprivileged user.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

RUN groupadd -r dolfin && useradd -r -g dolfin -s /sbin/nologin dolfin \
    && chown -R dolfin:dolfin /app
USER dolfin

EXPOSE 8080

# Matches whatever port ASPNETCORE_URLS is actually bound to below (Railway
# injects its own PORT; local `docker run` without one falls back to 8080).
# Independent of railway.json's platform-level healthcheckPath -- this is
# what `docker compose`/plain `docker run` uses to know the container itself
# is up.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8080}/health || exit 1

ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet api.dll"]
