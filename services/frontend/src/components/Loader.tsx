export default function Loader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 16 }}>
      <div
        style={{
          width: 36,
          height: 36,
          border: '3px solid #e1e4e8',
          borderTopColor: '#24292e',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: '#666', fontSize: 14, margin: 0 }}>Fetching repository data...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
