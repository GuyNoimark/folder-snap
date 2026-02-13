import React from 'react';
import { Panel, PanelHeader, Btn, Toggle } from './UI';

const DEPTH_OPTIONS = [
  { value: 'top', label: 'Top level' },
  { value: '2',   label: '2 levels' },
  { value: '3',   label: '3 levels' },
  { value: 'full', label: 'Full' },
  { value: 'custom', label: '# Custom' },
];

export default function ConfigPanel({
  depthMode, setDepthMode,
  customDepth, setCustomDepth,
  showIcons, setShowIcons,
  iconsOpen, setIconsOpen,
  userIcons, setUserIcons,
}) {
  return (
    <Panel>
      <PanelHeader title="Configuration" />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        padding: '16px 20px',
        background: 'var(--surface)',
      }}>
        {/* Depth label */}
        <span style={{
          fontSize: 12,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
          whiteSpace: 'nowrap',
        }}>
          Depth:
        </span>

        {/* Depth buttons */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {DEPTH_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDepthMode(opt.value)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                cursor: 'pointer',
                border: `1px solid ${depthMode === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                background: depthMode === opt.value ? 'var(--accent-dim)' : 'transparent',
                color: depthMode === opt.value ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom depth number */}
        {depthMode === 'custom' && (
          <input
            type="number"
            min={1} max={20}
            value={customDepth}
            onChange={e => setCustomDepth(e.target.value)}
            style={{
              width: 52,
              padding: '5px 8px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              textAlign: 'center',
              outline: 'none',
            }}
          />
        )}

        <div style={{ flex: 1 }} />

        {/* File icons toggle */}
        <Toggle
          label="File icons"
          checked={showIcons}
          onChange={e => setShowIcons(e.target.checked)}
        />

        {/* Edit icons button — only when icons enabled */}
        {showIcons && (
          <Btn
            onClick={() => setIconsOpen(o => !o)}
            style={{ fontSize: 12, padding: '6px 14px' }}
          >
            {iconsOpen ? '▲ Hide icons' : '✏️ Edit icons'}
          </Btn>
        )}
      </div>

      {/* Icon editor */}
      {showIcons && iconsOpen && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <div style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface2)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: 12, fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)', fontWeight: 500,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              ✦ File Type Icons
            </span>
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}>
              Click any emoji to change it
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: 8,
            padding: '16px 20px',
            background: 'var(--surface)',
          }}>
            {Object.entries(userIcons)
              .filter(([k]) => k !== 'default')
              .map(([ext, icon]) => (
                <div
                  key={ext}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '7px 10px',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11, fontWeight: 600,
                    color: 'var(--text-secondary)',
                    minWidth: 38,
                    textTransform: 'lowercase',
                  }}>
                    .{ext}
                  </span>
                  <input
                    type="text"
                    maxLength={2}
                    defaultValue={icon}
                    onFocus={e => e.target.select()}
                    onChange={e => {
                      const val = [...e.target.value].find(c => c.trim()) || icon;
                      setUserIcons(prev => ({ ...prev, [ext]: val }));
                      e.target.value = val;
                    }}
                    style={{
                      width: 32,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: 18,
                      textAlign: 'center',
                      cursor: 'text',
                      color: 'var(--text-primary)',
                      padding: 0,
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </Panel>
  );
}
