---
name: topic-research
description: Find proven-demand video topics with the YouTube Data API (outliers = views ÷ subscribers ≥ 3, last 2 years), autocomplete, and a competitor scan. Use before choosing any episode topic.
---

# topic-research

Needs `YT_API_KEY` (local `.env`, or the GitHub secret in CI). Never print the key.

1. Seed queries: the candidate topic plus 3–5 variants (e.g. "biggest animals ever", "size comparison predators").
2. Run `python tools/topic_research.py "<query>" ...` → `search.list` (type=video, publishedAfter = today − 2 years, order=viewCount, 50 results/query) → `videos.list` (views, duration) → `channels.list` (subscribers).
3. Keep videos with views ÷ subscribers ≥ 3. Split Shorts (≤ 60 s) and long videos.
4. Autocomplete: suggestqueries endpoint for each seed; record phrasing people actually type.
5. Competitor scan: top 5 channels in the results — upload cadence, typical length, title/thumbnail patterns, what they do not cover.
6. Save `research.md` with: table of outliers (title, channel, subs, views, ratio, date, URL), demand verdict (strong / weak / none), angle we can do better, 3 title ideas.
7. Quota: search.list costs 100 units; the default daily quota is 10,000. Cache results in `.cache/research/` for 7 days.
