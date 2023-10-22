FROM node:20-alpine3.18
# 默认已安装了 yarn

RUN npm config set registry https://registry.npmmirror.com

ENV NODE_ENV production

WORKDIR /app

COPY package.json .
COPY package-lock.json .
# 必须放在 install 步骤前，否则不会 post-install 钩子找不到补丁文件，就不会应用补丁
COPY patches/ ./patches/

# 用 npm 安装，镜像的体积更小。本地实测，用 yarn 安装的镜像体积约是 npm 的两倍
RUN npm install --omit=dev --verbose
# RUN yarn install --production --verbose
# 验证补丁是否被应用：查看输出
# RUN npm install --omit=dev --verbose >> /app/1.txt

ADD backend_dist_*.tar.gz .

EXPOSE 3000

ENTRYPOINT ["node", "/app/main.js"]
