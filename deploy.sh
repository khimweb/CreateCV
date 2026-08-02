#!/bin/bash
# CV Creator - One-shot deployment script for Vultr Ubuntu VPS
# Usage: curl this script or paste it directly after SSH into your server

set -e

echo "========================================="
echo "  CV Creator - Auto Deployment Script"
echo "========================================="

# Update system
echo "[1/7] Updating system..."
apt update && apt upgrade -y

# Install Node.js 20
echo "[2/7] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Nginx, PM2, Git
echo "[3/7] Installing Nginx, PM2, Git..."
apt install -y nginx git
npm install -g pm2

# Clone project
echo "[4/7] Cloning project..."
cd /var/www
git clone https://github.com/khimweb/CreateCV.git cv-creator
cd cv-creator

# Setup backend
echo "[5/7] Setting up backend..."
cd backend
npm install

# Create .env file - EDIT THESE VALUES!
cat > .env << 'EOF'
PORT=3000
JWT_SECRET=change_this_to_a_random_string_123
NODE_ENV=production
EOF

pm2 start server.js --name cv-backend
pm2 save
pm2 startup systemd -u root --hp /root

# Build frontend
echo "[6/7] Building frontend..."
cd /var/www/cv-creator/frontend
npm install
npx ng build --configuration production

# Configure Nginx
echo "[7/7] Configuring Nginx..."
SERVER_IP=$(curl -s ifconfig.me)

cat > /etc/nginx/sites-available/cv-creator << EOF
server {
    listen 80;
    server_name $SERVER_IP;

    root /var/www/cv-creator/frontend/dist/cv-creator/browser;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/cv-creator /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Setup firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo ""
echo "========================================="
echo "  DEPLOYMENT COMPLETE!"
echo "  Your app is live at: http://$SERVER_IP"
echo "========================================="
echo ""
echo "IMPORTANT: Edit /var/www/cv-creator/backend/.env with your real secrets!"
echo ""
