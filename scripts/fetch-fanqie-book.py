#!/usr/bin/env python3
"""
番茄小说数据抓取 + 同步脚本
==========================

用法:
  # 本地预览（仅打印信息）
  python fetch-fanqie-book.py --url https://fanqienovel.com/page/7574757138854054974

  # 同步到服务器 MySQL
  python fetch-fanqie-book.py --url https://fanqienovel.com/page/7574757138854054974 --sync --server https://junbx.cn --secret your_key

  # 也支持仅本地生成 JSON
  python fetch-fanqie-book.py --url https://fanqienovel.com/page/7574757138854054974 --local
"""

import requests
import re
import json
import sys
import os
import time
import base64
from pathlib import Path

# 修复 Windows 控制台中文乱码
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

USER_AGENT = "JunbX-Blog/1.0 (https://junbx.cn)"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "public"
COVERS_DIR = OUTPUT_DIR / "book-covers"

# ==================== 解析函数 ====================

def _parse_arg(flag: str) -> str | None:
    try:
        return sys.argv[sys.argv.index(flag) + 1]
    except (ValueError, IndexError):
        return None


def extract_book_from_url(url: str) -> dict | None:
    """从番茄小说页面提取书籍信息，返回字典。"""
    html = requests.get(url, headers={"User-Agent": USER_AGENT}).text

    match = re.search(r'window\.__INITIAL_STATE__\s*=\s*({.*?});', html, re.DOTALL)
    if not match:
        print("  未找到 __INITIAL_STATE__ 数据", file=sys.stderr)
        return None

    data = json.loads(match.group(1))
    page = data.get("page", {})

    # 提取书名ID（从URL尾部）
    book_id_str = url.rstrip("/").rsplit("/", 1)[-1]

    tags = []
    category_v2 = page.get("categoryV2", "")
    if category_v2:
        try:
            tags = [c["Name"] for c in json.loads(category_v2)]
        except (json.JSONDecodeError, KeyError):
            pass

    return {
        "id": int(book_id_str) if book_id_str.isdigit() else hash(url),
        "book_name": page.get("bookName", ""),
        "author": page.get("author", ""),
        "author_desc": page.get("description", ""),
        "status": "已完结" if page.get("status") == 1 else "连载中",
        "word_count": page.get("wordNumber", 0),
        "tags": ", ".join(tags),
        "cover_url": page.get("thumbUrl", ""),
        "abstract": page.get("abstract", ""),
        "url": url,
    }


def download_cover(book_id: int, cover_url: str) -> bytes | None:
    """下载封面图片。"""
    if not cover_url:
        return None
    try:
        resp = requests.get(cover_url, headers={"User-Agent": USER_AGENT}, timeout=30)
        resp.raise_for_status()

        COVERS_DIR.mkdir(parents=True, exist_ok=True)
        cover_path = COVERS_DIR / f"{book_id}.jpg"
        with open(cover_path, "wb") as f:
            f.write(resp.content)
        return resp.content
    except requests.RequestException as e:
        print(f"    [WARN] 封面下载失败: {e}", file=sys.stderr)
        return None


def sync_to_server(book: dict, cover_base64: str, server_url: str, secret: str) -> bool:
    """POST 单本书到服务器 API。"""
    url = f"{server_url.rstrip('/')}/api/books/sync"
    payload = {"secret": secret, "books": [{**book, "cover_base64": cover_base64}]}

    print(f"\n  正在同步到服务器: {url}")
    try:
        resp = requests.post(url, json=payload, timeout=30)
        resp.raise_for_status()
        result = resp.json()
        print(f"  ✓ 同步成功！写入 {result.get('upserted', 0)} 条记录")
        return True
    except requests.RequestException as e:
        print(f"  ✗ 同步失败: {e}")
        if hasattr(e, "response") and e.response is not None:
            print(f"    服务器返回: {e.response.text[:300]}")
        return False


# ==================== 主流程 ====================

def main():
    url = _parse_arg("--url")
    if not url:
        print("用法: python fetch-fanqie-book.py --url <番茄小说URL> [--sync] [--server URL] [--secret KEY]")
        sys.exit(1)

    do_sync = "--sync" in sys.argv
    do_local = "--local" in sys.argv
    server_url = _parse_arg("--server") or "https://junbx.cn"
    secret = _parse_arg("--secret") or os.environ.get("BANGUMI_SYNC_SECRET", "")

    if do_sync and not secret:
        print("  错误: --sync 模式需要 --secret <密钥> 或环境变量 BANGUMI_SYNC_SECRET")
        sys.exit(1)

    print(f"  正在抓取: {url}")
    book = extract_book_from_url(url)

    if not book:
        print("  抓取失败")
        sys.exit(1)

    # 打印信息
    print(f"  标题: {book['book_name']}")
    print(f"  作者: {book['author']}")
    print(f"  状态: {book['status']} | 字数: {book['word_count']}")
    print(f"  标签: {book['tags']}")
    print(f"  封面: {book['cover_url']}")

    # 下载封面
    cover_b64 = ""
    if book["cover_url"]:
        print("  正在下载封面...", end=" ")
        img_data = download_cover(book["id"], book["cover_url"])
        if img_data:
            cover_b64 = base64.b64encode(img_data).decode("utf-8")
            print("✓")
        else:
            print("✗")

    # 本地 JSON
    if do_local or not do_sync:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        local_file = OUTPUT_DIR / f"book-{book['id']}.json"
        with open(local_file, "w", encoding="utf-8") as f:
            json.dump(book, f, ensure_ascii=False, indent=2)
        print(f"  ✓ 本地 JSON 已保存: {local_file}")

    # 同步到服务器
    if do_sync:
        sync_to_server(book, cover_b64, server_url, secret)


if __name__ == "__main__":
    main()
