# build stage
FROM node:18 as build-stage

RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

COPY package.json .

RUN npm install --verbose

COPY . .

RUN npm run build

# production stage
FROM node:18 as production-stage

WORKDIR /app

COPY --from=build-stage /app/dist .
COPY --from=build-stage /app/package.json ./package.json
# 注意：必须上传环境配置文件
COPY ./src/.production.env ./.production.env

RUN npm install --production --verbose

EXPOSE 3000

ENV NODE_ENV production

CMD ["node", "/app/main.js"]
