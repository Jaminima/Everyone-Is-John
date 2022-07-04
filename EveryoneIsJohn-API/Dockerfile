#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["EveryoneIsJohn-API/EveryoneIsJohn-API.csproj", "EveryoneIsJohn-API/"]
RUN dotnet restore "EveryoneIsJohn-API/EveryoneIsJohn-API.csproj"
COPY . .
WORKDIR "/src/EveryoneIsJohn-API"
RUN dotnet build "EveryoneIsJohn-API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EveryoneIsJohn-API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EveryoneIsJohn-API.dll"]