FROM node:20-alpine3.18
# 默认已安装了 yarn

# RUN npm config set registry https://registry.npmmirror.com

ENV NODE_ENV production

WORKDIR /app

COPY package.json .
COPY package-lock.json .

# https://stackoverflow.com/a/76192050
# https://docs.npmjs.com/cli/v10/commands/npm-install#omit
# npm + 淘宝源还是很慢，根本没法安装，因此换用 yarn（也很慢，但是起码还是能装）
# RUN npm install --omit=dev --verbose
RUN yarn install --production --verbose

ADD backend_dist_*.tar.gz .

EXPOSE 3000

ENTRYPOINT ["node", "/app/main.js"]
