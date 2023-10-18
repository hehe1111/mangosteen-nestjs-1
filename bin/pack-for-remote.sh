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

# 本地部署目录
local_deploys=tmp/deploys
local_deploy_dir=$local_deploys/$time

# 后端代码压缩产物名称
backend_zip_file=$local_deploy_dir/backend_$time.tar.gz

# 部署机路径
host_deploys=/home/$user/deploys
host_deploy_dir=$host_deploys/$time

# ! 如果需要保留旧版本代码，可以注释下面的语句
info "删除部署机上的旧产物目录"
ssh $remote "rm -rf $host_deploys"

info "创建本地涉及的目录"
create_dir $local_deploy_dir

info "创建部署机下涉及的目录"
ssh $remote "mkdir -p $host_deploy_dir"

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
  -cz -f $backend_zip_file *
# 加 -v 会把**被打包的文件**都列出来，不加则不列

info "上传必要的文件到部署机"
scp \
  $setup_host \
  $dockerfile \
  $package_json \
  $package_lock_json \
  $backend_zip_file \
  $remote:$host_deploy_dir

info "输出当前版本到部署机：$time"
ssh $remote "echo $time > $host_deploy_dir/version"

info "删除本地的旧产物目录"
rm -rf $local_deploys

info "DONE!"
