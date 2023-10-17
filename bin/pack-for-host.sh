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

# 以时间位为版本号
time=$(date +'%Y%m%d-%H%M%S')
bin_dir=$(dirname $0)
setup_host=$bin_dir/setup-host.sh
dockerfile=$bin_dir/../Dockerfile
package_json=$bin_dir/../package.json
package_lock_json=$bin_dir/../package-lock.json
host_deploys=tmp/deploys
host_deploy_dir=$host_deploys/$time
backend_zip_file=$host_deploy_dir/backend_$time.tar.gz

# ! 如果需要保留旧版本代码，可以注释这一个条件分支
if [ -d "$host_deploys" ]; then
  info "删除宿主机上的旧产物目录"
  rm -rf $host_deploys
fi

info "创建宿主机下涉及的目录"
create_dir $host_deploy_dir

info "生成后端代码压缩文件"
tar \
  --exclude="bin" \
  --exclude="dist" \
  --exclude="node_modules" \
  --exclude="tmp" \
  --exclude="Dockerfile" \
  --exclude="nest-cli.json" \
  --exclude="package*.json" \
  --exclude="README.md" \
  -czv -f $backend_zip_file *

info "复制必要的文件到宿主机"
cp \
  $setup_host \
  $dockerfile \
  $package_json \
  $package_lock_json \
  $host_deploy_dir

info "输出当前版本到宿主机：$time"
echo $time > $host_deploy_dir/version

info "DONE!"
