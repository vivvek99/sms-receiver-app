#!/bin/bash

# Azure App Service Deployment Script for SMS Receiver App
# This script sets up the infrastructure for the SMS Receiver application

set -e

# Variables - Update these for your deployment
RESOURCE_GROUP="sms-receiver-rg"
LOCATION="eastus"
APP_SERVICE_PLAN="sms-receiver-plan"
BACKEND_APP_NAME="sms-receiver-api"
FRONTEND_APP_NAME="sms-receiver-web"
POSTGRES_SERVER="sms-receiver-db"
POSTGRES_DB="sms_receiver"
POSTGRES_USER="smsadmin"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Azure deployment...${NC}"

# Login check
if ! az account show &> /dev/null; then
    echo "Please login to Azure first: az login"
    exit 1
fi

# Create Resource Group
echo "Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service Plan (Linux, B1 tier for production)
echo "Creating App Service Plan..."
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --is-linux \
    --sku B1

# Create PostgreSQL Flexible Server
echo "Creating PostgreSQL Server..."
read -sp "Enter PostgreSQL admin password: " POSTGRES_PASSWORD
echo

az postgres flexible-server create \
    --resource-group $RESOURCE_GROUP \
    --name $POSTGRES_SERVER \
    --location $LOCATION \
    --admin-user $POSTGRES_USER \
    --admin-password $POSTGRES_PASSWORD \
    --sku-name Standard_B1ms \
    --tier Burstable \
    --storage-size 32 \
    --version 16

# Create Database
echo "Creating PostgreSQL Database..."
az postgres flexible-server db create \
    --resource-group $RESOURCE_GROUP \
    --server-name $POSTGRES_SERVER \
    --database-name $POSTGRES_DB

# Allow Azure services to access PostgreSQL
echo "Configuring PostgreSQL firewall..."
az postgres flexible-server firewall-rule create \
    --resource-group $RESOURCE_GROUP \
    --name $POSTGRES_SERVER \
    --rule-name AllowAzureServices \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 0.0.0.0

# Create Backend Web App
echo "Creating Backend Web App..."
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --name $BACKEND_APP_NAME \
    --runtime "NODE:20-lts" \
    --https-only true

# Configure Backend Environment Variables
echo "Configuring Backend settings..."
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --settings \
        NODE_ENV=production \
        PORT=8080 \
        DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_SERVER}.postgres.database.azure.com:5432/${POSTGRES_DB}?sslmode=require" \
        CORS_ORIGIN="https://${FRONTEND_APP_NAME}.azurewebsites.net"

# Create Frontend Web App
echo "Creating Frontend Web App..."
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --name $FRONTEND_APP_NAME \
    --runtime "NODE:20-lts" \
    --https-only true

# Configure Frontend Environment Variables
echo "Configuring Frontend settings..."
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $FRONTEND_APP_NAME \
    --settings \
        NEXT_PUBLIC_API_URL="https://${BACKEND_APP_NAME}.azurewebsites.net" \
        NEXT_PUBLIC_WS_URL="wss://${BACKEND_APP_NAME}.azurewebsites.net"

# Enable WebSockets for Backend
echo "Enabling WebSockets..."
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --web-sockets-enabled true

echo -e "${GREEN}Deployment complete!${NC}"
echo ""
echo "Backend URL: https://${BACKEND_APP_NAME}.azurewebsites.net"
echo "Frontend URL: https://${FRONTEND_APP_NAME}.azurewebsites.net"
echo ""
echo "Next steps:"
echo "1. Deploy the backend: cd backend && az webapp up --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP"
echo "2. Deploy the frontend: cd frontend && az webapp up --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP"
echo "3. Run database migrations: npx prisma migrate deploy"
