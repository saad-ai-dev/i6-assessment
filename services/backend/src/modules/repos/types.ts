export interface GitHubCommitResponse {
  sha: string;
  commit: {
    author: { name: string; email: string; date: string };
    committer: { name: string; email: string; date: string };
    message: string;
    comment_count: number;
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
    id: number;
  } | null;
  committer: {
    login: string;
    avatar_url: string;
    html_url: string;
    id: number;
  } | null;
}

export interface GitHubCommentResponse {
  id: number;
  commit_id: string;
  body: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  created_at: string;
  updated_at: string;
}
