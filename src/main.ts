import { Devvit, SettingScope } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
  http: true,
  redis: true,
});

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS — Flat settings structure compatible with Devvit settings renderer
// ─────────────────────────────────────────────────────────────────────────────
Devvit.addSettings([
  {
    name: 'github_token',
    label: '🔑 GitHub Personal Access Token',
    helpText: 'Optional token to increase GitHub API rate limits.',
    type: 'string',
    isSecret: true,
    scope: SettingScope.App,
  },
  {
    name: 'minStars',
    type: 'number',
    label: '⭐ Minimum stars for Community Trust',
    helpText: 'Repos below this star count fail the Community Trust check.',
    defaultValue: 5,
  },
  {
    name: 'minAgeDays',
    type: 'number',
    label: '⏳ Minimum repository age (days)',
    helpText: 'Repos newer than this fail the Maturity check.',
    defaultValue: 30,
  },
  {
    name: 'checkStars',
    type: 'boolean',
    label: '🔍 Check: Community Trust (star count)',
    defaultValue: true,
  },
  {
    name: 'checkAge',
    type: 'boolean',
    label: '🔍 Check: Maturity (repository age)',
    defaultValue: true,
  },
  {
    name: 'checkLicense',
    type: 'boolean',
    label: '🔍 Check: Legal Clarity (open-source license)',
    defaultValue: true,
  },
  {
    name: 'checkSecurityPolicy',
    type: 'boolean',
    label: '🔍 Check: Security Policy (SECURITY.md)',
    helpText: 'Checks for a SECURITY.md file.',
    defaultValue: true,
  },
  {
    name: 'checkSignedCommits',
    type: 'boolean',
    label: '🔍 Check: Verified Identity (signed commits)',
    defaultValue: true,
  },
  {
    name: 'checkOrgOwner',
    type: 'boolean',
    label: '🔍 Check: Entity Status (org-owned repo)',
    defaultValue: true,
  },
  {
    name: 'minScoreToPass',
    type: 'number',
    label: '⚖️ Minimum score to pass without a risk warning (0–6)',
    helpText: 'Posts below this score get a risk-warning comment but are NOT removed.',
    defaultValue: 3,
  },
  {
    name: 'postAuditComment',
    type: 'boolean',
    label: '⚖️ Always post a full audit-trail comment',
    helpText: 'When off, the bot only comments when a risk warning or removal fires.',
    defaultValue: true,
  },
  {
    name: 'warnOnSudoScripts',
    type: 'boolean',
    label: '⚖️ Warn when repo contains sudo install scripts (.sh / .py)',
    defaultValue: true,
  },
  {
    name: 'scanPosts',
    type: 'boolean',
    label: '⚖️ Scan link posts',
    defaultValue: true,
  },
  {
    name: 'scanPostEdits',
    type: 'boolean',
    label: '⚖️ Re-scan posts when edited',
    defaultValue: true,
  },
  {
    name: 'scanComments',
    type: 'boolean',
    label: '⚖️ Scan comments',
    defaultValue: true,
  },
  {
    name: 'silentHighScore',
    type: 'boolean',
    label: '⚖️ Stay silent for high-scoring repos',
    defaultValue: false,
  },
  {
    name: 'enableNuclearOption',
    type: 'boolean',
    label: '🔨 Enable automatic removal for malicious patterns',
    helpText: 'Master switch — disabling this turns off ALL auto-removal.',
    defaultValue: true,
  },
  {
    name: 'removeOnImpersonation',
    type: 'boolean',
    label: '🔨 Remove on impersonation detection',
    defaultValue: true,
  },
  {
    name: 'removeOnZeroDaySudoScript',
    type: 'boolean',
    label: '🔨 Remove on zero-day + sudo install script',
    defaultValue: true,
  },
  {
    name: 'removeOnBlacklist',
    type: 'boolean',
    label: '🔨 Remove on known malware blacklist match',
    defaultValue: true,
  },
  {
    name: 'customRemovalComment',
    type: 'string',
    label: '🔨 Custom removal comment (leave blank to use default)',
    helpText: 'Shown on removed posts. Use {reason} as a placeholder.',
    defaultValue: '',
  },
  {
    name: 'impersonationKeywords',
    type: 'string',
    label: '🔨 Impersonation keywords (comma-separated)',
    defaultValue: 'lastpass,notion,metamask,ledger,malwarebytes,passbolt,proton',
  },
  {
    name: 'exemptMods',
    type: 'boolean',
    label: '✅ Skip audit for posts made by subreddit moderators',
    defaultValue: true,
  },
  {
    name: 'trustedOrgs',
    type: 'string',
    label: '✅ Trusted GitHub organisations (comma-separated)',
    defaultValue: '',
  },
  {
    name: 'trustedRepos',
    type: 'string',
    label: '✅ Always-allowed repos (comma-separated, owner/repo format)',
    defaultValue: '',
  },
  {
    name: 'exemptFlairs',
    type: 'string',
    label: '✅ Post flairs to skip auditing (comma-separated)',
    defaultValue: '',
  },
]);

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS HELPER
// ─────────────────────────────────────────────────────────────────────────────
function parseList(raw: unknown): string[] {
  if (typeof raw !== 'string' || !raw.trim()) return [];
  return raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

async function getConfig(context: any) {
  const s = await context.settings.getAll();
  return {
    minStars: (s['minStars'] as number) ?? 5,
    minAgeDays: (s['minAgeDays'] as number) ?? 30,
    checkStars: (s['checkStars'] as boolean) ?? true,
    checkAge: (s['checkAge'] as boolean) ?? true,
    checkLicense: (s['checkLicense'] as boolean) ?? true,
    checkSecurityPolicy: (s['checkSecurityPolicy'] as boolean) ?? true,
    checkSignedCommits: (s['checkSignedCommits'] as boolean) ?? true,
    checkOrgOwner: (s['checkOrgOwner'] as boolean) ?? true,
    minScoreToPass: (s['minScoreToPass'] as number) ?? 3,
    postAuditComment: (s['postAuditComment'] as boolean) ?? true,
    scanPosts: (s['scanPosts'] as boolean) ?? true,
    scanPostEdits: (s['scanPostEdits'] as boolean) ?? true,
    scanComments: (s['scanComments'] as boolean) ?? true,
    silentHighScore: (s['silentHighScore'] as boolean) ?? false,
    warnOnSudoScripts: (s['warnOnSudoScripts'] as boolean) ?? true,
    enableNuclearOption: (s['enableNuclearOption'] as boolean) ?? true,
    removeOnImpersonation: (s['removeOnImpersonation'] as boolean) ?? true,
    removeOnZeroDaySudoScript: (s['removeOnZeroDaySudoScript'] as boolean) ?? true,
    removeOnBlacklist: (s['removeOnBlacklist'] as boolean) ?? true,
    customRemovalComment: (s['customRemovalComment'] as string) ?? '',
    impersonationKeywords: parseList(
      s['impersonationKeywords'] ?? 'lastpass,notion,metamask,ledger,malwarebytes,passbolt,proton'
    ),
    exemptMods: (s['exemptMods'] as boolean) ?? true,
    trustedOrgs: parseList(s['trustedOrgs']),
    trustedRepos: parseList(s['trustedRepos']),
    exemptFlairs: parseList(s['exemptFlairs']),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE SCAN FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
async function scanForGitHub(
  text: string,
  id: string,
  authorName: string | undefined,
  postFlair: string | undefined,
  context: any,
  bypassCache: boolean = false
) {
  let cfg: any;
  try {
    cfg = await getConfig(context);
  } catch (e) {
    return;
  }
  const safeAuthor = authorName ?? '';

  if (safeAuthor.toLowerCase() === 'github-guard') return;

  if (postFlair && cfg.exemptFlairs.includes(postFlair.toLowerCase())) {
    console.log(`[Skip] Exempt flair: ${postFlair}`);
    return;
  }

  const subreddit = await context.reddit.getCurrentSubreddit();

  let isApproved = false;
  try {
    const contributors = await subreddit.getApprovedUsers({ username: safeAuthor }).all();
    isApproved = contributors.length > 0;

    if (!isApproved && cfg.exemptMods) {
      const moderators = await subreddit.getModerators({ username: safeAuthor }).all();
      if (moderators.length > 0) {
        console.log(`[Skip] Moderator: u/${safeAuthor}`);
        return;
      }
    }
  } catch (e) {
    console.error('Approved/mod check failed.');
  }

  const githubRegex = /github\.com\/([a-zA-Z0-9-._]+)\/([a-zA-Z0-9-._]+?)(?:\/|\.git|\s|\)|\]|$)/i;
  const match = text.match(githubRegex);
  if (!match) return;

  let [_, owner, repo] = match;
  repo = repo.replace(/\.git$/i, '').replace(/\/$/, '');
  const repoKey = `${owner.toLowerCase()}/${repo.toLowerCase()}`;

  if (cfg.trustedRepos.includes(repoKey)) {
    console.log(`[Skip] Trusted repo: ${repoKey}`);
    return;
  }

  const cacheKey = `gh_scan_${owner}_${repo}`;
  try {
    if (bypassCache) {
      await context.redis.del(cacheKey);
      console.log(`[Cache] Cleared for rescan: ${owner}/${repo}`);
    } else {
      const cached = await context.redis.get(cacheKey);
      if (cached) {
        console.log(`[Cache] Already scanned: ${owner}/${repo}`);
        try {
          const payload = JSON.parse(cached);
          if (payload.commentText && cfg.postAuditComment) {
            const cachedNote = `\n\n---\n*🔄 Cached result — this repo was scanned recently. Score: **${payload.score}/${payload.maxScore}**.*`;
            const reply = await context.reddit.submitComment({
              id,
              text: payload.commentText + cachedNote,
            });
            await reply.distinguish(true);
          }
        } catch (_) {}
        return;
      }
    }
  } catch (e) {
    console.error('Redis cache read failed.');
  }

  let lastCommentText = '';
  try {
    const token = await context.settings.get('github_token');
    const ghHeaders: Record<string, string> = {
      'User-Agent': 'Devvit-GitHub-Guard-Bot',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: ghHeaders,
    });
    if (!repoRes.ok) return;
    const data = await repoRes.json();

    const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, {
      headers: ghHeaders,
    });
    const commitData = await commitRes.json();
    const isSigned = commitData?.[0]?.commit?.verification?.verified || false;

    const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers: ghHeaders,
    });
    const contentsData = await contentsRes.json();
    const hasInstallScript =
      Array.isArray(contentsData) &&
      contentsData.some((file) =>
        ['install.sh', 'setup.sh', 'install.py', 'setup.py', 'configure'].includes(
          file.name.toLowerCase()
        )
      );

    const checkSecurity = async (url: string) => {
      try {
        const res = await fetch(url, { method: 'HEAD', headers: ghHeaders });
        return res.status === 200;
      } catch {
        return false;
      }
    };
    const [secRoot, secDotGithub, secDocs] = await Promise.all([
      checkSecurity(`https://api.github.com/repos/${owner}/${repo}/contents/SECURITY.md`),
      checkSecurity(`https://api.github.com/repos/${owner}/${repo}/contents/.github/SECURITY.md`),
      checkSecurity(`https://api.github.com/repos/${owner}/${repo}/contents/docs/SECURITY.md`),
    ]);
    const hasSecurityPolicy = secRoot || secDotGithub || secDocs;

    const ownerLower = data.owner.login.toLowerCase();
    const isTrustedOrg = cfg.trustedOrgs.includes(ownerLower);

    let score = 0;
    const maxScore = [
      cfg.checkStars,
      cfg.checkAge,
      cfg.checkLicense,
      cfg.checkSecurityPolicy,
      cfg.checkOrgOwner,
      cfg.checkSignedCommits,
    ].filter(Boolean).length;

    const details: string[] = [];
    const repoNameLower = repo.toLowerCase();

    const isOldEnough =
      Date.now() - new Date(data.created_at).getTime() > cfg.minAgeDays * 86_400_000;

    if (cfg.checkStars) {
      if (isTrustedOrg || data.stargazers_count >= cfg.minStars) {
        score++;
        details.push(`✅ Established Community (⭐ ${data.stargazers_count.toLocaleString()} stars)`);
      } else {
        details.push(
          `❌ Low Star Count (⭐ ${data.stargazers_count.toLocaleString()} / ${cfg.minStars} required)`
        );
      }
    }

    if (cfg.checkAge) {
      if (isTrustedOrg || isOldEnough) {
        score++;
        details.push(`✅ Mature Repository (${cfg.minAgeDays}+ days old)`);
      } else {
        details.push(`❌ New Repository (under ${cfg.minAgeDays} days old)`);
      }
    }

    if (cfg.checkLicense) {
      if (isTrustedOrg || data.license) {
        score++;
        details.push(`✅ Licensed under ${data.license?.spdx_id ?? 'N/A'}`);
      } else {
        details.push('❌ No License Found');
      }
    }

    if (cfg.checkSecurityPolicy) {
      if (isTrustedOrg || hasSecurityPolicy) {
        score++;
        details.push('✅ Security Policy Defined');
      } else {
        details.push(
          '❌ No Security Policy — [what is this?](https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository)'
        );
      }
    }

    if (cfg.checkOrgOwner) {
      if (data.owner.type === 'Organization') {
        score++;
        details.push('✅ Verified Organization');
      } else {
        details.push('ℹ️ Individual Contributor');
      }
    }

    if (cfg.checkSignedCommits) {
      if (isTrustedOrg || isSigned) {
        score++;
        details.push('✅ Signed Commits');
      } else {
        details.push('ℹ️ Unsigned Commits');
      }
    }

    const isImpersonating =
      cfg.removeOnImpersonation &&
      cfg.impersonationKeywords.some((kw: string) => repoNameLower.includes(kw)) &&
      data.owner.type !== 'Organization';

    const isUltraNewRisk =
      cfg.removeOnZeroDaySudoScript &&
      !isOldEnough &&
      hasInstallScript &&
      data.stargazers_count === 0;

    const isKnownThreat =
      cfg.enableNuclearOption && !isTrustedOrg && (isImpersonating || isUltraNewRisk);

    const nukeReason = isImpersonating
      ? 'Impersonation of a well-known application'
      : 'Brand-new repository with a zero-star automated install script';

    const auditTrail = details.map((d) => `- ${d}`).join('\n');
    const riskWarning =
      cfg.warnOnSudoScripts && hasInstallScript
        ? '\n\n> ⚠️ **High-Risk File Detected:** Contains an installation script (`.sh` or `.py`). ' +
          'Review the code carefully before running with `sudo`.'
        : '';

    if (isKnownThreat && !isApproved) {
      await context.reddit.remove(id, false);

      const dashboardLink = `\n\n---\n📋 *Moderators: [View the scan dashboard](https://old.reddit.com/r/${subreddit.name}/wiki/github-guard-dashboard)*`;

      const defaultRemovalText =
        `🛡️ **GitHub Guard: Malicious Pattern Detected**\n\n` +
        `This repository was removed for community safety.\n\n` +
        `**Reason:** ${nukeReason}\n\n` +
        `**Trust Report:**\n\n` +
        `${auditTrail}\n\n` +
        `${riskWarning ? `${riskWarning}\n\n` : ''}` +
        `${dashboardLink}`;

      const removalText = cfg.customRemovalComment
        ? cfg.customRemovalComment.replace('{reason}', nukeReason)
        : defaultRemovalText;

      const reply = await context.reddit.submitComment({ id, text: removalText });
      await reply.distinguish(true);
      console.log(`[Removed] ${owner}/${repo} — ${nukeReason}`);
      await logScanResult(context, {
        owner,
        repo,
        score,
        maxScore,
        action: 'removed',
        reason: nukeReason,
        postId: id,
        author: safeAuthor,
        timestamp: Date.now(),
      });
    } else if (
      (cfg.postAuditComment && !(cfg.silentHighScore && score >= cfg.minScoreToPass)) ||
      score < cfg.minScoreToPass
    ) {
      const scoreLine =
        score < cfg.minScoreToPass
          ? `⚠️ This project scored **${score}/${maxScore}** — below this subreddit's threshold of ${cfg.minScoreToPass}.`
          : `This project scored **${score}/${maxScore}** on our safety audit.`;

      const approvedNote = isApproved ? '\n\n*Note: Author is an Approved User.*' : '';

      const commentText =
        `🔍 **GitHub Guard: Trust Report**\n\n` +
        `${scoreLine}${approvedNote}\n\n` +
        `**Audit Breakdown:**\n\n` +
        `${auditTrail}\n\n` +
        `${riskWarning ? `${riskWarning}\n\n` : ''}` +
        `> **⚠️ Security Reminder:** Always verify source code and run third-party scripts at your own risk.`;

      lastCommentText = commentText;
      const reply = await context.reddit.submitComment({ id, text: commentText });
      await reply.distinguish(true);
      console.log(`[Reported] ${owner}/${repo}: ${score}/${maxScore}`);
      await logScanResult(context, {
        owner,
        repo,
        score,
        maxScore,
        action: score < cfg.minScoreToPass ? 'reported' : 'skipped',
        postId: id,
        author: safeAuthor,
        timestamp: Date.now(),
      });
    }

    const cachedPayload = JSON.stringify({
      commentText: isKnownThreat ? null : lastCommentText,
      score,
      maxScore,
      action: isKnownThreat ? 'removed' : score < cfg.minScoreToPass ? 'reported' : 'skipped',
    });

    await context.redis.set(cacheKey, cachedPayload);
    await context.redis.expire(cacheKey, 3600);
  } catch (e) {
    console.error('❌ System Error:', e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIGGERS
// ─────────────────────────────────────────────────────────────────────────────
Devvit.addTrigger({
  event: 'PostUpdate',
  onEvent: async (event, context) => {
    if (!event.post?.id) return;
    const cfg = await getConfig(context);
    if (!cfg.scanPosts || !cfg.scanPostEdits) return;
    const post = await context.reddit.getPostById(event.post.id);
    await scanForGitHub(
      `${post.title} ${post.url ?? ''} ${post.body ?? ''}`,
      event.post.id,
      post.authorName,
      post.flair?.text ?? undefined,
      context,
      true
    );
  },
});

Devvit.addTrigger({
  event: 'PostSubmit',
  onEvent: async (event, context) => {
    console.log('POST SUBMIT TRIGGER FIRED');
    console.log('[TRIGGER] Event:', JSON.stringify(event, null, 2));

    if (!event.post?.id) {
      console.log('[TRIGGER] PostSubmit had no post ID');
      return;
    }

    console.log(`[TRIGGER] Post ID: ${event.post.id}`);

    const cfg = await getConfig(context);

    console.log('[TRIGGER] scanPosts:', cfg.scanPosts);

    if (!cfg.scanPosts) {
      console.log('[TRIGGER] scanPosts is disabled');
      return;
    }

    const post = await context.reddit.getPostById(event.post.id);

    console.log(
      `[TRIGGER] Scanning post ${event.post.id} by u/${post.authorName}`
    );
    console.log('[TRIGGER] URL:', post.url);
    console.log('[TRIGGER] Title:', post.title);

    await scanForGitHub(
      `${post.title} ${post.url ?? ''} ${post.body ?? ''}`,
      event.post.id,
      post.authorName,
      post.flair?.text ?? undefined,
      context
    );

    console.log('[TRIGGER] PostSubmit scan finished');
  },
});

Devvit.addTrigger({
  event: 'CommentCreate',
  onEvent: async (event, context) => {
    if (!event.comment?.id) return;
    const cfg = await getConfig(context);
    if (!cfg.scanComments) return;
    const comment = await context.reddit.getCommentById(event.comment.id);
    await scanForGitHub(comment.body ?? '', event.comment.id, comment.authorName, undefined, context);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// MOD DASHBOARD — writes scan log to subreddit wiki page
// ─────────────────────────────────────────────────────────────────────────────
async function logScanResult(
  context: any,
  entry: {
    owner: string;
    repo: string;
    score: number;
    maxScore: number;
    action: 'reported' | 'removed' | 'skipped';
    reason?: string;
    postId: string;
    author: string;
    timestamp: number;
  }
) {
  try {
    const key = `gh_log_${entry.timestamp}_${entry.owner}_${entry.repo}`;

    await context.redis.set(key, JSON.stringify(entry));
    await context.redis.expire(key, 604800);

    const indexRaw = await context.redis.get('gh_log_index').catch(() => null);
    const index: string[] = indexRaw ? JSON.parse(indexRaw) : [];

    index.unshift(key);

    if (index.length > 50) index.splice(50);

    await context.redis.set('gh_log_index', JSON.stringify(index));
    await context.redis.expire('gh_log_index', 604800);
  } catch (e) {
    console.error('Failed to log scan result:', e);
  }

  await rebuildWikiDashboard(context);
}

async function rebuildWikiDashboard(context: any) {
  try {
    const subreddit = await context.reddit.getCurrentSubreddit();
    const indexRaw = await context.redis.get('gh_log_index').catch(() => null);
    const index: string[] = indexRaw ? JSON.parse(indexRaw) : [];

    const entries = (
      await Promise.all(
        index.map(async (k: string) => {
          const raw = await context.redis.get(k).catch(() => null);
          return raw ? JSON.parse(raw) : null;
        })
      )
    )
      .filter(Boolean)
      .sort((a: any, b: any) => b.timestamp - a.timestamp);

    const removed = entries.filter((e: any) => e.action === 'removed').length;
    const warned = entries.filter((e: any) => e.action === 'reported').length;
    const passed = entries.filter((e: any) => e.action === 'skipped').length;

    const rows = entries
      .map((e: any) => {
        const d = new Date(e.timestamp).toISOString().slice(0, 10);
        const link = `https://reddit.com/r/${subreddit.name}/comments/${e.postId}`;
        return `| [${e.owner}/${e.repo}](https://github.com/${e.owner}/${e.repo}) | ${e.action.toUpperCase()} | ${e.score}/${e.maxScore} | u/${e.author} | [post](${link}) | ${d} |`;
      })
      .join('\n');

    const wikiContent = [
      '# 🛡️ GitHub Guard — Scan Dashboard',
      '',
      `*Last updated: ${new Date().toUTCString()}*`,
      '',
      '## Summary (last 7 days)',
      '',
      `| Metric | Count |`,
      `|--------|-------|`,
      `| 🔴 Removed | ${removed} |`,
      `| 🟠 Warned | ${warned} |`,
      `| 🟢 Passed | ${passed} |`,
      `| Total scans | ${entries.length} |`,
      '',
      '## Recent Scans',
      '',
      '| Repository | Action | Score | Posted by | Post | Date |',
      '|------------|--------|-------|-----------|------|------|',
      rows || '| — | — | — | — | — | — |',
    ].join('\n');

    await context.reddit.updateWikiPage({
      subredditName: subreddit.name,
      page: 'github-guard-dashboard',
      content: wikiContent,
      reason: 'GitHub Guard auto-update',
    });
    console.log('[Dashboard] Wiki updated');
  } catch (e) {
    console.error('[Dashboard] Wiki update failed:', e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MENU ITEMS
// ─────────────────────────────────────────────────────────────────────────────
Devvit.addMenuItem({
  label: '🛡️ GitHub Guard: Refresh Dashboard',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    await rebuildWikiDashboard(context);
    const sub = await context.reddit.getCurrentSubreddit();
    context.ui.navigateTo(`https://www.reddit.com/r/${sub.name}/wiki/github-guard-dashboard`);
  },
});

Devvit.addMenuItem({
  label: '🛡️ GitHub Guard: Scan Post',
  location: 'post',
  forUserType: 'moderator',
  onPress: async (event, context) => {
    const post = await context.reddit.getPostById(event.targetId);
    await scanForGitHub(
      `${post.title} ${post.url ?? ''} ${post.body ?? ''}`,
      event.targetId,
      post.authorName,
      post.flair?.text ?? undefined,
      context
    );
    context.ui.showToast('Scan complete — check comments.');
  },
});

export default Devvit;