---
title: 阿里云部署报错集
date: 2026-07-12
description: ParallelWorld 项目在阿里云 ECS 上 Docker Compose 部署时遇到的各种报错及解决方案汇总
tags:
  - devops
  - aliyun
  - server
  - deployment
  - docker
---

## 阿里云部署报错集

ParallelWorld 项目 Docker Compose 部署遇到的问题及解决方案

环境：阿里云 ECS 1.8GB，Alibaba Cloud Linux 3，Docker 26+

### docker compose 找不到配置文件

错误信息：

```text
no configuration file provided: not found
```

原因：直接执行 `docker compose up -d`，默认找 `docker-compose.yml`，但项目配置文件名为 `docker-compose.prod.yml`，默认不匹配。

解决：用 `-f` 显式指定配置文件：

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 缺少 .env.production 文件

错误信息：

```text
Couldn't find env file: /xxx/.env.production
```

原因：仓库里只有 `.env.template`（模板），没有实际的 `.env.production`。模板可以提交 git，但真实密码必须新建文件。

解决：

```bash
cd /codedir/aicode/parallel-world/deploy
cp .env.template .env.production
vim .env.production  # 填入真实密码和密钥
```

关键变量：

| 变量 | 示例值 |
|------|--------|
| `SECRET_KEY` | `openssl rand -hex 32` 生成 |
| `DATABASE_URL` | `mysql+aiomysql://root:密码@mysql:3306/parallel_world` |
| `MYSQL_ROOT_PASSWORD` | 与 DATABASE_URL 中的密码一致 |
| `REDIS_URL` | `redis://redis:6379/0` |

教训：部署文档要写清楚「先创建 `.env.production`」。

### Docker Hub 镜像拉取超时

错误信息：

```text
Get "https://registry-1.docker.io/v2/": net/http: request canceled while
waiting for connection (Client.Timeout exceeded while awaiting headers)
```

原因：国内网络无法直接访问 Docker Hub（`registry-1.docker.io`），该服务服务器部署于境外，中国大陆常规家用网络无法直接访问。

解决：配置阿里云专属镜像加速器（ECS 同机房内网拉取最快）：

1. 打开 [cr.console.aliyun.com](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors) 的镜像工具 - 镜像加速器
2. 复制你的专属加速器地址（每个阿里云账号不同）
3. 写入 `/etc/docker/daemon.json`：

```bash
sudo tee /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://你的专属ID.mirror.aliyuncs.com"
  ]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```

4. 验证生效：

```bash
docker info | grep -A 5 "Registry Mirrors"
```

备选公共镜像源（阿里云专属源不可用时）：

```json
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.xuanyuan.me"
  ]
}
```

### docker build 拉取基础镜像仍然超时

错误信息：

```text
=> ERROR [app internal] load metadata for docker.io/library/python:3.12-slim
failed to solve: DeadlineExceeded: python:3.12-slim: failed to resolve
source metadata: dial tcp 108.160.173.207:443: i/o timeout
```

原因：`registry-mirrors` 只对 `docker pull` 有效，`docker build` 拉取基础镜像时走的是 BuildKit 的后端，不会走 daemon 的镜像源配置。所以 mysql/nginx/redis 能 `docker pull` 成功，但 `docker build` 里 `FROM python:3.12-slim` 仍然直连 Docker Hub 导致超时。

解决：先通过镜像源前缀直接拉取基础镜像到本地，再 build：

```bash
# 用镜像源前缀直接拉（绕过 Dockerfile 的网络请求）
docker pull docker.1ms.run/library/python:3.12-slim

# 打回官方 tag
docker tag docker.1ms.run/library/python:3.12-slim python:3.12-slim

# 此时本地已有 python:3.12-slim，build 时不需再拉
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

通用规律：

| 镜像源前缀 | 示例 |
|-----------|------|
| `docker.1ms.run/library/` | `docker.1ms.run/library/python:3.12-slim` |
| `hub-mirror.c.163.com/library/` | `hub-mirror.c.163.com/library/python:3.12-slim` |

### docker-compose.yml 中 version 字段已废弃

警告信息：

```text
WARN[0000] docker-compose.prod.yml: `version` is obsolete
```

原因：Docker Compose V2（`docker compose`，空格）不再需要 `version` 字段，这是一个声明式字段的残留。

解决：删除 `docker-compose.prod.yml` 第一行的 `version: "3.8"` 即可消除警告。不影响运行，属于可选优化。
