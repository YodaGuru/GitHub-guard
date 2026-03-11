# 🛡️ GitHub Guard

**GitHub Guard** is a security and quality-control automation built specifically for software-focused subreddits like **r/macos**. It balances community safety with support for open-source developers by auditing external links in real-time.

---

### 🔍 How it Works: The Trust Audit
Instead of silent removals, the bot conducts a transparent **Safety Audit** on every GitHub link. It evaluates the "reputation" of a project based on six key metrics:

* **⭐ Community Trust:** Checks for 5+ stars.
* **📅 Maturity:** Verifies if the repository is older than 30 days.
* **⚖️ Legal Clarity:** Looks for a recognized Open Source License.
* **🛡️ Security Policy:** Checks for a defined vulnerability reporting process.
* **✍️ Verified Identity:** Confirms if commits are cryptographically signed.
* **🏢 Entity Status:** Checks if the repo is owned by a GitHub Organization.

### ⚖️ The Advisory Model
For most projects, the bot provides helpful context rather than deleting posts. It will:
1. **Generate a Score (1-6):** Providing a snapshot of the project's maturity.
2. **Post an Audit Trail:** Highlighting exactly which security markers were found.
3. **Issue Risk Warnings:** Specifically flagging repositories that contain installation scripts (`.sh`, `.py`) which require `sudo` privileges.

### 🔨 Automated Threat Removal
To keep the community safe, the bot maintains a **"Nuclear Option"** for malicious patterns. It will automatically remove posts if:
* **Impersonation is Detected:** Fake versions of sensitive apps (e.g., LastPass, Notion).
* **Zero-Day Risk:** A brand-new repository containing automated installation scripts.
* **Known Blacklists:** Matches known databases of malware distributors.

---

### 🛡️ Privacy & Security Compliance
* **Data Integrity:** This app does not collect, store, or transmit any user PII (Personally Identifiable Information) to external servers. 
* **Limited Scope:** All outbound HTTP requests are strictly limited to fetching public repository metadata via the GitHub API.
* **Transparency:** The entire source code for **GitHub Guard** is open-source. We welcome contributions to improve our detection patterns.

📂 **View the Source:** [github.com/YodaGuru/GitHub-Guard](https://github.com/YodaGuru/GitHub-Guard)

> **⚠️ Security Reminder:** Always verify source code and run third-party scripts at your own risk.
