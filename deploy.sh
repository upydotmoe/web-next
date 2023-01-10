#!/bin/bash
npm i -g yarn
yarn install

echo "Building app.."
yarn build

echo "Restarting PM2.."
yarn pm2:stop
yarn pm2:start

echo "Deployed successfully!"