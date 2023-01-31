#!/bin/bash
npm i -g yarn@latest
yarn i --ignore-engines

# echo "Building app.."
# yarn build

echo "Restarting PM2.."
yarn pm2:stop
yarn pm2:start

echo "Checking PM2 status.."
sleep 5
pm2 ls

echo "Deployed successfully!"