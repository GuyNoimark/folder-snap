// ── Parse folder PATH (one path per line) ──────────────────
export function parseFolderPath(raw) {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  if (!lines.length) return null;

  const allPaths = lines.map(l => l.replace(/\\/g, '/').replace(/\/+$/, ''));
  const rootPath = allPaths[0];
  const rootSegments = rootPath.split('/').filter(Boolean);

  function insertPath(tree, segments) {
    if (!segments.length) return;
    const seg = segments[0];
    if (!tree[seg]) tree[seg] = {};
    insertPath(tree[seg], segments.slice(1));
  }

  const pathMap = {};
  rootSegments.forEach((_, i) => insertPath(pathMap, rootSegments.slice(0, i + 1)));
  for (let i = 1; i < allPaths.length; i++) {
    insertPath(pathMap, allPaths[i].split('/').filter(Boolean));
  }

  function mapToTree(map, name, fullPath) {
    return {
      name,
      fullPath,
      type: 'folder',
      children: Object.keys(map).map(k => mapToTree(map[k], k, `${fullPath}/${k}`)),
    };
  }

  let cursor = pathMap;
  for (const seg of rootSegments) cursor = cursor[seg] || {};

  return {
    name: rootSegments[rootSegments.length - 1] || rootPath,
    fullPath: rootPath,
    type: 'folder',
    children: Object.keys(cursor).map(k => mapToTree(cursor[k], k, `${rootPath}/${k}`)),
  };
}

// ── Parse README-style tree ────────────────────────────────
export function parseReadmeTree(raw) {
  const lines = raw.split('\n').filter(l => l.trim());
  if (!lines.length) return null;

  const normalized = lines.map(line => {
    const stripped = line
      .replace(/│/g, '|')
      .replace(/├──/g, '|--')
      .replace(/└──/g, '`--')
      .replace(/\|--/g, '  ')
      .replace(/`--/g, '  ')
      .replace(/\|/g, ' ');
    const leadingSpaces = stripped.length - stripped.trimStart().length;
    const name = line.replace(/^[\s│├└─`|\\-]+/, '').trim();
    return { depth: Math.floor(leadingSpaces / 2), name, raw: line };
  });

  function buildTree(items) {
    const root = { name: items[0]?.name || 'root', type: 'folder', children: [], fullPath: '' };
    const stack = [{ node: root, depth: -1 }];

    for (let i = 1; i < items.length; i++) {
      const item = items[i];
      const name = item.name.replace(/\/$/, '');
      const isFolder = item.raw.trim().endsWith('/') || !/\.\w+$/.test(name);
      const node = { name, type: isFolder ? 'folder' : 'file', children: [] };

      while (stack.length > 1 && stack[stack.length - 1].depth >= item.depth) {
        stack.pop();
      }

      stack[stack.length - 1].node.children.push(node);
      if (isFolder) stack.push({ node, depth: item.depth });
    }
    return root;
  }

  return buildTree(normalized);
}

// ── GitHub tree builder ────────────────────────────────────
export function githubItemsToTree(items, repoName) {
  const root = { name: repoName, fullPath: repoName, type: 'folder', children: [] };

  items.forEach(item => {
    const parts = item.path.split('/');
    let cursor = root;
    parts.forEach((part, i) => {
      const isLast = i === parts.length - 1;
      let child = cursor.children.find(c => c.name === part);
      if (!child) {
        child = {
          name: part,
          type: isLast && item.type === 'blob' ? 'file' : 'folder',
          children: [],
        };
        cursor.children.push(child);
      }
      cursor = child;
    });
  });

  return root;
}

// ── Depth filter ───────────────────────────────────────────
export function filterDepth(node, depthMode, customDepth, currentDepth = 0) {
  if (!node) return null;
  const copy = { ...node };
  if (!copy.children) return copy;

  if (depthMode === 'top') {
    copy.children = currentDepth === 0
      ? copy.children.map(c => ({ ...c, children: [] }))
      : [];
  } else if (depthMode === 'full') {
    copy.children = copy.children.map(c => filterDepth(c, depthMode, customDepth, currentDepth + 1));
  } else {
    const limit = depthMode === 'custom' ? (parseInt(customDepth) || 4) : parseInt(depthMode);
    if (currentDepth >= limit) {
      copy.children = [];
    } else {
      copy.children = copy.children.map(c => filterDepth(c, depthMode, customDepth, currentDepth + 1));
    }
  }
  return copy;
}

// ── Count total items ──────────────────────────────────────
export function countItems(node) {
  if (!node) return 0;
  let count = 0;
  if (node.children) {
    count += node.children.length;
    node.children.forEach(c => { count += countItems(c); });
  }
  return count;
}

// ── Tree → text ────────────────────────────────────────────
export function treeToText(node, prefix = '', isLast = true, isRoot = true) {
  if (!node) return '';
  let result = '';
  if (isRoot) {
    result += (node.fullPath || node.name) + '\n';
    (node.children || []).forEach((child, i) => {
      result += treeToText(child, '', i === node.children.length - 1, false);
    });
    return result;
  }
  result += prefix + (isLast ? '└── ' : '├── ') + node.name + '\n';
  const newPrefix = prefix + (isLast ? '    ' : '│   ');
  (node.children || []).forEach((child, i) => {
    result += treeToText(child, newPrefix, i === node.children.length - 1, false);
  });
  return result;
}

// ── GitHub fetch ───────────────────────────────────────────
const CORS_PROXY = 'https://corsproxy.io/?';

async function githubFetch(url, headers) {
  try {
    const res = await fetch(url, { headers });
    if (res.ok) return res;
    if (res.status === 401 || res.status === 403) return res;
  } catch (e) { /* fall through */ }
  return fetch(CORS_PROXY + encodeURIComponent(url), { headers });
}

export function parseGithubUrl(url) {
  const match = url.trim().replace(/\/$/, '')
    .match(/github\.com\/([^/]+)\/([^/?#]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

export async function fetchGithubTree(owner, repo, token, onStatus) {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (token) headers['Authorization'] = `token ${token}`;

  onStatus('loading', 'Fetching repo info…');
  const repoRes = await githubFetch(`https://api.github.com/repos/${owner}/${repo}`, headers);
  if (!repoRes.ok) {
    const err = await repoRes.json().catch(() => ({}));
    throw new Error(err.message || `Repo not found (${repoRes.status})`);
  }
  const repoData = await repoRes.json();
  const branch = repoData.default_branch || 'main';

  onStatus('loading', 'Loading file tree…');
  const treeRes = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    headers
  );
  if (!treeRes.ok) {
    const err = await treeRes.json().catch(() => ({}));
    throw new Error(err.message || `Could not load tree (${treeRes.status})`);
  }
  const treeJson = await treeRes.json();
  const count = treeJson.tree?.length || 0;

  if (treeJson.truncated) {
    onStatus('warn', `Large repo — showing first ${count.toLocaleString()} items (truncated by GitHub)`);
  } else {
    onStatus('success', `Loaded ${count.toLocaleString()} items from ${owner}/${repo} (${branch})`);
  }

  return { items: treeJson.tree || [], repoName: repo };
}
