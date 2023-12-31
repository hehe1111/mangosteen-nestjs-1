#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

function info {
  echo
  echo "#### $1"
  echo
}
function set_env {
  name=$1
  hint=$2
  [[ ! -z "${!name}" ]] && return
  while [ -z "${!name}" ]; do
    [[ ! -z "$hint" ]] && echo "> 请输入 $name: $hint" || echo "> 请输入 $name:"
    read $name
  done
  sed -i "1s/^/export $name=${!name}\n/" ~/.bashrc
  echo "$name 已保存至 ~/.bashrc"
}

user=mangosteen
network_name=network1
app_repo_name=mangosteen-nestjs-1
app_container_name=$app_repo_name-production
nginx_container_name=nginx-$app_repo_name-production

# ! . 是执行该脚本时，所在的目录，而不是脚本本身存放的目录
version=$(cat ./version)
info "当前版本：$version"

info "创建网络"
if [ -z "$(docker network ls -q -f name=^$network_name$)" ]; then
  docker network create $network_name
  info "创建网络成功"
else
  info "网络已存在 $network_name"
fi

info "设置部署机的环境变量"
set_env MYSQL_HOST
set_env MYSQL_PASSWORD "密码不要太长，通过 bash 查看数据库时需要输入密码的"
set_env MYSQL_DATABASE
set_env REDIS_HOST

info "创建数据库"
if [ "$(docker ps -aq -f name=^$MYSQL_HOST$)" ]; then
  info "数据库已存在"
  docker start $MYSQL_HOST
else
  mysql_container_id=$(docker run -d \
    --network=$network_name \
    --name $MYSQL_HOST \
    -e MYSQL_ROOT_PASSWORD=$MYSQL_PASSWORD \
    -e MYSQL_DATABASE=$MYSQL_DATABASE \
    -v D:\\practices\\$MYSQL_HOST:/var/lib/mysql \
    mysql:latest \
    --character-set-server=utf8mb4 \
    --collation-server=utf8mb4_unicode_ci \
  )
  info "创建数据库成功：$mysql_container_id"
fi

info "创建 Redis"
if [ "$(docker ps -aq -f name=^$REDIS_HOST$)" ]; then
  info "Redis 已存在"
  docker start $REDIS_HOST
else
  redis_container_id=$(docker run -d \
    --network=$network_name \
    --name $REDIS_HOST \
    -v D:\\practices\\$REDIS_HOST:/data \
    redis:latest \
  )
  info "创建 Redis 成功：$redis_container_id"
fi

info "创建应用镜像"
docker build . -t $app_repo_name:$version
info "创建应用镜像成功"

if [ "$(docker ps -aq -f name=^$app_container_name$)" ]; then
  info "删除旧有应用容器"
  docker rm -f $app_container_name
fi
info "创建应用容器"
app_container_id=$(docker run -d \
  --network=$network_name \
  --name $app_container_name \
  -p 3000:3000 \
  $app_repo_name:$version \
)
info "创建应用容器成功：$app_container_id"

if [ "$(docker ps -aq -f name=^$nginx_container_name$)" ]; then
  info "删除旧有 nginx 容器"
  docker rm -f $nginx_container_name
fi
info "创建 nginx 容器，服务 80、443 端口"
nginx_container_id=$(docker run -d \
  --name=$nginx_container_name \
  --network=$network_name \
  -p 80:80 \
  -p 443:443 \
  -v E://repo/$app_repo_name/tmp/deploys/$version/host.nginx.default.conf:/etc/nginx/conf.d/default.conf \
  -v E://repo/$app_repo_name/tmp/ssl/:/ssl/ \
  nginx:latest
)
info "创建 nginx 容器成功：$nginx_container_id"

info "DONE!"
