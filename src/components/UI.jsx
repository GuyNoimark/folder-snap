import React from 'react';

// ── Panel ──────────────────────────────────────────────────
export function Panel({ children, style }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function PanelHeader({ title, right }) {
  return (
    <div style={{
      padding: '14px 20px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Dot active />
        <Dot />
        <Dot />
        <span style={{
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginLeft: 4,
        }}>{title}</span>
      </div>
      {right}
    </div>
  );
}

function Dot({ active }) {
  return (
    <div style={{
      width: 8, height: 8,
      borderRadius: '50%',
      background: active ? 'var(--accent)' : 'var(--border-light)',
      boxShadow: active ? '0 0 6px var(--accent-glow)' : 'none',
    }} />
  );
}

// ── Button ─────────────────────────────────────────────────
export function Btn({ children, variant = 'ghost', onClick, disabled, style, title }) {
  const base = {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '8px 18px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13, fontWeight: 600,
    border: 'none',
    transition: 'all 0.18s',
    fontFamily: 'var(--font-body)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    whiteSpace: 'nowrap',
  };

  const variants = {
    primary: {
      background: 'var(--accent)',
      color: '#0f1117',
      boxShadow: '0 0 16px var(--accent-glow)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border)',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => {
        if (disabled) return;
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 0 22px var(--accent-glow)';
        } else {
          e.currentTarget.style.borderColor = 'var(--border-light)';
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.background = 'var(--surface2)';
        }
      }}
      onMouseLeave={e => {
        if (disabled) return;
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 0 16px var(--accent-glow)';
        } else {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {children}
    </button>
  );
}

// ── Toggle ─────────────────────────────────────────────────
export function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <span style={{
        fontSize: 12,
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
        whiteSpace: 'nowrap',
      }}>{label}</span>
      <div style={{ position: 'relative', width: 34, height: 18, flexShrink: 0 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
        />
        <div
          onClick={() => onChange({ target: { checked: !checked } })}
          style={{
            position: 'absolute', inset: 0,
            background: checked ? 'var(--accent)' : 'var(--border-light)',
            borderRadius: 20, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <div style={{
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            width: 14, height: 14,
            background: 'white',
            borderRadius: '50%',
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }} />
        </div>
      </div>
    </label>
  );
}

// ── Spinner ────────────────────────────────────────────────
export function Spinner({ color = '#0f1117' }) {
  return (
    <div style={{
      display: 'inline-block',
      width: 14, height: 14,
      border: `2px solid rgba(255,255,255,0.3)`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  );
}

// ── Toast ──────────────────────────────────────────────────
export function Toast({ visible, icon, message }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 28, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
      background: 'var(--surface2)',
      border: '1px solid var(--border-light)',
      borderRadius: 40,
      padding: '10px 20px',
      fontSize: 13, fontWeight: 500,
      color: 'var(--text-primary)',
      display: 'flex', alignItems: 'center', gap: 8,
      transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      zIndex: 999,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      pointerEvents: 'none',
    }}>
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  );
}

// ── Hint ───────────────────────────────────────────────────
export function Hint({ children }) {
  return (
    <div style={{
      fontSize: 12,
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
      paddingTop: 8,
      lineHeight: 1.6,
    }}>
      {children}
    </div>
  );
}

export function Code({ children }) {
  return (
    <code style={{
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      padding: '1px 5px',
      color: 'var(--text-secondary)',
    }}>
      {children}
    </code>
  );
}
