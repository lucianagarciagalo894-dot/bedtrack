# Etapa de construccion
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiamos la solucion y los proyectos para restaurar las dependencias (optimiza el cache de Docker)
COPY ["BedTrack.sln", "./"]
COPY ["Backend/BedTrack.API/BedTrack.API.csproj", "Backend/BedTrack.API/"]
COPY ["Backend/BedTrack.Application/BedTrack.Application.csproj", "Backend/BedTrack.Application/"]
COPY ["Backend/BedTrack.Domain/BedTrack.Domain.csproj", "Backend/BedTrack.Domain/"]
COPY ["Backend/BedTrack.Infrastructure/BedTrack.Infrastructure.csproj", "Backend/BedTrack.Infrastructure/"]
RUN dotnet restore "BedTrack.sln"

# Copiamos todo el codigo fuente restante (se ignorara Frontend si esta en .dockerignore, pero por las dudas copiamos todo)
COPY . .

# Nos movemos al proyecto principal y lo compilamos en modo Release
WORKDIR "/src/Backend/BedTrack.API"
RUN dotnet publish "BedTrack.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa de ejecucion (Runtime ligero)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Railway suele inyectar la variable PORT, pero por defecto ASP.NET 8 usa el puerto 8080
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BedTrack.API.dll"]
