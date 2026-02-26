# 🛡️ GitHub Guard

**GitHub Guard** is a security and quality-control automation built specifically for software-focused subreddits like **r/macos**.

### 🔍 How it Works
When a user posts a link to a GitHub repository, the bot instantly queries the GitHub API to verify the "reputation" of the project. If the repository is less than **30 days old** or has **fewer than 5 stars**, the bot automatically:

* **Removes the post** to prevent the spread of unvetted scripts or potential malware.
* **Leaves a detailed comment** explaining the subreddit's security policy.
* **Provides instructions** on how legitimate developers can get their projects manually approved by the mod team.

### 🎯 Objective
This ensures that the community only interacts with established, peer-reviewed projects while keeping the moderation queue clean from "drive-by" spam and "empty" repositories.