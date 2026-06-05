# 🛡️ GitHub Guard

GitHub Guard is an automated security and quality-control solution designed for software-focused Reddit communities. It helps moderators and users make safe, informed decisions about external GitHub links by providing transparent audits and actionable insights — while supporting legitimate open-source developers.

📂 **Source:** [github.com/YodaGuru/GitHub-Guard](https://github.com/YodaGuru/GitHub-Guard)

---

## 🔍 How It Works

GitHub Guard performs a real-time Trust Audit on every GitHub link posted or commented, evaluating projects based on six key trust signals:

| Signal | Description | Default Threshold |
|--------|-------------|-------------------|
| ⭐ Community Trust | Star count | 5+ stars |
| 📅 Maturity | Repository age | 30+ days old |
| ⚖️ Legal Clarity | Open source license present | Any SPDX license |
| 🛡️ Security Policy | `SECURITY.md` in root, `.github/`, or `docs/` | Must exist |
| ✍️ Signed Commits | Cryptographically verified commits | Latest commit signed |
| 🏢 Entity Status | Repository owned by a GitHub Organisation | Org ownership |

All six thresholds and checks are fully configurable per subreddit by moderators.

---

## 📊 Advisory Model

- **Trust Score (0–6):** A snapshot of the project's maturity and safety, shown on every audit comment.
- **Audit Trail:** Highlights exactly which signals passed or failed, including the actual star count.
- **Risk Warnings:** Flags repositories containing installation scripts (`.sh`, `.py`) that may require elevated privileges.
- **Silent Mode:** Optionally suppress comments on high-scoring repos so the bot only speaks up when there's a concern.
- **Edit Protection:** Posts are re-scanned when edited, preventing the swap attack (post a clean repo, pass the scan, edit to a malicious one).

---

## 🚨 Automated Threat Removal

GitHub Guard automatically removes posts matching known malicious patterns:

- **Impersonation:** Fake versions of sensitive apps (LastPass, MetaMask, Notion, Ledger, Malwarebytes, Passbolt, Proton — fully customisable list).
- **Zero-Day Risk:** Brand-new repositories with zero stars that contain automated install scripts.

> Approved users and moderators are always exempt from automated removal. Trusted organisations and specific repos can be whitelisted in settings.

---

## ⚙️ Subreddit Configuration

Every setting is configurable per subreddit. Moderators can adjust everything from the App Settings page on new Reddit:

```
reddit.com/r/YOURSUBREDDIT/about/apps
```

**Available settings groups:**

- **⭐ Audit Thresholds** — Minimum star count and repo age
- **🔍 Audit Checks** — Enable/disable each of the 6 checks independently
- **⚖️ Scoring & Actions** — Pass threshold, audit comment behaviour, post vs comment scanning, edit rescanning, silent mode for popular repos
- **🔨 Nuclear Option** — Master removal switch, per-trigger toggles, custom impersonation keywords, custom removal message
- **✅ Exemptions** — Trusted GitHub orgs, always-allowed repos, exempt post flairs, mod exemption toggle

> ⚠️ App Settings requires new Reddit. The bot itself works on both old and new Reddit.

---

## 🛠️ Mod Tools

**Post menu (new Reddit):**
- 🛡️ **GitHub Guard: Scan Post** — Manually trigger a scan on any post, bypasses cache
- 🚩 **Report GitHub Link to Mods** — Available to all users; rate-limited to one report per user per post; sends modmail and logs to the dashboard

**Subreddit menu (new Reddit):**
- 🛡️ **GitHub Guard: Refresh Dashboard** — Regenerates the mod dashboard wiki page

---

## 📋 Mod Dashboard

GitHub Guard maintains a running log of all scan activity, viewable as a wiki page:

```
old.reddit.com/r/YOURSUBREDDIT/wiki/github-guard-dashboard
```

The dashboard shows:
- 7-day summary (removed / warned / passed counts)
- Full scan history with repo, score, action, author, post link, and date
- Pending community reports

> The dashboard is best viewed on old Reddit. New Reddit's visual wiki editor does not render the markdown tables correctly.

Refresh the dashboard any time via the subreddit menu → **🛡️ GitHub Guard: Refresh Dashboard**.

The dashboard link is also included automatically in every removal comment and every community report modmail, so mods always have it in context when they need it.

---

## 🚀 Installation

1. Install the app from the [Devvit App Directory](https://developers.reddit.com/apps/github-guard)
2. Go to `reddit.com/r/YOURSUBREDDIT/about/apps` and open GitHub Guard settings
3. Add your **GitHub Personal Access Token** (required — create one at [github.com/settings/tokens](https://github.com/settings/tokens), no special scopes needed)
4. Enable your subreddit wiki if not already enabled (`reddit.com/r/YOURSUBREDDIT/about/edit` → Wiki → Enabled)
5. Adjust thresholds and toggles to match your community's standards
6. Make a test post with a GitHub link to verify the bot is working

> Without a GitHub token the bot will hit GitHub's unauthenticated rate limit of 60 requests/hour, which will cause missed scans on active subreddits.

---

## 🛡️ Privacy & Security

- **No PII collected:** No user personally identifiable information is collected, stored, or transmitted.
- **Limited scope:** All outbound requests are strictly limited to fetching public repository metadata via the GitHub API.
- **Transparency:** Entire source code is open-source and available for community review.
- **Scan cache:** Results are cached for 1 hour in Redis to avoid redundant API calls. Cached results are re-posted with a note indicating they are from cache.

---

## 🤝 Contributing

Contributions are welcome!

- Fork the repository
- Create a feature branch
- Submit pull requests with clear descriptions
- Report issues and suggest improvements

---

## 📄 License

GitHub Guard is open-source software. See the `LICENSE` file for details.

---

*Built with ❤️ using [Devvit](https://developers.reddit.com) — Also check out [Promo Guard](https://developers.reddit.com/apps/promo-guard), which evaluates posts using a multi-point safety and relevance scale to flag spam, over-promotion, or suspicious links.*