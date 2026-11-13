# Aymen's manual tasks

Tick when done. Claude cannot do these (accounts, money, identity, your voice).

## Now
- [ ] Install local tools (they are still missing — `winget list` shows none). Run in a new PowerShell, then reopen Claude:
  `winget install -e --id Gyan.FFmpeg` · `winget install -e --id ImageMagick.ImageMagick` · `winget install -e --id 7zip.7zip`
- [ ] Add the GitHub workflow scope: `gh auth refresh -s workflow`
- [ ] YouTube Data API key (for topic research):
  1. https://console.cloud.google.com → create project "studio-research".
  2. APIs & Services → Library → "YouTube Data API v3" → Enable.
  3. APIs & Services → Credentials → Create credentials → API key.
  4. Edit the key → API restrictions → restrict to "YouTube Data API v3" only.
  5. Local: copy `.env.example` to `.env` in `D:\studio`, paste `YT_API_KEY=...` (never commit `.env`).
  6. GitHub: repo → Settings → Secrets and variables → Actions → New secret `YT_API_KEY`.
  Free quota: 10,000 units/day (one search = 100 units).

## Before launch
- [ ] Create the Brand A channel (name from the shortlist Claude will prepare and check). Use a Brand Account under your Google account.
- [ ] Enable advanced features (YouTube Studio → Settings → Channel → Feature eligibility → phone verification). Needed for Test & Compare, custom thumbnails, longer videos.
- [ ] Record a test voice take: quiet room (closet with clothes is ideal), phone 15–20 cm from mouth, airplane mode, WAV or highest-quality setting. Then ~15 min per long-video script.

## When monetized
- [ ] AdSense for YouTube → Payments → Manage settings → United States tax info → W-8BEN, claim treaty benefits for Tunisia. Without it Google may withhold up to 24 % of all earnings. Treaty rate on US-viewer royalties appears to be **15 %** (US–Tunisia convention Art. 12; secondary sources — confirm in the IRS Table 1 Tunisia row before relying on it): https://www.irs.gov/pub/irs-lbi/tax-treaty-table-1.pdf
- [ ] Ask your Tunisian bank how they receive foreign-currency transfers (USD, SWIFT, fees, whether a foreign-currency/"compte professionnel en devises" account is needed). AdSense pays by bank transfer from a $100 threshold.
- [ ] Check Facebook/Meta content monetization eligibility for Tunisia in the Professional dashboard (don't assume). TikTok Creator Rewards is not available in Tunisia.
