# build stage
FROM node:20-alpine3.17 as build-stage

RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --verbose

ADD backend_*.tar.gz .

RUN npm run build

# production stage
FROM node:20-alpine3.17 as production-stage

ENV NODE_ENV production

WORKDIR /app

# 注意：必须上传环境配置文件
# 因为上面的 RUN npm run build 生成的 dist 目录下没有 .production.env 文件
COPY --from=build-stage /app/src/.production.env .

COPY --from=build-stage /app/package.json .
COPY --from=build-stage /app/package-lock.json .

# https://stackoverflow.com/a/76192050
# https://docs.npmjs.com/cli/v10/commands/npm-install#omit
RUN npm install --omit=dev --verbose

COPY --from=build-stage /app/dist .

EXPOSE 3000

ENTRYPOINT ["node", "/app/main.js"]
