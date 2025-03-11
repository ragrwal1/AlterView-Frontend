#!/bin/bash

# Vercel deployment script

echo "Preparing for Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from example.env..."
    cp example.env .env
    echo "Please fill in the environment variables in .env before deploying"
    exit 1
fi

# Check if environment variables are set
if grep -q "NEXT_PUBLIC_VAPI_WEB_TOKEN=$" .env; then
    echo "Warning: NEXT_PUBLIC_VAPI_WEB_TOKEN is not set in .env"
    echo "Please set your environment variables before deploying"
    exit 1
fi

if grep -q "NEXT_PUBLIC_SERVER_URL=$" .env; then
    echo "Warning: NEXT_PUBLIC_SERVER_URL is not set in .env"
    echo "Please set your environment variables before deploying"
    exit 1
fi

# Build the project
echo "Building project..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!" 