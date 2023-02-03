#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Resonance.WebApi/Resonance.WebApi.csproj", "Resonance.WebApi/"]
COPY ["Resonance.Games.HouseCompetition.WebApi/Resonance.Games.HouseCompetition.WebApi.csproj", "Resonance.Games.HouseCompetition.WebApi/"]
RUN dotnet restore "Resonance.WebApi/Resonance.WebApi.csproj"
COPY . .
WORKDIR "/src/Resonance.WebApi"
RUN dotnet build "Resonance.WebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Resonance.WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Resonance.WebApi.dll"]