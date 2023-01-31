#!/bin/bash
git switch main
git checkout .

echo "Removing untracked files.."
git add .
git reset --hard HEAD

echo "Pulling new commit from main branch.."
git pull -f origin main

echo "Pulled!"