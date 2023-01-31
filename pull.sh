#!/bin/bash
git switch build
git checkout .

echo "Removing untracked files.."
git add .
git reset --hard HEAD

echo "Pulling new commit from main branch.."
git pull -f origin build

echo "Pulled!"