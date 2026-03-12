import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
  http: true,
  // modmail is handled via the Developer Portal settings in this version
});

async function scanForGitHub(text: string, id: string, authorName: string | undefined, context: any) {
  const safeAuthor = authorName || "";
  if (safeAuthor.toLowerCase() === "githubguard") return;

  // 1. DYNAMIC APPROVED/MOD CHECK
  let isApproved = false;
  try {
    const subreddit = await context.reddit.getSubredditByName(context.subredditName);
    const contributors = await subreddit.getApprovedUsers({ username: safeAuthor }).all();
    isApproved = contributors.length > 0;
    if (!isApproved) {
        const moderators = await subreddit.getModerators({ username: safeAuthor }).all();
        isApproved = moderators.length > 0;
    }
  } catch (e) { console.error("Approved check failed."); }
    
  // 2. IDENTIFY GITHUB LINK
  const githubRegex = /github\.com\/([a-zA-Z0-9-._]+)\/([a-zA-Z0-9-._]+)/i;
  const match = text.match(githubRegex);
  if (!match) return;
      
  let [_, owner, repo] = match;
  repo = repo.replace(/\.git$/i, "").replace(/\/$/, "");
          
  try {
    // API CALLS
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: { 'User-Agent': 'Devvit-GitHub-Guard-Bot' } });
    if (!repoRes.ok) return;
    const data = await repoRes.json();
    
    const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, { headers: { 'User-Agent': 'Devvit-GitHub-Guard-Bot' } });
    const commitData = await commitRes.json();
    const isSigned = commitData?.[0]?.commit?.verification?.verified || false;

    const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers: { 'User-Agent': 'Devvit-GitHub-Guard-Bot' } });
    const contentsData = await contentsRes.json();
    const hasInstallScript = Array.isArray(contentsData) && contentsData.some(file => 
      ['install.sh', 'setup.sh', 'install.py', 'setup.py', 'configure'].includes(file.name.toLowerCase())
    );

    // 3. SCORING ENGINE
    let score = 0;
    const details = [];
    const repoNameLower = repo.toLowerCase();

    if (data.stargazers_count >= 5) { score++; details.push("✅ Established Community (5+ stars)"); }
    else { details.push("❌ Low Star Count"); }

    const isOldEnough = (Date.now() - new Date(data.created_at).getTime()) > (1000 * 60 * 60 * 24 * 30);
    if (isOldEnough) { score++; details.push("✅ Senior Account (30+ days old)"); }
    else { details.push("❌ New Repository"); }

    if (data.license) { score++; details.push(`✅ Licensed under ${data.license.spdx_id}`); }
    else { details.push("❌ No License Found"); }

    if (data.has_security_policy) { score++; details.push("✅ Security Policy Defined"); }
    else { details.push("❌ No Security Policy"); }

    if (data.owner.type === "Organization") { score++; details.push("✅ Verified Organization"); }
    else { details.push("ℹ️ Individual Contributor"); }

    if (isSigned) { score++; details.push("✅ Signed Commits"); }
    else { details.push("ℹ️ Unsigned Commits"); }

    // 4. MALICIOUS PATTERN CHECK
    const sensitiveKeywords = ['lastpass', 'notion', 'metamask', 'ledger', 'malwarebytes', 'passbolt', 'proton'];
    const isImpersonating = sensitiveKeywords.some(kw => repoNameLower.includes(kw)) && data.owner.type !== "Organization";
    const isUltraNewRisk = !isOldEnough && hasInstallScript;
    
    const isKnownThreat = isImpersonating || isUltraNewRisk;

    const auditTrail = details.map(d => `* ${d}`).join('\n');
    let riskWarning = hasInstallScript ? "\n\n> ⚠️ **High-Risk File Detected:** Contains an installation script (`.sh` or `.py`). Review the code carefully before running with `sudo`." : "";

    // 5. ACTION LOGIC
    if (isKnownThreat && !isApproved) {
      // NUCLEAR OPTION: REMOVE IMMEDIATELY
      await context.reddit.remove(id, false);
      const reply = await context.reddit.submitComment({
        id: id, 
        text: `🛡️ **GitHub Guard: Malicious Pattern Detected**\n\nThis repository matches known malware distribution patterns (Impersonation or New Script Risk) and has been removed for community safety.\n\n**Trust Report:**\n${auditTrail}${riskWarning}`
      });
      await reply.distinguish(true); 
      console.log(`[Action] Removed Malicious Pattern: ${owner}/${repo}`);
    } 
    else {
      // ADVISOR OPTION: POST REPORT ONLY
      const shieldNotice = isApproved ? "\n\n*Note: Verified by Approved User status.*" : "";
      const reply = await context.reddit.submitComment({
        id: id,
        text: `🔍 **GitHub Guard: Trust Report**\n\nThis project scored **${score}/6** on our safety audit. ${shieldNotice}\n\n**Trust Report:**\n${auditTrail}${riskWarning}\n\n> **⚠️ Security Reminder:** Always verify source code and run third-party scripts at your own risk.`
      });
      await reply.distinguish(true);
      console.log(`[Scan] Reported ${owner}/${repo}: ${score}/6`);
    }
  } catch (e) { console.error("❌ System Error:", e); }
}

// Triggers 
Devvit.addTrigger({
  event: 'PostCreate', 
  onEvent: async (event, context) => {
    // Safety Guard: Check if event and post exist before continuing
    if (!event.post?.id) return;

    const post = await context.reddit.getPostById(event.post.id);
    await scanForGitHub(`${post.title} ${post.url || ''} ${post.body || ''}`, event.post.id, post.authorName, context);
  },
});

Devvit.addTrigger({
  event: 'CommentCreate', 
  onEvent: async (event, context) => {
    // Safety Guard: Check if event and comment exist before continuing
    if (!event.comment?.id) return;

    const comment = await context.reddit.getCommentById(event.comment.id);
    await scanForGitHub(comment.body || "", event.comment.id, comment.authorName, context);
  },
});

export default Devvit;