import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ReposService } from '../repos.service';
import { GitHubCommitResponse, GitHubCommentResponse } from '../types';
import * as paginateModule from '../../../helpers/paginate';

jest.mock('../../../helpers/paginate');

const mockPaginate = paginateModule.paginate as jest.MockedFunction<typeof paginateModule.paginate>;

const mockCommit = (
  sha: string,
  login: string,
  message: string,
  commentCount = 0,
): GitHubCommitResponse => ({
  sha,
  commit: {
    author: { name: login, email: `${login}@example.com`, date: '2024-01-01T00:00:00Z' },
    committer: { name: login, email: `${login}@example.com`, date: '2024-01-01T00:00:00Z' },
    message,
    comment_count: commentCount,
  },
  author: {
    login,
    avatar_url: `https://avatars.githubusercontent.com/${login}`,
    html_url: `https://github.com/${login}`,
    id: 1,
  },
  committer: {
    login,
    avatar_url: `https://avatars.githubusercontent.com/${login}`,
    html_url: `https://github.com/${login}`,
    id: 1,
  },
});

const mockComment = (
  id: number,
  commitId: string,
  login: string,
  body: string,
): GitHubCommentResponse => ({
  id,
  commit_id: commitId,
  body,
  html_url: `https://github.com/owner/repo/commit/${commitId}#comment-${id}`,
  user: {
    login,
    avatar_url: `https://avatars.githubusercontent.com/${login}`,
    html_url: `https://github.com/${login}`,
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
});

describe('ReposService', () => {
  let service: ReposService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReposService,
        { provide: ConfigService, useValue: { get: () => undefined } },
      ],
    }).compile();

    service = module.get<ReposService>(ReposService);
  });

  describe('getCommits', () => {
    it('should return mapped commits with author details and title', async () => {
      mockPaginate.mockResolvedValue([
        mockCommit('abc123', 'octocat', 'Initial commit\n\nDetailed description', 2),
        mockCommit('def456', 'johndoe', 'Fix bug'),
      ]);

      const result = await service.getCommits('owner', 'repo');

      expect(result).toHaveLength(2);
      expect(result![0]).toEqual({
        sha: 'abc123',
        title: 'Initial commit',
        author: {
          name: 'octocat',
          email: 'octocat@example.com',
          date: '2024-01-01T00:00:00Z',
          login: 'octocat',
          avatarUrl: 'https://avatars.githubusercontent.com/octocat',
          profileUrl: 'https://github.com/octocat',
        },
        committer: {
          name: 'octocat',
          email: 'octocat@example.com',
          date: '2024-01-01T00:00:00Z',
          login: 'octocat',
          avatarUrl: 'https://avatars.githubusercontent.com/octocat',
          profileUrl: 'https://github.com/octocat',
        },
        commentCount: 2,
      });
      expect(result![1].title).toBe('Fix bug');
      expect(result![1].commentCount).toBe(0);
    });

    it('should handle commits with null author (no GitHub account)', async () => {
      const commit = mockCommit('abc123', 'local-user', 'Commit message');
      commit.author = null;
      commit.committer = null;
      mockPaginate.mockResolvedValue([commit]);

      const result = await service.getCommits('owner', 'repo');

      expect(result![0].author.login).toBeNull();
      expect(result![0].author.avatarUrl).toBeNull();
      expect(result![0].author.name).toBe('local-user');
    });
  });

  describe('getAuthors', () => {
    it('should return unique authors with commit counts sorted descending', async () => {
      mockPaginate.mockResolvedValue([
        mockCommit('a1', 'alice', 'Commit 1'),
        mockCommit('a2', 'alice', 'Commit 2'),
        mockCommit('a3', 'alice', 'Commit 3'),
        mockCommit('b1', 'bob', 'Commit 4'),
      ]);

      const result = await service.getAuthors('owner', 'repo');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        login: 'alice',
        name: 'alice',
        email: 'alice@example.com',
        avatarUrl: 'https://avatars.githubusercontent.com/alice',
        profileUrl: 'https://github.com/alice',
        commitCount: 3,
      });
      expect(result[1].login).toBe('bob');
      expect(result[1].commitCount).toBe(1);
    });

    it('should deduplicate by email when author has no GitHub login', async () => {
      const commit1 = mockCommit('a1', 'local', 'Commit 1');
      commit1.author = null;
      const commit2 = mockCommit('a2', 'local', 'Commit 2');
      commit2.author = null;
      mockPaginate.mockResolvedValue([commit1, commit2]);

      const result = await service.getAuthors('owner', 'repo');

      expect(result).toHaveLength(1);
      expect(result[0].commitCount).toBe(2);
    });

    it('should return empty array for repos with no commits', async () => {
      mockPaginate.mockResolvedValue([]);

      const result = await service.getAuthors('owner', 'repo');

      expect(result).toEqual([]);
    });
  });

  describe('getComments', () => {
    it('should return mapped comments with user details', async () => {
      mockPaginate.mockResolvedValue([
        mockComment(1, 'abc123', 'reviewer', 'Great work!'),
        mockComment(2, 'def456', 'maintainer', 'Needs changes'),
      ]);

      const result = await service.getComments('owner', 'repo');

      expect(result).toHaveLength(2);
      expect(result![0]).toEqual({
        id: 1,
        commitSha: 'abc123',
        body: 'Great work!',
        htmlUrl: 'https://github.com/owner/repo/commit/abc123#comment-1',
        user: {
          login: 'reviewer',
          avatarUrl: 'https://avatars.githubusercontent.com/reviewer',
          profileUrl: 'https://github.com/reviewer',
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });
    });

    it('should return empty array for repos with no comments', async () => {
      mockPaginate.mockResolvedValue([]);

      const result = await service.getComments('owner', 'repo');

      expect(result).toEqual([]);
    });
  });
});
