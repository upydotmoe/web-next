#!/bin/bash
npm i -g yarn@latest
yarn i --ignore-engines

# echo "Building app.."
# yarn build

echo "Restarting PM2.."
yarn pm2:stop
yarn pm2:start

echo "Checking PM2 status.."
pm2 ls
pm2 logs upy-web --lines 50

echo "Deployed successfully!"