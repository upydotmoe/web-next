# stage 1
FROM node:16 as first
WORKDIR /web
ADD package.json .
ADD tsconfig.json .
RUN npm i -g npm@latest \
  && npm i --legacy-peer-deps
ADD . .

# stage 2
FROM first as final
COPY --from=first . ./
RUN rm -rf node_modules \
  && npm cache clean -f \
  && npm i --loglevel verbose --no-audit --legacy-peer-deps \
  && npm i pm2 -g \
  && npm run build
EXPOSE 3000
CMD npm run start:docker