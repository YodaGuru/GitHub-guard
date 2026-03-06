🛡️ GitHub Guard
GitHub Guard is a security and quality-control automation built specifically for software-focused subreddits like r/macos. It balances community safety with support for open-source developers.

🔍 How it Works: The Trust Audit

Instead of silent removals, the bot now conducts a transparent Safety Audit on every GitHub link. It queries the GitHub REST API to evaluate the "reputation" and "provenance" of a project based on six key metrics:

Community Trust: Does it have 5+ stars?

Maturity: Is the repository older than 30 days?

Legal Clarity: Does it include a recognized Open Source License?

Security Policy: Does the dev have a defined vulnerability reporting process?

Verified Identity: Are the latest commits cryptographically signed?

Entity Status: Is the repo owned by a GitHub Organization?

⚖️ The Advisory Model

For most projects, the bot will not remove the post. Instead, it will:

Generate a Score (1-6): Providing a snapshot of the project's maturity.

Post an Audit Trail: Highlighting exactly which security markers were found.

Issue Risk Warnings: Specifically flagging repositories that contain installation scripts (.sh, .py) which require sudo privileges.

🔨 Automated Threat Removal

To keep the community safe from high-risk actors, the bot maintains a "Nuclear Option" for malicious patterns. It will automatically remove posts and flag users if:

Impersonation is Detected: The repo uses keywords from sensitive apps (e.g., LastPass, Malwarebytes, Ledger) but is not owned by the official organization.

Zero-Day Risk: A brand-new repository (under 7 days old) contains an automated installation script.

Known Blacklists: The repo or author matches known databases of malware distributors.

🎯 Objective

The goal of GitHub Guard is to inform, not just enforce. It provides r/macos users with the data they need to make smart security decisions while ensuring that known malware and impersonation attempts are stopped before they can spread.