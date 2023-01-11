#!/bin/bash
npm install

echo "Building app.."
npm run build

echo "Restarting PM2.."
npm run pm2:stop
npm run pm2:start

echo "Deployed successfully!"