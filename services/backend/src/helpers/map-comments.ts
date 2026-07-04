import { GitHubCommentResponse } from '../modules/repos/types';

export function mapComments(comments: GitHubCommentResponse[]) {
  return comments.map((c) => ({
    id: c.id,
    commitSha: c.commit_id,
    body: c.body,
    htmlUrl: c.html_url,
    user: {
      login: c.user.login,
      avatarUrl: c.user.avatar_url,
      profileUrl: c.user.html_url,
    },
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  }));
}
