import { useState } from 'react';
import { Author } from '../types';

interface AuthorsSectionProps {
  authors: Author[];
}

const PAGE_SIZE = 8;

export default function AuthorsSection({ authors }: AuthorsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleAuthors = authors.slice(0, visibleCount);
  const hasMore = visibleCount < authors.length;

  return (
    <div
      style={{
        border: '1px solid #d0d7de',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 1,
          backgroundColor: '#d0d7de',
        }}
      >
        {visibleAuthors.map((author) => (
          <div
            key={author.login}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              backgroundColor: '#fff',
            }}
          >
            {author.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt={author.login}
                width={36}
                height={36}
                style={{ borderRadius: '50%', flexShrink: 0 }}
              />
            ) : (
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#e1e4e8',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#57606a',
                }}
              >
                {author.login.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {author.profileUrl ? (
                  <a
                    href={author.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: '#0969da',
                      textDecoration: 'none',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {author.login}
                  </a>
                ) : (
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {author.login}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#57606a', marginTop: 2 }}>
                {author.commitCount} commit{author.commitCount !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div
          style={{
            textAlign: 'center',
            padding: '12px 0',
            borderTop: '1px solid #d0d7de',
            backgroundColor: '#fff',
          }}
        >
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0969da',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            See More ({authors.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
