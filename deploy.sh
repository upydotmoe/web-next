#!/bin/bash
npm i -g pnpm@latest
pnpm i

# echo "Building app.."
# yarn build

echo "Restarting PM2.."
pnpm run pm2:stop
pnpm run pm2:start

echo "Deployed successfully!"