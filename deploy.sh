#!/bin/bash
npm run install

echo "Building app.."
npm run build

echo "Restarting PM2.."
npm run pm2:reload

echo "Deployed successfully!"