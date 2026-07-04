interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function SearchBar({ value, onChange, onSearch, loading }: SearchBarProps) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder="owner/repo (e.g. facebook/react)"
        style={{
          flex: 1,
          padding: '10px 14px',
          fontSize: 15,
          border: '1px solid #d0d0d0',
          borderRadius: 6,
          outline: 'none',
        }}
      />
      <button
        onClick={onSearch}
        disabled={loading}
        style={{
          padding: '10px 24px',
          fontSize: 15,
          backgroundColor: '#24292e',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Loading...' : 'Search'}
      </button>
    </div>
  );
}
