import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
  http: true,
  modmail: true,
});

async function scanForGitHub(text: string, id: string, authorName: string | undefined, context: any) {
  const safeAuthor = authorName || "";
  
  // 1. IGNORE THE BOT ITSELF
  if (safeAuthor.toLowerCase() === "githubguard") return;

  // 2. DYNAMIC APPROVED CHECK
  let isApproved = false;
  try {
    const subreddit = await context.reddit.getSubredditByName(context.subredditName);
    const contributors = await subreddit.getApprovedUsers({
      username: safeAuthor,
    }).all();
    isApproved = contributors.length > 0;
  } catch (e) {
    console.error("Approved check failed, defaulting to false.");
  }
    
  // 3. IDENTIFY GITHUB LINK (Enhanced Regex)
  // This version handles dots, dashes, and underscores in names
  const githubRegex = /github\.com\/([a-zA-Z0-9-._]+)\/([a-zA-Z0-9-._]+)/i;
  const match = text.match(githubRegex);
  
  if (!match) return;
      
  let [_, owner, repo] = match;
  // Clean up common suffix like .git or trailing slashes
  repo = repo.replace(/\.git$/i, "").replace(/\/$/, "");
  
  console.log(`[Scan] Detected: ${owner}/${repo} by ${safeAuthor} (Approved: ${isApproved})`);
          
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { 'User-Agent': 'Devvit-GitHub-Guard-Bot' }
    });
       
    if (!response.ok) {
        console.log(`[GitHub API] Repo not found or private: ${owner}/${repo}`);
        return;
    }
      
    const data = await response.json();
    const createdAt = new Date(data.created_at);
    const stars = data.stargazers_count;
    
    // Check if repo is less than 30 days old
    const isNew = (Date.now() - createdAt.getTime()) < (1000 * 60 * 60 * 24 * 30);
        
    if (isNew) {
      if (isApproved) {
        console.log(`[Shield] 🛡️ Approved user bypass for ${owner}/${repo}`);
        const reply = await context.reddit.submitComment({
          id: id,
          text: `⚠️ **GitHub Guard: New Repository Detected**\n\nThis repository (**${owner}/${repo}**) is less than 30 days old. \n\n*Note: This post was not removed because the author is an approved contributor.*\n\n> **⚠️ Security Reminder:** Always exercise caution when downloading third-party software. Verify the source and run code at your own risk.`
        });
        await reply.distinguish(true);
        return;
      }
        
      console.log(`[The Hammer] ⚠️ Removing new repo: ${owner}/${repo}`);
      await context.reddit.remove(id, false);
      
      const reply = await context.reddit.submitComment({
        id: id,
        text: `🛡️ **GitHub Guard: Content Removed**\n\nYour contribution was removed because the repository (**${owner}/${repo}**) is less than 30 days old. New repos are restricted for community safety.\n\nIf you are the developer of this project, please contact the moderators via Modmail for manual verification.`
      });
      await reply.distinguish(true);
    
      if (context.modmail) {
        await context.modmail.createConversation({
          subredditName: context.subredditName, 
          subject: "🚨 GitHub Guard Action",
          body: `Automated Removal: u/${safeAuthor} posted a new repo: https://github.com/${owner}/${repo}.`,
          isAuthorHidden: true,
        });
      }
      
    } else {
      console.log(`[Verified] ✅ ${owner}/${repo} has ${stars} stars.`);
      const reply = await context.reddit.submitComment({
        id: id,
        text: `🔍 **GitHub Guard: Repository Verified**\n\nThis is an established repository (**⭐ ${stars} stars**).\n\n` +
              `> **⚠️ Security Reminder:** Always exercise caution when downloading third-party software. Verify the source and run code at your own risk.`
      });
      await reply.distinguish(true);
    }
  } catch (e) {
    console.error("❌ System Error:", e);
  }
}     
      
Devvit.addTrigger({
  event: 'PostSubmit',
  onEvent: async (event, context) => {
    const post = await context.reddit.getPostById(event.post.id);
    // Combines Title, URL, and Body to catch the link anywhere
    const combinedText = `${post.title} ${post.url || ''} ${post.body || ''}`;
    await scanForGitHub(combinedText, event.post.id, post.authorName, context);
  },
});
          
Devvit.addTrigger({
  event: 'CommentSubmit',
  onEvent: async (event, context) => {
    const comment = await context.reddit.getCommentById(event.comment.id);
    await scanForGitHub(comment.body, event.comment.id, comment.authorName, context);
  },
});
      
export default Devvit;