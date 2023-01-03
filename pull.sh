#!/bin/bash
git switch dev
git checkout .

echo "Removing untracked files.."
git add .
git reset --hard HEAD

echo "Pooling new commit from remote, branch dev.."
git pull -f origin dev