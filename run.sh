#!/usr/bin/sh
docker-compose down
docker rmi web_web web-web
docker network create upy-web-network

docker-compose up -d --force-recreate