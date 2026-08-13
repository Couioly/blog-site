#!/usr/bin/env python3
"""
豆瓣读书数据抓取 + 同步脚本
==========================

用法:
  # 本地预览
  python fetch-douban-book.py --url https://book.douban.com/subject/20440895/

  # 同步到服务器 MySQL
  python fetch-douban-book.py --url https://book.douban.com/subject/20440895/ --sync --secret your_key
"""

import requests
import re
import json
import sys
import os
import time
import base64
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

USER_AGENT = "Mozilla/5.0 (compatible; JunbX-Blog/1.0; https://junbx.cn)"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "public"
COVERS_DIR = OUTPUT_DIR / "book-covers"

# 全局 Session，保持 cookie 应对反爬
session = requests.Session()
session.headers.update({"User-Agent": USER_AGENT})

# ==================== 工具函数 ====================

def _parse_arg(flag: str) -> str | None:
    try:
        return sys.argv[sys.argv.index(flag) + 1]
    except (ValueError, IndexError):
        return None


def extract_book(url: str) -> dict | None:
    """从豆瓣读书页面提取书籍信息。"""
    html = session.get(url, timeout=15).text

    # 从 URL 提取 subject_id
    subject_id_match = re.search(r'/subject/(\d+)/', url)
    book_id = int(subject_id_match.group(1)) if subject_id_match else hash(url)

    def find(regex: str, default: str = "") -> str:
        m = re.search(regex, html, re.DOTALL)
        return m.group(1).strip() if m else default

    # --- 标题 ---
    title = find(r'<meta\s+property="og:title"\s+content="([^"]+)"')

    # --- 作者 ---
    author = find(r'<meta\s+property="book:author"\s+content="([^"]+)"')

    # --- 封面 ---
    cover_url = find(r'<meta\s+property="og:image"\s+content="([^"]+)"')

    # --- 评分 ---
    rating_score = find(r'property="v:average">([^<]+)<')
    rating_total = find(r'property="v:votes">(\d+)</span>', "0")

    # --- 简介 ---
    intro = find(r'<span class="all hidden">(.*?)</span>')
    if not intro:
        intro = find(r'<div class="intro">\s*<p>(.*?)</p>')
    # 清理 HTML 标签
    intro = re.sub(r'<[^>]+>', '', intro).strip()

    # --- 详细信息 ---
    info_text = re.findall(r'<span class="pl">([^<]+)</span>\s*([^<]*)', html)
    info_map = {}
    for label, val in info_text:
        label = label.strip().rstrip(":")
        val = val.strip()
        if val:
            info_map[label] = val

    publisher = info_map.get("出版社", "")
    pub_year = info_map.get("出版年", "")
    pages = info_map.get("页数", "")
    price = info_map.get("定价", "")
    isbn = info_map.get("ISBN", "")
    binding = info_map.get("装帧", "")

    # --- 标签 ---
    tags = []
    tag_blocks = re.findall(r'<span class="tag">(.*?)</span>', html)
    for block in tag_blocks:
        tag_names = re.findall(r'>([^<]+)<', block)
        tags.extend(tag_names)

    return {
        "id": book_id,
        "book_name": title,
        "author": author,
        "cover_url": cover_url,
        "rating_score": float(rating_score) if rating_score else 0,
        "rating_total": int(rating_total) if rating_total else 0,
        "summary": intro[:1000] if intro else "",
        "publisher": publisher,
        "pub_year": pub_year,
        "pages": pages,
        "price": price,
        "isbn": isbn,
        "binding": binding,
        "tags": ", ".join(tags[:8]),
        "url": url,
    }


def download_cover(book_id: int, cover_url: str) -> bytes | None:
    """下载封面。豆瓣 CDN 有 TLS 指纹检测，requests 库会被拦截，改用 curl。"""
    if not cover_url:
        return None
    import subprocess
    try:
        result = subprocess.run([
            "curl", "-sS", "--connect-timeout", "15", "--max-time", "30",
            "-H", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "-H", "Referer: https://book.douban.com/",
            "-o", "-",  # 输出到 stdout
            cover_url,
        ], capture_output=True, timeout=35)

        if result.returncode != 0 or len(result.stdout) < 1000:
            print(f"\n    [WARN] curl 下载封面失败, rc={result.returncode}, size={len(result.stdout)}", file=sys.stderr)
            return None

        # 保存到本地
        COVERS_DIR.mkdir(parents=True, exist_ok=True)
        with open(COVERS_DIR / f"{book_id}.jpg", "wb") as f:
            f.write(result.stdout)

        return result.stdout
    except Exception as e:
        print(f"    [WARN] 封面下载失败: {e}", file=sys.stderr)
        return None


def sync_to_server(book: dict, cover_base64: str, server_url: str, secret: str) -> bool:
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
        print("用法: python fetch-douban-book.py --url <豆瓣读书URL> [--sync] [--server URL] [--secret KEY]")
        sys.exit(1)

    do_sync = "--sync" in sys.argv
    do_local = "--local" in sys.argv
    server_url = _parse_arg("--server") or "https://junbx.cn"
    secret = _parse_arg("--secret") or os.environ.get("BANGUMI_SYNC_SECRET", "")

    if do_sync and not secret:
        print("  错误: --sync 需要 --secret")
        sys.exit(1)

    print(f"  正在抓取: {url}")
    book = extract_book(url)
    if not book:
        print("  抓取失败")
        sys.exit(1)

    print(f"  标题: {book['book_name']}")
    print(f"  作者: {book['author']}")
    if book['rating_score']:
        print(f"  评分: {book['rating_score']} ({book['rating_total']}人评价)")
    print(f"  出版社: {book['publisher']} | {book['pub_year']} | {book['pages']}页 | {book['price']}")
    print(f"  标签: {book['tags']}")

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
        print(f"  ✓ 本地 JSON: {local_file}")

    # 同步
    if do_sync:
        sync_to_server(book, cover_b64, server_url, secret)


if __name__ == "__main__":
    main()
