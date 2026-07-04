import { Commit, Author, Comment } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api/v1/repos';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export const fetchCommits = (owner: string, repo: string) =>
  fetchJson<Commit[]>(`${API_BASE}/${owner}/${repo}/commits`);

export const fetchAuthors = (owner: string, repo: string) =>
  fetchJson<Author[]>(`${API_BASE}/${owner}/${repo}/authors`);

export const fetchComments = (owner: string, repo: string) =>
  fetchJson<Comment[]>(`${API_BASE}/${owner}/${repo}/comments`);
