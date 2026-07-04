import { Comment } from '../types';

interface CommentPanelProps {
  sha: string;
  comments: Comment[];
  onClose: () => void;
}

export default function CommentPanel({ sha, comments, onClose }: CommentPanelProps) {
  return (
    <div
      style={{
        marginTop: 16,
        border: '1px solid #d0d7de',
        borderRadius: 8,
        backgroundColor: '#fff',
        padding: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16 }}>
          Comments for commit <code style={{ fontSize: 13 }}>{sha.substring(0, 7)}</code>
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
            color: '#666',
          }}
        >
          x
        </button>
      </div>

      {comments.length === 0 ? (
        <p style={{ color: '#888', fontStyle: 'italic' }}>
          No comments loaded for this commit. Comments may not be available via
          the repository-level comments API.
        </p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            style={{ borderTop: '1px solid #eee', paddingTop: 12, marginTop: 12 }}
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
                style={{ fontWeight: 600, color: '#0969da', textDecoration: 'none' }}
              >
                {comment.user.login}
              </a>
              <span style={{ fontSize: 12, color: '#888' }}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ margin: '0 0 8px 36px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
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
        ))
      )}
    </div>
  );
}
