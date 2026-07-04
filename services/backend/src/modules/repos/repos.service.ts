import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { GitHubCommitResponse, GitHubCommentResponse } from './types';
import { MemoryCache } from '../../helpers/cache';
import { paginate } from '../../helpers/paginate';
import { handleGitHubError } from '../../helpers/github-error';
import { mapComments } from '../../helpers/map-comments';

@Injectable()
export class ReposService {
  private readonly client: AxiosInstance;
  private readonly cache = new MemoryCache();

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('GITHUB_TOKEN');
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  async getCommits(owner: string, repo: string) {
    const raw = await this.fetchCommitsRaw(owner, repo);

    return raw.map((commit) => ({
      sha: commit.sha,
      title: commit.commit.message.split('\n')[0],
      author: {
        name: commit.commit.author.name,
        email: commit.commit.author.email,
        date: commit.commit.author.date,
        login: commit.author?.login ?? null,
        avatarUrl: commit.author?.avatar_url ?? null,
        profileUrl: commit.author?.html_url ?? null,
      },
      committer: {
        name: commit.commit.committer.name,
        email: commit.commit.committer.email,
        date: commit.commit.committer.date,
        login: commit.committer?.login ?? null,
        avatarUrl: commit.committer?.avatar_url ?? null,
        profileUrl: commit.committer?.html_url ?? null,
      },
      commentCount: commit.commit.comment_count,
    }));
  }

  async getAuthors(owner: string, repo: string) {
    const raw = await this.fetchCommitsRaw(owner, repo);

    const authorMap = new Map<
      string,
      {
        login: string;
        name: string;
        email: string;
        avatarUrl: string | null;
        profileUrl: string | null;
        commitCount: number;
      }
    >();

    for (const commit of raw) {
      const login = commit.author?.login ?? null;
      const key = login ?? commit.commit.author.email;
      const existing = authorMap.get(key);

      if (existing) {
        existing.commitCount++;
      } else {
        authorMap.set(key, {
          login: login ?? commit.commit.author.name,
          name: commit.commit.author.name,
          email: commit.commit.author.email,
          avatarUrl: commit.author?.avatar_url ?? null,
          profileUrl: commit.author?.html_url ?? null,
          commitCount: 1,
        });
      }
    }

    return Array.from(authorMap.values()).sort(
      (a, b) => b.commitCount - a.commitCount,
    );
  }

  async getComments(owner: string, repo: string) {
    try {
      const raw = await this.cache.getOrFetch(
        `comments:${owner}/${repo}`,
        () => paginate<GitHubCommentResponse>(this.client, `/repos/${owner}/${repo}/comments`),
      );
      return mapComments(raw);
    } catch (error) {
      handleGitHubError(error);
    }
  }

  private async fetchCommitsRaw(owner: string, repo: string): Promise<GitHubCommitResponse[]> {
    try {
      return await this.cache.getOrFetch(
        `commits:${owner}/${repo}`,
        () => paginate<GitHubCommitResponse>(this.client, `/repos/${owner}/${repo}/commits`),
      );
    } catch (error) {
      handleGitHubError(error);
    }
  }
}
