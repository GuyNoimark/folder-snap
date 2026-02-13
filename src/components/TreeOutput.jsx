import React from 'react';

function getFileIcon(filename, userIcons) {
  const ext = filename.split('.').pop()?.toLowerCase();
  return userIcons[ext] || userIcons.default || '📄';
}

function getNodeIcon(node, showIcons, userIcons) {
  if (node.type === 'folder') return '📁';
  if (!showIcons) return '📄';
  return getFileIcon(node.name, userIcons);
}

function TreeNode({ node, showIcons, userIcons, depth = 0 }) {
  const icon = getNodeIcon(node, showIcons, userIcons);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      {/* Node row */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '5px 10px',
          borderRadius: 8,
          margin: '1px 0',
          cursor: 'default',
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,42,0.07)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{
          fontSize: 16,
          flexShrink: 0,
          filter: node.type === 'folder'
            ? 'drop-shadow(0 1px 2px rgba(245,158,42,0.2))'
            : 'none',
        }}>
          {icon}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          color: node.type === 'folder' ? '#2d3748' : '#4a5568',
          fontWeight: node.type === 'folder' ? 500 : 400,
          letterSpacing: '-0.01em',
        }}>
          {node.name}
        </span>
      </div>

      {/* Children */}
      {hasChildren && (
        <div style={{
          marginLeft: 26,
          borderLeft: '2px solid #f0c070',
          paddingLeft: 12,
        }}>
          {node.children.map((child, i) => (
            <TreeNode
              key={`${child.name}-${i}`}
              node={child}
              showIcons={showIcons}
              userIcons={userIcons}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeOutput({ treeRef, filteredTree, showIcons, userIcons }) {
  if (!filteredTree) return null;

  return (
    <div
      ref={treeRef}
      style={{
        padding: '28px 32px',
        background: '#f8f9fb',
        minHeight: 200,
        animation: 'fadeSlideIn 0.3s ease',
      }}
    >
      {/* Root path banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 6,
        padding: '10px 14px',
        background: 'white',
        borderRadius: 10,
        border: '1px solid #e5e8ef',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <span style={{ fontSize: 18 }}>💻</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14, fontWeight: 600,
          color: '#2d3748',
          wordBreak: 'break-all',
        }}>
          {filteredTree.fullPath || filteredTree.name}
        </span>
      </div>

      {/* Children */}
      {filteredTree.children?.map((child, i) => (
        <TreeNode
          key={`${child.name}-${i}`}
          node={child}
          showIcons={showIcons}
          userIcons={userIcons}
        />
      ))}
    </div>
  );
}
