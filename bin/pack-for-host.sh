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
# 开发容器路径
bin_dir=$(dirname $0)
dockerfile=$bin_dir/../host.Dockerfile
setup_host=$bin_dir/setup_host.sh
setup_host=$bin_dir/src/

# 宿主机路径
host_deploys=tmp/deploys
host_deploy_dir=$host_deploys/$time
backend_zip_file=$host_deploy_dir/backend_$time.tar.gz

info "创建宿主机下涉及的目录"
create_dir $host_deploy_dir

info "生成后端代码压缩文件"
# 需要上传的文件
# src/
# test/
# *.Dockerfile
# package.json
# package-lock.json
# tsconfig.build.json
# tsconfig.json
tar \
  --exclude="bin/pack-for-*.sh" \
  --exclude="dist" \
  --exclude="node_modules" \
  --exclude="tmp" \
  --exclude=".dockerignore" \
  --exclude="*.Dockerfile" \
  --exclude=".eslintrc.js" \
  --exclude=".gitoignore" \
  --exclude=".prettierrc" \
  --exclude="nest-cli.json" \
  --exclude="README.md" \
  -czv -f $backend_zip_file *

info "复制必要的文件、产物、依赖、API 文档、前端代码到宿主机"
cp $dockerfile $host_deploy_dir/Dockerfile
info "输出当前版本到宿主机：$time"
echo $time > $host_deploy_dir/version

info "DONE!"
