const SIZES = {
  xs: 26,
  sm: 40,
  md: 44,
  react: 22,
};

export default function UserAvatar({ initial, size = 'sm' }) {
  const px = SIZES[size] || SIZES.sm;

  return (
    <div
      className="user-avatar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        width: px,
        height: px,
        minWidth: px,
        minHeight: px,
        maxWidth: px,
        maxHeight: px,
        fontSize: Math.round(px * 0.4),
        backgroundColor: '#0ACF83',
        color: '#ffffff',
        fontWeight: 600,
        lineHeight: 1,
        flexShrink: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {initial}
    </div>
  );
}
