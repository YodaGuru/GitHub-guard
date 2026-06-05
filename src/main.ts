import { Devvit, SettingScope } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
  http: true,
  redis: true,
});

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS — all values are configurable per-subreddit by moderators
// ─────────────────────────────────────────────────────────────────────────────
Devvit.addSettings([
  // App-level secret (unchanged)
  {
    name: 'github_token',
    label: 'GitHub Personal Access Token',
    type: 'string',
    isSecret: true,
    scope: SettingScope.App,
  },

  // ── Audit Thresholds ──────────────────────────────────────────────────────
  {
    type: 'group',
    label: '⭐ Audit Thresholds',
    helpText: 'Minimum values a repository must meet to pass each check.',
    fields: [
      {
        name: 'minStars',
        type: 'number',
        label: 'Minimum stars for Community Trust',
        helpText: 'Repos below this star count fail the Community Trust check. Default: 5.',
        defaultValue: 5,
        scope: SettingScope.Installation,
      },
      {
        name: 'minAgeDays',
        type: 'number',
        label: 'Minimum repository age (days)',
        helpText: 'Repos newer than this many days fail the Maturity check. Default: 30.',
        defaultValue: 30,
        scope: SettingScope.Installation,
      },
    ],
  },

  // ── Toggle Individual Checks ──────────────────────────────────────────────
  {
    type: 'group',
    label: '🔍 Audit Checks',
    helpText: 'Enable or disable each of the 6 safety checks independently.',
    fields: [
      {
        name: 'checkStars',
        type: 'boolean',
        label: 'Check: Community Trust (star count)',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'checkAge',
        type: 'boolean',
        label: 'Check: Maturity (repository age)',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'checkLicense',
        type: 'boolean',
        label: 'Check: Legal Clarity (open-source license)',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'checkSecurityPolicy',
        type: 'boolean',
        label: 'Check: Security Policy (SECURITY.md)',
        helpText: 'Checks for a SECURITY.md file. This tells users how to responsibly report vulnerabilities. See https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository for how to create one.',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'checkSignedCommits',
        type: 'boolean',
        label: 'Check: Verified Identity (signed commits)',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'checkOrgOwner',
        type: 'boolean',
        label: 'Check: Entity Status (org-owned repo)',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
    ],
  },

  // ── Scoring & Actions ─────────────────────────────────────────────────────
  {
    type: 'group',
    label: '⚖️ Scoring & Actions',
    helpText: 'What the bot posts and at what score threshold.',
    fields: [
      {
        name: 'minScoreToPass',
        type: 'number',
        label: 'Minimum score to pass without a risk warning (0–6)',
        helpText: 'Posts below this score get a risk-warning comment but are NOT removed. Default: 3.',
        defaultValue: 3,
        scope: SettingScope.Installation,
      },
      {
        name: 'postAuditComment',
        type: 'boolean',
        label: 'Always post a full audit-trail comment',
        helpText: 'When off, the bot only comments when a risk warning or removal fires.',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'warnOnSudoScripts',
        type: 'boolean',
        label: 'Warn when repo contains sudo install scripts (.sh / .py)',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'scanPosts',
        type: 'boolean',
        label: 'Scan link posts',
        helpText: 'Scan GitHub links submitted as posts.',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'scanPostEdits',
        type: 'boolean',
        label: 'Re-scan posts when edited',
        helpText: 'Re-runs the full audit if a post is edited. Prevents the swap attack: post a clean repo, pass the scan, then edit to a malicious one. Recommended: on.',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'scanComments',
        type: 'boolean',
        label: 'Scan comments',
        helpText: 'Scan GitHub links posted in comments.',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'silentHighScore',
        type: 'boolean',
        label: 'Stay silent for high-scoring repos',
        helpText: 'When enabled, no comment is posted if the repo meets or exceeds the minimum score. Only low-scoring or flagged repos get a comment.',
        defaultValue: false,
        scope: SettingScope.Installation,
      },
    ],
  },

  // ── Nuclear Option ────────────────────────────────────────────────────────
  {
    type: 'group',
    label: '🔨 Nuclear Option (Auto-Removal)',
    helpText: 'Triggers that cause a post to be removed immediately.',
    fields: [
      {
        name: 'enableNuclearOption',
        type: 'boolean',
        label: 'Enable automatic removal for malicious patterns',
        helpText: 'Master switch — disabling this turns off ALL auto-removal.',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'removeOnImpersonation',
        type: 'boolean',
        label: 'Remove on impersonation detection',
        helpText: 'Fake versions of popular apps (LastPass, Notion, MetaMask, etc.).',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'removeOnZeroDaySudoScript',
        type: 'boolean',
        label: 'Remove on zero-day + sudo install script',
        helpText: 'Brand-new repos with zero stars that contain automated install scripts.',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'removeOnBlacklist',
        type: 'boolean',
        label: 'Remove on known malware blacklist match',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'customRemovalComment',
        type: 'string',
        label: 'Custom removal comment (leave blank to use default)',
        helpText: 'Shown on removed posts. Use {reason} as a placeholder for the specific trigger.',
        defaultValue: '',
        scope: SettingScope.Installation,
      },
      {
        name: 'impersonationKeywords',
        type: 'string',
        label: 'Impersonation keywords (comma-separated)',
        helpText:
          'Repo names containing any of these words (owned by a non-org) trigger impersonation removal. ' +
          'Default: lastpass,notion,metamask,ledger,malwarebytes,passbolt,proton',
        defaultValue: 'lastpass,notion,metamask,ledger,malwarebytes,passbolt,proton',
        scope: SettingScope.Installation,
      },
    ],
  },

  // ── Exemptions ────────────────────────────────────────────────────────────
  {
    type: 'group',
    label: '✅ Exemptions',
    helpText: 'Repos, orgs, flairs, and users that are always trusted.',
    fields: [
      {
        name: 'exemptMods',
        type: 'boolean',
        label: 'Skip audit for posts made by subreddit moderators',
        defaultValue: true,
        scope: SettingScope.Installation,
      },
      {
        name: 'trustedOrgs',
        type: 'string',
        label: 'Trusted GitHub organisations (comma-separated)',
        helpText: 'Repos owned by these orgs automatically receive a full score. Example: microsoft,apple',
        defaultValue: '',
        scope: SettingScope.Installation,
      },
      {
        name: 'trustedRepos',
        type: 'string',
        label: 'Always-allowed repos (comma-separated, owner/repo format)',
        helpText: 'These repos bypass all checks. Example: torvalds/linux',
        defaultValue: '',
        scope: SettingScope.Installation,
      },
      {
        name: 'exemptFlairs',
        type: 'string',
        label: 'Post flairs to skip auditing (comma-separated)',
        helpText: 'Posts with any of these flairs are ignored. Example: Official,Developer',
        defaultValue: '',
        scope: SettingScope.Installation,
      },
    ],
  },
]);

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS HELPER — parse all settings into a typed config object
// ─────────────────────────────────────────────────────────────────────────────
function parseList(raw: unknown): string[] {
  if (typeof raw !== 'string' || !raw.trim()) return [];
  return raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

async function getConfig(context: any) {
  const s = await context.settings.getAll();
  return {
    minStars:               (s['minStars']              as number)  ?? 5,
    minAgeDays:             (s['minAgeDays']            as number)  ?? 30,
    checkStars:             (s['checkStars']            as boolean) ?? true,
    checkAge:               (s['checkAge']              as boolean) ?? true,
    checkLicense:           (s['checkLicense']          as boolean) ?? true,
    checkSecurityPolicy:    (s['checkSecurityPolicy']   as boolean) ?? true,
    checkSignedCommits:     (s['checkSignedCommits']    as boolean) ?? true,
    checkOrgOwner:          (s['checkOrgOwner']         as boolean) ?? true,
    minScoreToPass:         (s['minScoreToPass']        as number)  ?? 3,
    postAuditComment:       (s['postAuditComment']      as boolean) ?? true,
    scanPosts:              (s['scanPosts']             as boolean) ?? true,
    scanPostEdits:          (s['scanPostEdits']         as boolean) ?? true,
    scanComments:           (s['scanComments']          as boolean) ?? true,
    silentHighScore:        (s['silentHighScore']       as boolean) ?? false,
    warnOnSudoScripts:      (s['warnOnSudoScripts']     as boolean) ?? true,
    enableNuclearOption:    (s['enableNuclearOption']   as boolean) ?? true,
    removeOnImpersonation:  (s['removeOnImpersonation'] as boolean) ?? true,
    removeOnZeroDaySudoScript: (s['removeOnZeroDaySudoScript'] as boolean) ?? true,
    removeOnBlacklist:      (s['removeOnBlacklist']     as boolean) ?? true,
    customRemovalComment:   (s['customRemovalComment']  as string)  ?? '',
    impersonationKeywords:  parseList(s['impersonationKeywords'] ?? 'lastpass,notion,metamask,ledger,malwarebytes,passbolt,proton'),
    exemptMods:             (s['exemptMods']            as boolean) ?? true,
    trustedOrgs:            parseList(s['trustedOrgs']),
    trustedRepos:           parseList(s['trustedRepos']),
    exemptFlairs:           parseList(s['exemptFlairs']),
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

  // Never scan own comments
  if (safeAuthor.toLowerCase() === 'github-guard') return;

  // ── Exemption: post flair ──────────────────────────────────────────────────
  if (postFlair && cfg.exemptFlairs.includes(postFlair.toLowerCase())) {
    console.log(`[Skip] Exempt flair: ${postFlair}`);
    return;
  }

  // ── Exemption: approved users / moderators ────────────────────────────────
  let isApproved = false;
  try {
    const subreddit = await context.reddit.getSubredditByName(context.subredditName);
    const contributors = await subreddit.getApprovedUsers({ username: safeAuthor }).all();
    isApproved = contributors.length > 0;
  
    if (!isApproved && cfg.exemptMods) {
      const moderators = await subreddit.getModerators({ username: safeAuthor }).all();
      if (moderators.length > 0) {
        console.log(`[Skip] Moderator: u/${safeAuthor}`);
        return;
      }
    }
  } catch (e) { console.error('Approved/mod check failed.'); }

  // ── Find GitHub link ───────────────────────────────────────────────────────
  const githubRegex = /github\.com\/([a-zA-Z0-9-._]+)\/([a-zA-Z0-9-._]+?)(?:\/|\.git|\s|\)|\]|$)/i;
  const match = text.match(githubRegex);
  if (!match) return;

  let [_, owner, repo] = match;
  repo = repo.replace(/\.git$/i, '').replace(/\/$/, '');
  const repoKey = `${owner.toLowerCase()}/${repo.toLowerCase()}`;

  // ── Exemption: always-trusted repos ──────────────────────────────────────
  if (cfg.trustedRepos.includes(repoKey)) {
    console.log(`[Skip] Trusted repo: ${repoKey}`);
    return;
  }

  // ── Redis cache ───────────────────────────────────────────────────────────
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
            const reply = await context.reddit.submitComment({ id, text: payload.commentText + cachedNote });
            await reply.distinguish(true);
          }
        } catch (_) {}
        return;
      }
    }
  } catch (e) { console.error('Redis cache read failed.'); }

  let lastCommentText = '';
  try {
    // ── GitHub API calls ────────────────────────────────────────────────────
    const token = await context.settings.get('github_token');
    const ghHeaders: Record<string, string> = {
      'User-Agent': 'Devvit-GitHub-Guard-Bot',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: ghHeaders });
    if (!repoRes.ok) return;
    const data = await repoRes.json();

    const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, { headers: ghHeaders });
    const commitData = await commitRes.json();
    const isSigned = commitData?.[0]?.commit?.verification?.verified || false;

    const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers: ghHeaders });
    const contentsData = await contentsRes.json();
    const hasInstallScript = Array.isArray(contentsData) && contentsData.some((file) =>
      ['install.sh', 'setup.sh', 'install.py', 'setup.py', 'configure'].includes(file.name.toLowerCase())
    );

    const checkSecurity = async (url: string) => {
      try {
        const res = await fetch(url, { method: 'HEAD', headers: ghHeaders });
        return res.status === 200;
      } catch { return false; }
    };
    const [secRoot, secDotGithub, secDocs] = await Promise.all([
      checkSecurity(`https://api.github.com/repos/${owner}/${repo}/contents/SECURITY.md`),
      checkSecurity(`https://api.github.com/repos/${owner}/${repo}/contents/.github/SECURITY.md`),
      checkSecurity(`https://api.github.com/repos/${owner}/${repo}/contents/docs/SECURITY.md`),
    ]);
    const hasSecurityPolicy = secRoot || secDotGithub || secDocs;

    // ── Exemption: trusted org (full score, skip nuclear) ──────────────────
    const ownerLower = data.owner.login.toLowerCase();
    const isTrustedOrg = cfg.trustedOrgs.includes(ownerLower);

    // ── Scoring engine — respects per-check toggles ────────────────────────
    let score = 0;
    const maxScore = [
      cfg.checkStars, cfg.checkAge, cfg.checkLicense,
      cfg.checkSecurityPolicy, cfg.checkOrgOwner, cfg.checkSignedCommits,
    ].filter(Boolean).length;

    const details: string[] = [];
    const repoNameLower = repo.toLowerCase();

    const isOldEnough = (Date.now() - new Date(data.created_at).getTime()) > cfg.minAgeDays * 86_400_000;

    if (cfg.checkStars) {
      if (isTrustedOrg || data.stargazers_count >= cfg.minStars) {
        score++;
        details.push(`✅ Established Community (⭐ ${data.stargazers_count.toLocaleString()} stars)`);
      } else {
        details.push(`❌ Low Star Count (⭐ ${data.stargazers_count.toLocaleString()} / ${cfg.minStars} required)`);
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
        details.push('❌ No Security Policy — [what is this?](https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository)');
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

    // ── Nuclear option checks ──────────────────────────────────────────────
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
      cfg.enableNuclearOption &&
      !isTrustedOrg &&
      (isImpersonating || isUltraNewRisk);

    const nukeReason = isImpersonating
      ? 'Impersonation of a well-known application'
      : 'Brand-new repository with a zero-star automated install script';

    // ── Comment assembly ───────────────────────────────────────────────────
    const auditTrail = details.map((d) => `* ${d}`).join('\n');
    const riskWarning =
      cfg.warnOnSudoScripts && hasInstallScript
        ? '\n\n> ⚠️ **High-Risk File Detected:** Contains an installation script (`.sh` or `.py`). ' +
          'Review the code carefully before running with `sudo`.'
        : '';

    // ── Action: remove ─────────────────────────────────────────────────────
    if (isKnownThreat && !isApproved) {
      await context.reddit.remove(id, false);

      const dashboardLink = `\n\n---\n📋 *Moderators: [View the scan dashboard](https://old.reddit.com/r/${context.subredditName}/wiki/github-guard-dashboard)*`;

      const defaultRemovalText =
        `🛡️ **GitHub Guard: Malicious Pattern Detected**\n\n` +
        `This repository was removed for community safety.\n\n` +
        `**Reason:** ${nukeReason}\n\n` +
        `**Trust Report:**\n${auditTrail}${riskWarning}${dashboardLink}`;

      const removalText = cfg.customRemovalComment
        ? cfg.customRemovalComment.replace('{reason}', nukeReason)
        : defaultRemovalText;

      const reply = await context.reddit.submitComment({ id, text: removalText });
      await reply.distinguish(true);
      console.log(`[Removed] ${owner}/${repo} — ${nukeReason}`);
      await logScanResult(context, { owner, repo, score, maxScore, action: 'removed', reason: nukeReason, postId: id, author: safeAuthor, timestamp: Date.now() });

    // ── Action: risk warning ───────────────────────────────────────────────
    } else if ((cfg.postAuditComment && !(cfg.silentHighScore && score >= cfg.minScoreToPass)) || score < cfg.minScoreToPass) {
      const scoreLine =
        score < cfg.minScoreToPass
          ? `⚠️ This project scored **${score}/${maxScore}** — below this subreddit's threshold of ${cfg.minScoreToPass}.`
          : `This project scored **${score}/${maxScore}** on our safety audit.`;

      const approvedNote = isApproved ? '\n\n*Note: Author is an Approved User.*' : '';

      const commentText =
        `🔍 **GitHub Guard: Trust Report**\n\n` +
        `${scoreLine}${approvedNote}\n\n` +
        `**Audit Breakdown:**\n${auditTrail}${riskWarning}\n\n` +
        `> **⚠️ Security Reminder:** Always verify source code and run third-party scripts at your own risk.`;

      lastCommentText = commentText;
      const reply = await context.reddit.submitComment({ id, text: commentText });
      await reply.distinguish(true);
      console.log(`[Reported] ${owner}/${repo}: ${score}/${maxScore}`);
      await logScanResult(context, { owner, repo, score, maxScore, action: score < cfg.minScoreToPass ? 'reported' : 'skipped', postId: id, author: safeAuthor, timestamp: Date.now() });
    }

    // ── Cache to avoid rescanning ──────────────────────────────────────────
    // Store the comment text so cache hits can re-post it
    const cachedPayload = JSON.stringify({ commentText: isKnownThreat ? null : lastCommentText, score, maxScore, action: isKnownThreat ? 'removed' : (score < cfg.minScoreToPass ? 'reported' : 'skipped') });
    await context.redis.set(cacheKey, cachedPayload, { expiration: new Date(Date.now() + 3_600_000) });

  } catch (e) { console.error('❌ System Error:', e); }
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
    // Always bypass cache on edits — content may have changed
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
  event: 'PostCreate',
  onEvent: async (event, context) => {
    if (!event.post?.id) return;
    const cfg = await getConfig(context);
    if (!cfg.scanPosts) return;
    const post = await context.reddit.getPostById(event.post.id);
    await scanForGitHub(
      `${post.title} ${post.url ?? ''} ${post.body ?? ''}`,
      event.post.id,
      post.authorName,
      post.flair?.text ?? undefined,
      context
    );
  },
});

Devvit.addTrigger({
  event: 'CommentCreate',
  onEvent: async (event, context) => {
    if (!event.comment?.id) return;
    const cfg = await getConfig(context);
    if (!cfg.scanComments) return;
    const comment = await context.reddit.getCommentById(event.comment.id);
    // Comments don't carry post flair directly — pass undefined
    await scanForGitHub(comment.body ?? '', event.comment.id, comment.authorName, undefined, context);
  },
});


// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// MOD DASHBOARD — writes scan log to subreddit wiki page
// ─────────────────────────────────────────────────────────────────────────────

async function logScanResult(context: any, entry: {
  owner: string;
  repo: string;
  score: number;
  maxScore: number;
  action: 'reported' | 'removed' | 'skipped';
  reason?: string;
  postId: string;
  author: string;
  timestamp: number;
}) {
  try {
    const key = `gh_log_${entry.timestamp}_${entry.owner}_${entry.repo}`;
    await context.redis.set(key, JSON.stringify(entry), { expiration: new Date(Date.now() + 7 * 86_400_000) });
    const indexRaw = await context.redis.get('gh_log_index').catch(() => null);
    const index: string[] = indexRaw ? JSON.parse(indexRaw) : [];
    index.unshift(key);
    if (index.length > 50) index.splice(50);
    await context.redis.set('gh_log_index', JSON.stringify(index), { expiration: new Date(Date.now() + 7 * 86_400_000) });
  } catch (e) { console.error('Failed to log scan result:', e); }
}

async function rebuildWikiDashboard(context: any) {
  try {
    const indexRaw = await context.redis.get('gh_log_index').catch(() => null);
    const flagIndexRaw = await context.redis.get('gh_flag_index').catch(() => null);
    const index: string[] = indexRaw ? JSON.parse(indexRaw) : [];
    const flagIndex: string[] = flagIndexRaw ? JSON.parse(flagIndexRaw) : [];

    // Fetch scan entries
    const entries = (await Promise.all(
      index.map(async (k: string) => {
        const raw = await context.redis.get(k).catch(() => null);
        return raw ? JSON.parse(raw) : null;
      })
    )).filter(Boolean).sort((a: any, b: any) => b.timestamp - a.timestamp);

    // Fetch flag entries
    const flags = (await Promise.all(
      flagIndex.slice(0, 20).map(async (k: string) => {
        const raw = await context.redis.get(k).catch(() => null);
        return raw ? JSON.parse(raw) : null;
      })
    )).filter(Boolean).sort((a: any, b: any) => b.timestamp - a.timestamp);

    const removed  = entries.filter((e: any) => e.action === 'removed').length;
    const warned   = entries.filter((e: any) => e.action === 'reported').length;
    const passed   = entries.filter((e: any) => e.action === 'skipped').length;

    const rows = entries.map((e: any) => {
      const d = new Date(e.timestamp).toISOString().slice(0, 10);
      const link = `https://reddit.com/r/${context.subredditName}/comments/${e.postId}`;
      return `| [${e.owner}/${e.repo}](https://github.com/${e.owner}/${e.repo}) | ${e.action.toUpperCase()} | ${e.score}/${e.maxScore} | u/${e.author} | [post](${link}) | ${d} |`;
    }).join('\n');

    const flagRows = flags.map((f: any) => {
      const d = new Date(f.timestamp).toISOString().slice(0, 10);
      const link = `https://reddit.com/r/${context.subredditName}/comments/${f.postId}`;
      return `| [${f.postTitle ?? f.postId}](${link}) | u/${f.reporter} | ${f.status} | ${d} |`;
    }).join('\n');

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
      '',
      '## Community Reports (pending)',
      '',
      '| Post | Reporter | Status | Date |',
      '|------|----------|--------|------|',
      flagRows || '| — | — | — | — |',
    ].join('\n');

    const subreddit = await context.reddit.getCurrentSubreddit();
    await context.reddit.updateWikiPage({
      subredditName: subreddit.name,
      page: 'github-guard-dashboard',
      content: wikiContent,
      reason: 'GitHub Guard auto-update',
    });
    console.log('[Dashboard] Wiki updated');
  } catch (e) { console.error('[Dashboard] Wiki update failed:', e); }
}

// Mod menu item to manually refresh the dashboard wiki page
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

// COMMUNITY REPORTING — users can flag a post for mod review
// ─────────────────────────────────────────────────────────────────────────────
Devvit.addMenuItem({
  label: '🚩 Report GitHub Link to Mods',
  location: 'post',
  onPress: async (event, context) => {
    try {
      const post = await context.reddit.getPostById(event.targetId);
      const currentUser = await context.reddit.getCurrentUser();
      const reporter = currentUser?.username ?? 'unknown';

      // Rate limit: one report per user per post
      const reportKey = `gh_report_${event.targetId}_${reporter}`;
      const alreadyReported = await context.redis.get(reportKey).catch(() => null);
      if (alreadyReported) {
        context.ui.showToast('You have already reported this post.');
        return;
      }
      await context.redis.set(reportKey, '1', { expiration: new Date(Date.now() + 7 * 86_400_000) });

      // Store report for dashboard / mod review
      const reportEntry = {
        postId: event.targetId,
        postTitle: post.title,
        postUrl: post.url ?? '',
        reporter,
        timestamp: Date.now(),
        status: 'pending',
      };
      const rKey = `gh_flagged_${Date.now()}_${event.targetId}`;
      await context.redis.set(rKey, JSON.stringify(reportEntry), { expiration: new Date(Date.now() + 7 * 86_400_000) });

      // Keep a flagged index for the dashboard
      const flagIndexRaw = await context.redis.get('gh_flag_index').catch(() => null);
      const flagIndex: string[] = flagIndexRaw ? JSON.parse(flagIndexRaw) : [];
      flagIndex.unshift(rKey);
      if (flagIndex.length > 100) flagIndex.splice(100);
      await context.redis.set('gh_flag_index', JSON.stringify(flagIndex), { expiration: new Date(Date.now() + 7 * 86_400_000) });

      // Send modmail notification
      const subreddit = await context.reddit.getCurrentSubreddit();
      await context.reddit.sendPrivateMessage({
        to: `/r/${subreddit.name}`,
        subject: '🚩 GitHub Guard: Community Report',
        text: `u/${reporter} flagged a post for review:\n\n**Post:** ${post.title}\n**Link:** https://reddit.com${post.permalink}\n**GitHub URL:** ${post.url ?? 'N/A'}\n\n📋 Dashboard: https://old.reddit.com/r/${subreddit.name}/wiki/github-guard-dashboard`,
      });

      context.ui.showToast('Report submitted — mods have been notified. Thank you!');
    } catch (e) {
      console.error('Community report failed:', e);
      context.ui.showToast('Something went wrong. Please try again.');
    }
  },
});

export default Devvit;

// DEV ONLY — remove before publishing
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