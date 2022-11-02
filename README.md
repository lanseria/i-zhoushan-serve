# i-zhoushan 地图分享后端


## 技术栈

- mongodb mongoose 数据库
- nestjs nodejs后端框架
- swagger-ui api接口文档
- got 接受转发
- crypto-js 数据加解密

## 进行开发

1. node -v
2. npm i -g pnpm
3. npm i -g @antfu/ni
4. ni 
5. nr start:dev

## minio 安装部署

为了方便迁移，使用容器

```
docker volume create minio-data
```

开启容器
```
docker run -itd --name minio -p 9000:9000 -p 9001:9001 -e "MINIO_ROOT_USER=root" -e "MINIO_ROOT_PASSWORD=bO3uX0uU3kB9cT2h" -v minio-data:/data minio/minio server /data --console-address ":9001"
```
登录 minio 创建 `izhoushan` bucket, 并将权限设置为 public


## Image.Weserv.Nl 图片处理服务

安装`docker`服务

```
docker run -d -p 9002:80 --shm-size=1gb --name=weserv-image supersandro2000/images-weserv
```

举例
```
http://localhost:9002/?url=https://minio9000.vip.cpolar.top/izhoushan/217aaba73bba627f4d6412ebc1fde8a52f0b66b3156f8dca47e79c9673a95e84fad04c9f7038fafca423c61c9a60b552d2b3b4a9af736e3d261b1c62fad41627.png&w=300&h=300
```

## 配置nginx用来合并服务(可选)

使用一个域名走所有服务

飞书文档(可申请)
```
https://enjqkboeqf.feishu.cn/docx/J8sIdaLd0okGDMxexRrc2Tgvn5b#YGm0dGmMIo0eYIxW2RwcLJMnnNh
```
```
docker run --name izhoushan-ui -itd -v /home/dell/deploy/i-zhoushan-pc:/usr/share/nginx/html -v /home/dell/deploy/i-zhoushan-serve/nginx/conf.d/default.conf:/etc/nginx/conf.d/default.conf -v /home/dell/deploy/i-zhoushan-serve/nginx/nginx.conf:/etc/nginx/nginx.conf -p 8080:8000 --link minio --link izhoushan-serve --restart always nginx
```

## 启动nestjs服务

```
docker run -itd --name izhoushan-serve -e TZ=Asia/Shanghai --link mongo-db:mongo-db --link minio:minio -v /home/dell/i-zhoushan-serve:/usr/src/myapp -w /usr/src/myapp -p 8080:8080 --restart always node:16.17.0 npm run start:prod
```
