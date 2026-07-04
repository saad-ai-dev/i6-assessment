import { useState } from 'react';
import { Commit, Comment } from '../types';
import CommentPanel from './CommentPanel';

interface CommitsTableProps {
  commits: Commit[];
  commentsByCommit: Map<string, Comment[]>;
}

const PAGE_SIZE = 10;

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'center',
  fontSize: 13,
  fontWeight: 600,
  color: '#57606a',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 16px',
};

export default function CommitsTable({ commits, commentsByCommit }: CommitsTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeCommitSha, setActiveCommitSha] = useState<string | null>(null);

  const visibleCommits = commits.slice(0, visibleCount);
  const hasMore = visibleCount < commits.length;

  return (
    <>
      <div
        style={{
          border: '1px solid #d0d7de',
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ backgroundColor: '#f6f8fa' }}>
              <th style={thStyle}>Author</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Commit Title</th>
              <th style={thStyle}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {visibleCommits.map((commit) => (
              <tr
                key={commit.sha}
                style={{
                  borderTop: '1px solid #d0d7de',
                  backgroundColor: activeCommitSha === commit.sha ? '#f0f7ff' : undefined,
                }}
              >
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {commit.author.avatarUrl && (
                      <img
                        src={commit.author.avatarUrl}
                        alt={commit.author.login ?? commit.author.name}
                        width={24}
                        height={24}
                        style={{ borderRadius: '50%' }}
                      />
                    )}
                    <span>{commit.author.login ?? commit.author.name}</span>
                  </div>
                </td>
                <td style={{ ...tdStyle, maxWidth: 500 }}>
                  <span
                    style={{
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={commit.title}
                  >
                    {commit.title}
                  </span>
                  <span style={{ fontSize: 12, color: '#888', fontFamily: 'monospace' }}>
                    {commit.sha.substring(0, 7)}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  {commit.commentCount > 0 ? (
                    <button
                      onClick={() =>
                        setActiveCommitSha((prev) => (prev === commit.sha ? null : commit.sha))
                      }
                      style={{
                        background: 'none',
                        border: '1px solid #0969da',
                        color: '#0969da',
                        borderRadius: 12,
                        padding: '2px 10px',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                      title="Click to view comments"
                    >
                      {commit.commentCount}
                    </button>
                  ) : (
                    <span style={{ color: '#aaa' }}>0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {hasMore && (
          <div
            style={{
              textAlign: 'center',
              padding: '12px 0',
              borderTop: '1px solid #d0d7de',
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
              See More ({commits.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {activeCommitSha && (
        <CommentPanel
          sha={activeCommitSha}
          comments={commentsByCommit.get(activeCommitSha) ?? []}
          onClose={() => setActiveCommitSha(null)}
        />
      )}
    </>
  );
}
