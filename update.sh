#!/bin/bash
# CV Creator — Fast Update & Deploy Script for Ubuntu VPS
set -e

echo "========================================="
echo "  Deploying Latest Changes..."
echo "========================================="

APP_DIR="/var/www/cv-creator"
if [ ! -d "$APP_DIR" ]; then
  if [ -d "/root/cv-creator" ]; then
    APP_DIR="/root/cv-creator"
  fi
fi

if [ ! -d "$APP_DIR" ]; then
  echo "Application directory not found at /var/www/cv-creator or /root/cv-creator."
  echo "Running from current directory..."
  APP_DIR="$(pwd)"
fi

cd "$APP_DIR"
echo "Working in: $APP_DIR"

echo "[1/4] Pulling latest code from GitHub..."
git fetch origin main
git reset --hard origin/main

echo "[2/4] Updating backend dependencies and restarting API..."
cd "$APP_DIR/backend"
npm install --omit=dev
if command -v pm2 >/dev/null 2>&1; then
  pm2 restart cv-backend || pm2 restart all || pm2 start server.js --name cv-backend
else
  echo "PM2 not found globally, installing..."
  npm install -g pm2
  pm2 start server.js --name cv-backend
fi

echo "[3/4] Building production frontend..."
cd "$APP_DIR/frontend"
npm install
npx ng build --configuration production

echo "[4/4] Reloading Nginx..."
if command -v systemctl >/dev/null 2>&1; then
  systemctl reload nginx || systemctl restart nginx
fi

echo ""
echo "========================================="
echo "  DEPLOYMENT COMPLETE!"
echo "  Your updated app is live!"
echo "========================================="
