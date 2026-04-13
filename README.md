# 🛡️ GitHub Guard

GitHub Guard is an automated security and quality-control solution designed specifically for software-focused communities like r/macOS. It helps moderators and users make safe, informed decisions about external GitHub links by providing transparent audits and actionable insights, while supporting open-source developers.

---

## 🔍 How it Works

GitHub Guard performs a real-time Trust Audit on every GitHub link posted, evaluating projects based on six key trust signals:

| Signal | Description |
|--------|-------------|
| ⭐ Community Trust | Checks for 5+ stars |
| 📅 Maturity | Verifies if the repository is older than 30 days |
| ⚖️ Legal Clarity | Confirms presence of a recognized Open Source License |
| 🛡️ Security Policy | Checks for a `SECURITY.md` in the root, `.github/`, or `docs/` folder |
| ✍️ Signed Commits | Verifies if commits are cryptographically signed |
| 🏢 Entity Status | Checks if the repository is owned by a GitHub Organization |

---

## 📊 Advisory Model

- **Trust Score (0-6):** Provides a snapshot of the project's maturity and safety.
- **Audit Trail:** Highlights exactly which security markers were found or missing.
- **Risk Warnings:** Flags repositories containing installation scripts (`.sh`, `.py`) that may require elevated privileges.

---

## 🚨 Automated Threat Removal

GitHub Guard automatically removes posts if:

- **Impersonation Detected:** Fake versions of sensitive apps such as LastPass, MetaMask, Notion, Ledger, Malwarebytes, Passbolt, or Proton.
- **Zero-Day Risk:** Brand-new repositories with zero stars containing automated installation scripts.

> Approved users and moderators are exempt from automated removal.

---

## 🛡️ Privacy & Security

- **No PII Collected:** No user personally identifiable information is collected, stored, or transmitted.
- **Limited Scope:** All outbound requests are strictly limited to fetching public repository metadata via the GitHub API.
- **Transparency:** Entire source code is open-source and available for community review.

---

## 🤝 Contributing

We welcome contributions to enhance GitHub Guard!

- Fork the repository.
- Create a feature branch.
- Submit pull requests with clear descriptions.
- Report issues and suggest improvements.

---

## 📄 License

GitHub Guard is open-source software. See the `LICENSE` file for details.

📂 **View the Source:** [github.com/YodaGuru/GitHub-Guard](https://github.com/YodaGuru/GitHub-Guard)

---

*Built with ❤️ using Devvit — Also check out [Promo Guard](https://developers.reddit.com/apps/promo-guard), which evaluates posts using a multi-point safety and relevance scale to flag spam, over-promotion, or suspicious links, keeping your subreddit clean and trustworthy.*