#!/bin/bash
mv .env .env.bak
mv .env.production .env

echo "Building.."
npm run build

echo "Build finished.."

echo "Revert the files back.."
mv .env .env.production
mv .env.bak .env

echo "Finished! Now you can commit your changes"