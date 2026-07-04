import { Author } from '../types';

interface AuthorFilterProps {
  authors: Author[];
  totalCommits: number;
  selectedAuthor: string;
  filteredCount: number;
  onSelect: (author: string) => void;
}

export default function AuthorFilter({
  authors,
  totalCommits,
  selectedAuthor,
  filteredCount,
  onSelect,
}: AuthorFilterProps) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
      <label style={{ fontWeight: 600, fontSize: 14 }}>Filter by author:</label>
      <select
        value={selectedAuthor}
        onChange={(e) => onSelect(e.target.value)}
        style={{
          padding: '8px 12px',
          fontSize: 14,
          border: '1px solid #d0d0d0',
          borderRadius: 6,
          minWidth: 220,
        }}
      >
        <option value="">All authors ({totalCommits} commits)</option>
        {authors.map((a) => (
          <option key={a.login} value={a.login}>
            {a.login} ({a.commitCount} commits)
          </option>
        ))}
      </select>
      {selectedAuthor && (
        <span style={{ fontSize: 13, color: '#666' }}>
          Showing {filteredCount} commit{filteredCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}
