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

  let isApproved = false;

  // 2. DYNAMIC APPROVED CHECK
  try {
    const subreddit = await context.reddit.getSubredditByName(context.subredditName);
    const contributors = await subreddit.getApprovedUsers({
      username: safeAuthor,
    }).all();
    isApproved = contributors.length > 0;
  } catch (e) {
    console.error("Approved check failed, defaulting to false.");
  }
    
  // 3. IDENTIFY GITHUB LINK
  const githubRegex = /github\.com\/([\w-]+)\/([\w-]+)/i;
  const match = text.match(githubRegex);
  if (!match) return;
      
  const [_, owner, repo] = match;
  console.log(`[Scan] ${owner}/${repo} by ${safeAuthor} (Approved: ${isApproved})`);
          
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { 'User-Agent': 'Devvit-GitHub-Guard-Bot' }
    });
       
    if (!response.ok) return;
      
    const data = await response.json();
    const createdAt = new Date(data.created_at);
    const stars = data.stargazers_count;
    const isNew = (Date.now() - createdAt.getTime()) < (1000 * 60 * 60 * 24 * 30);
        
    if (isNew) {
      // 4. THE SHIELD (Inside the "isNew" logic)
      if (isApproved) {
        console.log(`[Shield] 🛡️ ${safeAuthor} is Approved. Posting warning but NOT removing.`);
        const reply = await context.reddit.submitComment({
          id: id,
          text: `⚠️ **GitHub Guard: New Repository Detected**\n\nThis repository (**${owner}/${repo}**) is less than 30 days old. \n\n*Note: This post was not removed because the author is an approved contributor.*\n\n> **⚠️ Security Reminder:** Always exercise caution when downloading third-party software. Verify the source and run code at your own risk.`
        });
        await reply.distinguish(true);
        return;
      }
        
      // 5. THE HAMMER (For non-approved users)
      console.log(`[Step 2] ⚠️ HIGH RISK: Removing ${owner}/${repo}`);
      await context.reddit.remove(id, false);
      
      const reply = await context.reddit.submitComment({
        id: id,
        text: `🛡️ **GitHub Guard: Content Removed**\n\nYour contribution was removed because the repository (**${owner}/${repo}**) is less than 30 days old. New repos are restricted for community safety. If you are the developer, please contact the mods via Modmail.`
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
      // 6. THE GREETING (Runs for everyone if the repo is old)
      console.log(`[Step 2] ✅ LOW RISK: Verifying ${owner}/${repo}`);
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
    await scanForGitHub(`${post.title} ${post.url || ''} ${post.body || ''}`, event.post.id, post.authorName, context);
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
