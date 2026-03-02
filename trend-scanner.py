#!/usr/bin/env python3
"""
Commmonn Blog Trend Scanner
Monitors Google Trends for rising topics, finds unique angles for blog articles.
Categories aligned with blog: Tech & AI, Crypto, E-Commerce, Invest, Child Development, 
Food & Health, Travel, Auto, Fact Check, Research
"""

import json
import sys
import os
from datetime import datetime, timezone
from pytrends.request import TrendReq

# Blog categories with seed keywords for each
CATEGORY_SEEDS = {
    "Tech & AI": ["AI", "artificial intelligence", "chatgpt", "machine learning", "tech"],
    "Crypto & Bitcoin": ["bitcoin", "crypto", "ethereum", "blockchain", "defi"],
    "E-Commerce": ["amazon", "shopify", "etsy", "dropshipping", "ecommerce"],
    "Invest": ["stocks", "investing", "trading", "portfolio", "market"],
    "Child Development": ["parenting", "baby", "child development", "education", "toddler"],
    "Food & Health": ["nutrition", "health", "diet", "wellness", "food"],
    "Travel": ["travel", "tourism", "vacation", "flights", "hotels"],
    "Auto": ["electric vehicles", "tesla", "BYD", "cars", "automotive"],
}

def get_realtime_trends(pytrends):
    """Get currently trending searches from Google Trends."""
    try:
        trending = pytrends.trending_searches(pn='united_states')
        return trending[0].tolist()[:20]
    except Exception as e:
        print(f"Error getting trending searches: {e}", file=sys.stderr)
        return []

def get_related_rising(pytrends, keywords, timeframe='now 4-H'):
    """Get rising related queries for given keywords."""
    results = {}
    for kw in keywords:
        try:
            pytrends.build_payload([kw], timeframe=timeframe, geo='')
            related = pytrends.related_queries()
            if kw in related and related[kw]['rising'] is not None:
                rising = related[kw]['rising']
                top_rising = rising.head(10).to_dict('records')
                results[kw] = top_rising
        except Exception as e:
            print(f"  Skipped '{kw}': {e}", file=sys.stderr)
            continue
    return results

def get_interest_over_time(pytrends, keywords, timeframe='now 4-H'):
    """Get interest over time for keywords to detect spikes."""
    try:
        pytrends.build_payload(keywords[:5], timeframe=timeframe, geo='')
        iot = pytrends.interest_over_time()
        if iot.empty:
            return {}
        # Calculate spike: latest value vs average
        spikes = {}
        for col in iot.columns:
            if col == 'isPartial':
                continue
            values = iot[col].values
            if len(values) < 2:
                continue
            avg = values[:-1].mean() if len(values) > 1 else values[0]
            latest = values[-1]
            if avg > 0:
                spike_ratio = latest / avg
                spikes[col] = {
                    'latest': int(latest),
                    'average': round(float(avg), 1),
                    'spike_ratio': round(float(spike_ratio), 2)
                }
        return spikes
    except Exception as e:
        print(f"  Error getting interest over time: {e}", file=sys.stderr)
        return {}

def scan_all_categories(timeframe='now 4-H'):
    """Scan all blog categories for rising trends."""
    pytrends = TrendReq(hl='en-US', tz=480)  # HKT timezone offset
    
    report = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'timeframe': timeframe,
        'trending_searches': [],
        'category_trends': {},
        'article_ideas': []
    }
    
    # 1. Get real-time trending searches
    print("📊 Fetching real-time trending searches...", file=sys.stderr)
    trending = get_realtime_trends(pytrends)
    report['trending_searches'] = trending
    
    # 2. Scan each category for rising queries
    for category, seeds in CATEGORY_SEEDS.items():
        print(f"🔍 Scanning: {category}...", file=sys.stderr)
        rising = get_related_rising(pytrends, seeds, timeframe)
        spikes = get_interest_over_time(pytrends, seeds, timeframe)
        
        report['category_trends'][category] = {
            'rising_queries': rising,
            'interest_spikes': spikes
        }
    
    # 3. Cross-reference trending searches with categories
    # Find trending topics that intersect with blog categories
    trending_lower = [t.lower() for t in trending]
    for category, seeds in CATEGORY_SEEDS.items():
        for seed in seeds:
            for i, trend in enumerate(trending_lower):
                if seed.lower() in trend or any(word in trend for word in seed.lower().split()):
                    report['article_ideas'].append({
                        'trending_topic': trending[i],
                        'category': category,
                        'matched_seed': seed,
                        'priority': 'high'
                    })
    
    # 4. Add rising queries as article ideas
    for category, data in report['category_trends'].items():
        for seed, queries in data.get('rising_queries', {}).items():
            for q in queries[:3]:  # Top 3 per seed
                if q.get('value', 0) >= 100:  # Only breakout/high-rise topics
                    report['article_ideas'].append({
                        'trending_topic': q['query'],
                        'category': category,
                        'rise_value': q['value'],
                        'matched_seed': seed,
                        'priority': 'medium'
                    })
    
    return report

def format_report(report):
    """Format report as readable markdown."""
    lines = []
    ts = report['timestamp'][:19].replace('T', ' ')
    lines.append(f"# 📈 Trend Scanner Report — {ts} UTC")
    lines.append(f"Timeframe: {report['timeframe']}\n")
    
    # Trending searches
    lines.append("## 🔥 Top Trending Searches (US)")
    for i, t in enumerate(report['trending_searches'][:15], 1):
        lines.append(f"{i}. {t}")
    lines.append("")
    
    # Category spikes
    lines.append("## 📊 Category Interest Spikes")
    for cat, data in report['category_trends'].items():
        spikes = data.get('interest_spikes', {})
        if spikes:
            spike_items = [(k, v) for k, v in spikes.items() if v['spike_ratio'] > 1.2]
            if spike_items:
                lines.append(f"\n### {cat}")
                for kw, info in sorted(spike_items, key=lambda x: x[1]['spike_ratio'], reverse=True):
                    lines.append(f"- **{kw}**: {info['spike_ratio']}x spike (latest: {info['latest']}, avg: {info['average']})")
    lines.append("")
    
    # Rising queries
    lines.append("## 🚀 Rising Queries by Category")
    for cat, data in report['category_trends'].items():
        rising = data.get('rising_queries', {})
        has_rising = any(len(v) > 0 for v in rising.values())
        if has_rising:
            lines.append(f"\n### {cat}")
            for seed, queries in rising.items():
                if queries:
                    lines.append(f"  **{seed}**:")
                    for q in queries[:5]:
                        val = q.get('value', '?')
                        label = "🔥 BREAKOUT" if val == 'Breakout' or (isinstance(val, (int, float)) and val >= 500) else f"+{val}%"
                        lines.append(f"  - {q['query']} ({label})")
    lines.append("")
    
    # Article ideas
    if report['article_ideas']:
        lines.append("## 💡 Article Ideas")
        seen = set()
        for idea in sorted(report['article_ideas'], key=lambda x: 0 if x['priority'] == 'high' else 1):
            topic = idea['trending_topic']
            if topic.lower() in seen:
                continue
            seen.add(topic.lower())
            priority_icon = "🔴" if idea['priority'] == 'high' else "🟡"
            lines.append(f"- {priority_icon} **{topic}** → {idea['category']}")
    
    return "\n".join(lines)

if __name__ == '__main__':
    timeframe = sys.argv[1] if len(sys.argv) > 1 else 'now 4-H'
    report = scan_all_categories(timeframe)
    
    # Save JSON
    out_path = '/home/node/aibot/blog/trend-report.json'
    with open(out_path, 'w') as f:
        json.dump(report, f, indent=2)
    
    # Print formatted report
    print(format_report(report))
