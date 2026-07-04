import { useState } from 'react';
import { Comment } from '../types';

interface CommentsSectionProps {
  comments: Comment[];
}

const PAGE_SIZE = 10;

export default function CommentsSection({ comments }: CommentsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleComments = comments.slice(0, visibleCount);
  const hasMore = visibleCount < comments.length;

  if (comments.length === 0) {
    return (
      <div
        style={{
          border: '1px solid #d0d7de',
          borderRadius: 8,
          backgroundColor: '#fff',
          padding: '32px 16px',
          textAlign: 'center',
          color: '#888',
          fontStyle: 'italic',
        }}
      >
        No commit comments found for this repository.
      </div>
    );
  }

  return (
    <div
      style={{
        border: '1px solid #d0d7de',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      {visibleComments.map((comment, index) => (
        <div
          key={comment.id}
          style={{
            padding: '14px 16px',
            borderTop: index > 0 ? '1px solid #d0d7de' : undefined,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <img
              src={comment.user.avatarUrl}
              alt={comment.user.login}
              width={28}
              height={28}
              style={{ borderRadius: '50%' }}
            />
            <a
              href={comment.user.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 600, color: '#0969da', textDecoration: 'none', fontSize: 14 }}
            >
              {comment.user.login}
            </a>
            <span style={{ fontSize: 12, color: '#888' }}>
              commented on{' '}
              <code style={{ fontSize: 11, backgroundColor: '#f6f8fa', padding: '1px 4px', borderRadius: 3 }}>
                {comment.commitSha.substring(0, 7)}
              </code>
            </span>
            <span style={{ fontSize: 12, color: '#aaa', marginLeft: 'auto' }}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p
            style={{
              margin: '0 0 6px 36px',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.5,
              fontSize: 14,
            }}
          >
            {comment.body}
          </p>
          <a
            href={comment.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 36, fontSize: 12, color: '#0969da' }}
          >
            View on GitHub
          </a>
        </div>
      ))}

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
            See More ({comments.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
