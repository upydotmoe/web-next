#!/bin/bash
git switch dev
git checkout .

echo "Pooling new commit from remote, branch dev.."
git pull -f origin dev