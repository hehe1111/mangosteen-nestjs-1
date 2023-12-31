# 一个用于记账的后台应用

技术栈：Nest.js + TypeORM + MySQL + Redis + nodemailer + JWT + Swagger

## 启动本项目

1. 安装依赖 `npm install`
2. 开发环境配置 `src/.development.env` 文件，生产环境配置 `src/.production.env` 文件：

```bash
# 项目启动端口
NESTJS_PORT=3000

# 邮件服务：nodemailer 配置
NODEMAILER_HOST=邮箱服务器
NODEMAILER_PORT=邮箱服务器端口
NODEMAILER_EMAIL_FROM=发送邮件的邮箱
NODEMAILER_AUTHORIZATION_CODE=发送邮件的邮箱的授权码

# MySQL 配置
MYSQL_HOST=mysql 宿主机地址
MYSQL_PORT=mysql 运行端口
MYSQL_USERNAME=mysql 用户
MYSQL_PASSWORD=mysql 密码
MYSQL_DATABASE=mysql 数据库名字

# Redis 配置
REDIS_HOST=redis 宿主机地址
REDIS_PORT=redis 运行端口
REDIS_DATABASE=redis 数据库 # 阿拉伯数字。默认是 0

# JWT 配置
JWT_SECRET=JWT 密钥
JWT_ACCESS_TOKEN_EXPIRES_IN=JWT 过期时间

# Swagger 配置
API_DOC_PATH=API 文档路径
```

3. 启动 MySQL、Redis。如果使用 Docker，则是启动各自对应的容器
4. 创建数据库

```sql
CREATE SCHEMA <替换为上面的 MYSQL_DATABASE 的值> DEFAULT CHARACTER SET utf8mb4;
```

5. 本地开发 `npm run start:dev`
6. API 文档：假设启动端口为 3000，配置的路径为 `/apidoc`，则本地开发时文档地址为：`http://localshot:3000/apidoc`
7. 打包 `npm run build`
