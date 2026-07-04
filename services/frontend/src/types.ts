export interface CommitAuthorDetail {
  name: string;
  email: string;
  date: string;
  login: string | null;
  avatarUrl: string | null;
  profileUrl: string | null;
}

export interface Commit {
  sha: string;
  title: string;
  author: CommitAuthorDetail;
  committer: CommitAuthorDetail;
  commentCount: number;
}

export interface Author {
  login: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  profileUrl: string | null;
  commitCount: number;
}

export interface Comment {
  id: number;
  commitSha: string;
  body: string;
  htmlUrl: string;
  user: {
    login: string;
    avatarUrl: string;
    profileUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}
