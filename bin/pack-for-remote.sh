#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

function info {
  echo
  echo "#### $1"
  echo
}

function create_dir {
  local directory=$1

  if [ ! -d "$directory" ]; then
      mkdir -p "$directory"
      echo "成功创建目录: $directory"
  else
      echo "目录已存在: $directory"
  fi
}

if [ -z "$IP" ]; then
  info "IP 不能为空。请带上 IP 参数重新执行"
  exit 1
fi

user=mangosteen
remote=$user@$IP

# 以时间位为版本号
time=$(date +'%Y%m%d-%H%M%S')

bin_dir=$(dirname $0)

# 要复制的文件
setup_host=$bin_dir/setup-remote.sh
dockerfile=$bin_dir/../Dockerfile
package_json=$bin_dir/../package.json
package_lock_json=$bin_dir/../package-lock.json
patches_dir=$bin_dir/../patches/
nginx_default_conf=$bin_dir/../nginx.default.conf

# 本地部署目录
local_deploys=tmp/deploys
local_deploy_dir=$local_deploys/$time

# 部署机下的部署目录
host_deploys=/home/$user/deploys
host_deploy_dir=$host_deploys/$time

# dist 压缩文件名
backend_dist_zip_file=$local_deploy_dir/backend_dist_$time.tar.gz

# ! 如果需要保留旧版本代码，可以注释下面的语句
info "删除部署机上的旧产物目录"
ssh $remote "rm -rf $host_deploys"

info "创建本地部署目录"
create_dir $local_deploy_dir

info "创建部署机下的部署目录"
ssh $remote "mkdir -p $host_deploy_dir"

info "删除旧有 dist 目录"
if [ -d "dist" ]; then
  rm -rf "dist"
  info "删除旧有 dist 目录成功"
else
  info "不存在旧有 dist 目录，无需删除"
fi

info "执行 npm run build"
npm run build
info "执行 npm run build 结束"

info "压缩 dist 目录"
tar \
  --exclude=".development.env" \
  -cz -f $backend_dist_zip_file -C dist .
# 加 -v 会把**被打包的文件**都列出来，不加则不列
info "压缩 dist 目录成功"

info "上传必要的文件到部署机"
scp -r \
  $setup_host \
  $dockerfile \
  $package_json \
  $package_lock_json \
  $backend_dist_zip_file \
  $patches_dir \
  $nginx_default_conf \
  $remote:$host_deploy_dir

info "输出当前版本到部署机：$time"
ssh $remote "echo $time > $host_deploy_dir/version"

info "删除本地部署目录"
rm -rf $local_deploys
info "删除 dist 目录"
rm -rf dist

info "DONE!"

info "另外请确认SSL证书是否已上传"
