import { mapComments } from '../map-comments';
import { GitHubCommentResponse } from '../../modules/repos/types';

describe('mapComments', () => {
  it('should map GitHub comment response to app format', () => {
    const raw: GitHubCommentResponse[] = [
      {
        id: 42,
        commit_id: 'abc123',
        body: 'Looks good!',
        html_url: 'https://github.com/owner/repo/commit/abc123#comment-42',
        user: {
          login: 'reviewer',
          avatar_url: 'https://avatars.githubusercontent.com/reviewer',
          html_url: 'https://github.com/reviewer',
        },
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T11:00:00Z',
      },
    ];

    const result = mapComments(raw);

    expect(result).toEqual([
      {
        id: 42,
        commitSha: 'abc123',
        body: 'Looks good!',
        htmlUrl: 'https://github.com/owner/repo/commit/abc123#comment-42',
        user: {
          login: 'reviewer',
          avatarUrl: 'https://avatars.githubusercontent.com/reviewer',
          profileUrl: 'https://github.com/reviewer',
        },
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T11:00:00Z',
      },
    ]);
  });

  it('should return empty array for empty input', () => {
    expect(mapComments([])).toEqual([]);
  });
});
