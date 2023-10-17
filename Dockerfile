# build stage
FROM node:18-alpine3.14 as build-stage

RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --verbose

ADD backend_*.tar.gz .

RUN npm run build

# production stage
FROM node:18-alpine3.14 as production-stage

WORKDIR /app

COPY --from=build-stage /app/package.json .
COPY --from=build-stage /app/package-lock.json .
# 注意：必须上传环境配置文件
# 因为上面的 RUN npm run build 生成的 dist 目录下没有 .production.env 文件
COPY --from=build-stage /app/src/.production.env .

RUN npm install --production --verbose

COPY --from=build-stage /app/dist .

EXPOSE 3000

ENV NODE_ENV production

ENTRYPOINT ["node", "/app/main.js"]
