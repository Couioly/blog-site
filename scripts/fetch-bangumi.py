#!/usr/bin/env python3
"""
Bangumi 番剧数据抓取脚本
========================

功能：
  1. 根据预设的 subject_id 列表，批量拉取 Bangumi 条目信息
  2. 默认写为本地静态 JSON（public/bangumi-shelf.json）
  3. --sync 模式：POST 到服务器 API，写入 MySQL，无需重新部署

使用步骤：
  # 安装依赖
  pip install requests

  # 编辑下方 SUBJECT_IDS 列表（填入你要展示的番剧 ID）
  # 然后运行以下任一命令：

  # 模式1：仅生成本地 JSON（原方案A）
  python scripts/fetch-bangumi.py

  # 模式2：生成 JSON + 同步到服务器 MySQL（推荐）
  python scripts/fetch-bangumi.py --sync --server https://junbx.cn --secret your_key

  # 搜索番剧获取 subject_id
  python scripts/fetch-bangumi.py --search "命运石之门"

如何获取 subject_id：
  - 打开 Bangumi 条目页面，如 https://bgm.tv/subject/265
  - URL 末尾的数字 265 就是 subject_id
"""

import json
import os
import sys
import time
from pathlib import Path

import requests

# ============================================================
# 配置区
# ============================================================

# Bangumi API 基础地址
BANGUMI_API = "https://api.bgm.tv"

# 自定义 User-Agent（必填！不加会被拦截）
USER_AGENT = "JunbX-Blog/1.0 (https://junbx.cn)"

# 输出 JSON 文件路径（Nuxt public 目录下，可直接通过 URL 访问）
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "public"
OUTPUT_FILE = OUTPUT_DIR / "bangumi-shelf.json"
COVERS_DIR = OUTPUT_DIR / "bangumi-covers"

# 你要展示的番剧 subject_id 列表
# 打开 https://bgm.tv/subject/{id} 即可看到详情页
# ============================================================
# 如何找到 subject_id：
#   1. 在 bgm.tv 搜索番剧名称
#   2. 进入番剧详情页，URL 中的数字即为 subject_id
#   3. 示例: https://bgm.tv/subject/265 → subject_id = 265
# ============================================================
SUBJECT_IDS = [297168, 454083, 349222, 260677]

# 请求间隔（秒），避免对 Bangumi 服务器造成压力
REQUEST_DELAY = 0.5


# ============================================================
# API 调用函数
# ============================================================

def get_subject(subject_id: int) -> dict | None:
    """
    根据 subject_id 获取条目详细信息。

    Args:
        subject_id: Bangumi 条目 ID

    Returns:
        条目信息字典，失败返回 None

    API 文档: https://bangumi.github.io/api/#/subject/getSubjectById
    """
    url = f"{BANGUMI_API}/v0/subjects/{subject_id}"
    headers = {"User-Agent": USER_AGENT}

    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        data = resp.json()

        # 提取需要的字段，过滤多余信息
        return {
            "id": data.get("id"),
            "name": data.get("name") or "",
            "name_cn": data.get("name_cn") or data.get("name") or "",
            "name_jp": data.get("name") or "",
            "summary": data.get("summary") or "",
            "images": {
                "large": (data.get("images") or {}).get("large") or "",
                "common": (data.get("images") or {}).get("common") or "",
                "medium": (data.get("images") or {}).get("medium") or "",
                "small": (data.get("images") or {}).get("small") or "",
                "grid": (data.get("images") or {}).get("grid") or "",
            },
            "rating": {
                "score": (data.get("rating") or {}).get("score") or 0,
                "total": (data.get("rating") or {}).get("total") or 0,
            },
            "type": data.get("type") or 0,
            "typeName": _type_name(data.get("type") or 0),
            "url": f"https://bgm.tv/subject/{data.get('id')}",
        }

    except requests.RequestException as e:
        print(f"  [ERROR] 获取 subject/{subject_id} 失败: {e}", file=sys.stderr)
        return None


def search_subject(keyword: str, subject_type: int = 2, limit: int = 10) -> list[dict]:
    """
    根据关键词搜索番剧条目。

    Args:
        keyword: 搜索关键词（日文/中文均可）
        subject_type: 条目类型，1=书籍, 2=动画(默认), 3=音乐, 4=游戏, 6=三次元
        limit: 返回结果数量

    Returns:
        搜索结果列表，每项包含 id, name, name_cn, url

    API 文档: https://bangumi.github.io/api/#/subject/search
    """
    url = f"{BANGUMI_API}/v0/search/subjects"
    headers = {"User-Agent": USER_AGENT}
    params = {
        "keyword": keyword,
        "type": subject_type,
        "limit": limit,
    }

    try:
        resp = requests.get(url, headers=headers, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()

        results = []
        for item in data.get("data", []):
            results.append({
                "id": item.get("id"),
                "name": item.get("name") or "",
                "name_cn": item.get("name_cn") or item.get("name") or "",
                "type": item.get("type") or subject_type,
                "url": item.get("url") or f"https://bgm.tv/subject/{item.get('id')}",
                "images": {
                    "large": (item.get("images") or {}).get("large") or "",
                    "common": (item.get("images") or {}).get("common") or "",
                    "medium": (item.get("images") or {}).get("medium") or "",
                    "small": (item.get("images") or {}).get("small") or "",
                    "grid": (item.get("images") or {}).get("grid") or "",
                },
            })
        return results

    except requests.RequestException as e:
        print(f"  [ERROR] 搜索失败: {e}", file=sys.stderr)
        return []


def _type_name(type_code: int) -> str:
    """将 type 数字转为中文名称。"""
    mapping = {1: "书籍", 2: "动画", 3: "音乐", 4: "游戏", 6: "三次元"}
    return mapping.get(type_code, "其他")


def download_cover(subject_id: int, image_url: str) -> bytes | None:
    """
    下载封面图片到本地并返回 JPEG 二进制数据。

    Args:
        subject_id: 番剧 ID
        image_url: Bangumi CDN 图片地址

    Returns:
        图片二进制数据，失败返回 None
    """
    if not image_url:
        return None

    headers = {"User-Agent": USER_AGENT}
    try:
        resp = requests.get(image_url, headers=headers, timeout=30)
        resp.raise_for_status()

        # 保存到本地（本地备份）
        COVERS_DIR.mkdir(parents=True, exist_ok=True)
        ext = ".jpg"
        if "png" in resp.headers.get("content-type", ""):
            ext = ".png"
        cover_path = COVERS_DIR / f"{subject_id}{ext}"
        with open(cover_path, "wb") as f:
            f.write(resp.content)

        return resp.content

    except requests.RequestException as e:
        print(f"    [WARN] 封面下载失败: {e}", file=sys.stderr)
        return None


def image_to_base64(image_data: bytes) -> str:
    """将图片二进制数据转为 base64 字符串。"""
    import base64
    return base64.b64encode(image_data).decode("utf-8")


# ============================================================
# 主流程
# ============================================================

def fetch_shelf() -> dict:
    """批量抓取所有 SUBJECT_IDS 对应的条目信息，同步下载封面。"""
    total = len(SUBJECT_IDS)
    subjects = []

    print(f"\n  共 {total} 个条目待抓取\n")

    for i, sid in enumerate(SUBJECT_IDS, 1):
        print(f"  [{i}/{total}] 正在获取 subject/{sid} ...", end=" ")
        result = get_subject(sid)
        if result:
            name_display = result["name_cn"] or result["name"] or "未知"
            print(f"✓ {name_display}")

            # 下载封面图片并转 base64
            cover_url = result["images"]["large"] or result["images"]["common"]
            if cover_url:
                print(f"    正在下载封面...", end=" ")
                image_data = download_cover(sid, cover_url)
                if image_data:
                    result["cover_base64"] = image_to_base64(image_data)
                    print("✓")
                else:
                    print("✗ 跳过")
            subjects.append(result)
        else:
            print("✗ 失败，已跳过")

        # 请求间隔，避免触发限流
        if i < total:
            time.sleep(REQUEST_DELAY)

    return {
        "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%S+08:00"),
        "subjects": subjects,
    }


def do_search_and_print(keyword: str, subject_type: int = 2):
    """执行搜索并以易读格式打印结果（命令行模式）。"""
    print(f"\n  搜索关键词: \"{keyword}\" (type={subject_type})\n")
    results = search_subject(keyword, subject_type)

    if not results:
        print("  未找到相关条目。")
        return

    for i, item in enumerate(results, 1):
        print(f"  [{i}] {item['name_cn']}")
        print(f"      日文名: {item['name']}")
        print(f"      subject_id: {item['id']}")
        print(f"      链接: {item['url']}")
        print(f"      封面: {item['images']['large']}")
        print()


def sync_to_server(subjects: list[dict], server_url: str, secret: str) -> bool:
    """
    将番剧数据 POST 到服务器 API，写入 MySQL。

    Args:
        subjects: 番剧数据列表
        server_url: 服务器地址，如 https://junbx.cn
        secret: 同步密钥（需与服务器 BANGUMI_SYNC_SECRET 一致）

    Returns:
        成功返回 True，失败返回 False
    """
    url = f"{server_url.rstrip('/')}/api/bangumi/sync"
    payload = {"secret": secret, "subjects": subjects}

    print(f"\n  正在同步到服务器: {url}")
    try:
        resp = requests.post(url, json=payload, timeout=30)
        resp.raise_for_status()
        result = resp.json()

        print(f"  ✓ 同步成功！写入 {result.get('upserted', 0)} 条记录")
        if result.get("errors"):
            print(f"  ⚠ 以下条目写入失败:")
            for err in result["errors"]:
                print(f"    - id={err['id']}: {err['error']}")
        return True

    except requests.RequestException as e:
        print(f"  ✗ 同步失败: {e}")
        if hasattr(e, "response") and e.response is not None:
            print(f"    服务器返回: {e.response.text[:300]}")
        return False


def _parse_arg(flag: str) -> str | None:
    """从命令行提取 --flag value 对应的值。"""
    try:
        return sys.argv[sys.argv.index(flag) + 1]
    except (ValueError, IndexError):
        return None


def main():
    # ---- 搜索模式 ----
    if "--search" in sys.argv:
        keyword = _parse_arg("--search")
        if not keyword:
            print("用法: python fetch-bangumi.py --search \"关键词\" [--type 2]")
            sys.exit(1)

        subject_type = int(_parse_arg("--type") or "2")
        do_search_and_print(keyword, subject_type)
        return

    # ---- 是否启用同步 ----
    do_sync = "--sync" in sys.argv
    server_url = _parse_arg("--server") or ("https://junbx.cn" if do_sync else "")
    secret = _parse_arg("--secret") or os.environ.get("BANGUMI_SYNC_SECRET", "")

    if do_sync and not secret:
        print("  错误: --sync 模式需要 --secret <密钥> 或设置环境变量 BANGUMI_SYNC_SECRET")
        print("  示例: python fetch-bangumi.py --sync --server https://junbx.cn --secret mykey")
        sys.exit(1)

    # ---- 批量抓取模式 ----
    print("=" * 55)
    print("  Bangumi 番剧数据抓取")
    if do_sync:
        print(f"  同步目标: {server_url}")
    print("=" * 55)

    # 确保输出目录存在
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 执行抓取
    shelf_data = fetch_shelf()
    subjects = shelf_data["subjects"]

    # 始终写入本地 JSON（作为备份）
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(shelf_data, f, ensure_ascii=False, indent=2)
    print(f"\n  ✓ 本地 JSON 已保存: {OUTPUT_FILE}")

    # 如果指定了 --sync，POST 到服务器 MySQL
    if do_sync and subjects:
        success = sync_to_server(subjects, server_url, secret)
        if not success:
            print("  ⚠ 同步到服务器失败，请检查网络和密钥")
            sys.exit(1)

    print(f"\n  ✓ 完成！成功 {len(subjects)}/{len(SUBJECT_IDS)} 个条目")
    if not do_sync:
        print(f"  💡 提示: 加上 --sync 可同步到服务器 MySQL")
    print()
if __name__ == "__main__":
    main()
