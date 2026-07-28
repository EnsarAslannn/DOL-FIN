FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY api.csproj .
RUN dotnet restore api.csproj

COPY . .
RUN dotnet publish api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

RUN groupadd -r dolfin && useradd -r -g dolfin -s /sbin/nologin dolfin \
    && chown -R dolfin:dolfin /app
USER dolfin

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet api.dll"]
