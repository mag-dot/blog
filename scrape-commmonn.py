#!/usr/bin/env python3
"""Scrape all blog posts from commmonn.com and convert to MDX for tailwind-nextjs-starter-blog"""

import subprocess
import json
import re
import os
import time
from datetime import datetime
from urllib.request import urlopen, Request
from urllib.error import HTTPError, URLError

POSTS_FILE = "/tmp/commmonn-posts.txt"
BLOG_DIR = "/home/node/aibot/blog/data/blog"
IMAGES_DIR = "/home/node/aibot/blog/public/static/images/commmonn"

os.makedirs(IMAGES_DIR, exist_ok=True)

def fetch_url(url, max_retries=3):
    """Fetch URL content with retries"""
    for attempt in range(max_retries):
        try:
            req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urlopen(req, timeout=15) as resp:
                return resp.read().decode('utf-8', errors='replace')
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2)
            else:
                print(f"  FAILED to fetch {url}: {e}")
                return None

def extract_article_content(html):
    """Extract article content from Wix blog HTML"""
    # Try to get the article body - Wix uses specific data attributes
    # Look for the main content between known markers
    
    # Extract title from og:title or <title>
    title_match = re.search(r'<meta\s+property="og:title"\s+content="([^"]*)"', html)
    if not title_match:
        title_match = re.search(r'<title>([^<]+)</title>', html)
    title = title_match.group(1) if title_match else "Untitled"
    title = title.replace(' | Commmonn Ground', '').strip()
    
    # Extract description
    desc_match = re.search(r'<meta\s+property="og:description"\s+content="([^"]*)"', html)
    if not desc_match:
        desc_match = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', html)
    description = desc_match.group(1) if desc_match else ""
    
    # Extract date from article:published_time or similar
    date_match = re.search(r'<meta\s+property="article:published_time"\s+content="([^"]*)"', html)
    if date_match:
        try:
            dt = datetime.fromisoformat(date_match.group(1).replace('Z', '+00:00'))
            date_str = dt.strftime('%Y-%m-%d')
        except:
            date_str = '2025-01-01'
    else:
        date_str = '2025-01-01'
    
    # Extract og:image
    img_match = re.search(r'<meta\s+property="og:image"\s+content="([^"]*)"', html)
    og_image = img_match.group(1) if img_match else ""
    
    # Extract tags/keywords
    tags_match = re.search(r'<meta\s+name="keywords"\s+content="([^"]*)"', html)
    tags = []
    if tags_match:
        tags = [t.strip() for t in tags_match.group(1).split(',')][:5]
    
    # Extract article body - Wix wraps content in specific divs
    # Try multiple extraction strategies
    content = ""
    
    # Strategy 1: Look for article tag content
    article_match = re.search(r'<article[^>]*>(.*?)</article>', html, re.DOTALL)
    if article_match:
        content = article_match.group(1)
    
    # Strategy 2: Look for rich-text content blocks
    if not content or len(content) < 100:
        blocks = re.findall(r'<div[^>]*data-hook="[^"]*"[^>]*>(.*?)</div>', html, re.DOTALL)
        if blocks:
            content = '\n'.join(blocks)
    
    # Strategy 3: Look for paragraphs with substantial text
    if not content or len(content) < 100:
        paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', html, re.DOTALL)
        content = '\n\n'.join(p for p in paragraphs if len(p) > 30)
    
    # Clean HTML to markdown-ish text
    content = clean_html_to_md(content)
    
    return {
        'title': title,
        'date': date_str,
        'description': description,
        'tags': tags,
        'og_image': og_image,
        'content': content
    }

def clean_html_to_md(html):
    """Convert HTML to rough markdown"""
    if not html:
        return ""
    
    # Replace common HTML elements
    text = html
    
    # Headers
    text = re.sub(r'<h1[^>]*>(.*?)</h1>', r'# \1', text, flags=re.DOTALL)
    text = re.sub(r'<h2[^>]*>(.*?)</h2>', r'## \1', text, flags=re.DOTALL)
    text = re.sub(r'<h3[^>]*>(.*?)</h3>', r'### \1', text, flags=re.DOTALL)
    text = re.sub(r'<h4[^>]*>(.*?)</h4>', r'#### \1', text, flags=re.DOTALL)
    
    # Bold and italic
    text = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', text, flags=re.DOTALL)
    text = re.sub(r'<b[^>]*>(.*?)</b>', r'**\1**', text, flags=re.DOTALL)
    text = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', text, flags=re.DOTALL)
    text = re.sub(r'<i[^>]*>(.*?)</i>', r'*\1*', text, flags=re.DOTALL)
    
    # Links
    text = re.sub(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', r'[\2](\1)', text, flags=re.DOTALL)
    
    # Images
    text = re.sub(r'<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*/?\s*>', r'![\2](\1)', text, flags=re.DOTALL)
    text = re.sub(r'<img[^>]*src="([^"]*)"[^>]*/?\s*>', r'![](\1)', text, flags=re.DOTALL)
    
    # Lists
    text = re.sub(r'<li[^>]*>(.*?)</li>', r'- \1', text, flags=re.DOTALL)
    
    # Paragraphs and breaks
    text = re.sub(r'<br\s*/?\s*>', '\n', text)
    text = re.sub(r'<p[^>]*>(.*?)</p>', r'\1\n\n', text, flags=re.DOTALL)
    
    # Remove remaining HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Clean up entities
    text = text.replace('&amp;', '&')
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&quot;', '"')
    text = text.replace('&#39;', "'")
    text = text.replace('&nbsp;', ' ')
    
    # Clean whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip()
    
    return text

def slug_from_url(url):
    """Extract slug from commmonn.com URL"""
    return url.rstrip('/').split('/')[-1]

def write_mdx(data, slug):
    """Write MDX file for the blog"""
    # Escape quotes in title and description
    title = data['title'].replace("'", "\\'").replace('"', '\\"')
    desc = data['description'].replace("'", "\\'").replace('"', '\\"')
    
    tags_str = json.dumps(data['tags']) if data['tags'] else "['blog']"
    
    # Build frontmatter
    lines = [
        '---',
        f"title: \"{title}\"",
        f"date: '{data['date']}'",
        f"tags: {tags_str}",
        'draft: false',
        f"summary: \"{desc}\"",
    ]
    if data.get('og_image'):
        lines.append(f"images: ['{data['og_image']}']")
    lines.append('---')
    lines.append('')
    lines.append(data['content'] if data['content'] else f"*Content migrated from [commmonn.com](https://www.commmonn.com/post/{slug})*")
    
    filepath = os.path.join(BLOG_DIR, f"{slug}.mdx")
    with open(filepath, 'w') as f:
        f.write('\n'.join(lines))
    
    return filepath

def main():
    with open(POSTS_FILE) as f:
        urls = [line.strip() for line in f if line.strip()]
    
    print(f"Found {len(urls)} posts to migrate")
    
    success = 0
    failed = 0
    
    for i, url in enumerate(urls):
        slug = slug_from_url(url)
        print(f"[{i+1}/{len(urls)}] {slug[:60]}...")
        
        html = fetch_url(url)
        if not html:
            failed += 1
            continue
        
        data = extract_article_content(html)
        
        if not data['content'] or len(data['content']) < 50:
            # Try web_fetch via jina reader as fallback
            print(f"  Thin content ({len(data.get('content',''))} chars), trying alternative...")
            # Use curl to jina reader
            try:
                result = subprocess.run(
                    ['curl', '-s', f'https://r.jina.ai/{url}', '-H', 'Accept: text/markdown'],
                    capture_output=True, text=True, timeout=15
                )
                if result.returncode == 0 and len(result.stdout) > 100:
                    data['content'] = result.stdout
            except:
                pass
        
        filepath = write_mdx(data, slug)
        content_len = len(data.get('content', ''))
        print(f"  ✅ {data['date']} | {content_len} chars | {os.path.basename(filepath)}")
        success += 1
        
        # Small delay to be polite
        time.sleep(0.5)
    
    print(f"\n{'='*50}")
    print(f"Done: {success} migrated, {failed} failed out of {len(urls)}")

if __name__ == '__main__':
    main()
