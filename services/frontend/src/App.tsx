import { useState, useCallback, useMemo } from 'react';
import { Commit, Author, Comment } from './types';
import { fetchCommits, fetchAuthors, fetchComments } from './api';
import SearchBar from './components/SearchBar';
import AuthorFilter from './components/AuthorFilter';
import CommitsTable from './components/CommitsTable';
import AuthorsSection from './components/AuthorsSection';
import CommentsSection from './components/CommentsSection';
import Loader from './components/Loader';

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  margin: '32px 0 12px',
  paddingBottom: 8,
  borderBottom: '2px solid #d0d7de',
};

export default function App() {
  const [repoInput, setRepoInput] = useState('');
  const [commits, setCommits] = useState<Commit[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentRepo, setCurrentRepo] = useState('');

  const handleSearch = useCallback(async () => {
    const trimmed = repoInput.trim();
    const parts = trimmed.split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      setError('Please enter a valid repository in the format "owner/repo"');
      return;
    }

    const [owner, repo] = parts;
    setLoading(true);
    setError('');
    setSelectedAuthor('');

    try {
      const [commitsData, authorsData, commentsData] = await Promise.all([
        fetchCommits(owner, repo),
        fetchAuthors(owner, repo),
        fetchComments(owner, repo),
      ]);
      setCommits(commitsData);
      setAuthors(authorsData);
      setComments(commentsData);
      setCurrentRepo(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCommits([]);
      setAuthors([]);
      setComments([]);
      setCurrentRepo('');
    } finally {
      setLoading(false);
    }
  }, [repoInput]);

  const filteredCommits = useMemo(
    () =>
      selectedAuthor
        ? commits.filter((c) => (c.author.login ?? c.author.name) === selectedAuthor)
        : commits,
    [commits, selectedAuthor],
  );

  const commentsByCommit = useMemo(() => {
    const map = new Map<string, Comment[]>();
    for (const c of comments) {
      const list = map.get(c.commitSha);
      if (list) list.push(c);
      else map.set(c.commitSha, [c]);
    }
    return map;
  }, [comments]);

  const handleAuthorSelect = useCallback((author: string) => {
    setSelectedAuthor(author);
  }, []);

  const hasResults = currentRepo && !loading;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>GitHub Repo Explorer</h1>
      <p style={{ color: '#666', marginTop: 0, marginBottom: 24 }}>
        Search any public GitHub repository to view commits, authors, and comments.
      </p>

      <SearchBar
        value={repoInput}
        onChange={setRepoInput}
        onSearch={handleSearch}
        loading={loading}
      />

      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: 6,
            color: '#c00',
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {loading && <Loader />}

      {hasResults && (
        <>
          {/* Section 1: Commits */}
          <h2 style={sectionHeadingStyle}>
            Commits
            <span style={{ fontWeight: 400, fontSize: 14, color: '#57606a', marginLeft: 8 }}>
              ({filteredCommits.length})
            </span>
          </h2>
          <AuthorFilter
            authors={authors}
            totalCommits={commits.length}
            selectedAuthor={selectedAuthor}
            filteredCount={filteredCommits.length}
            onSelect={handleAuthorSelect}
          />
          <CommitsTable
            commits={filteredCommits}
            commentsByCommit={commentsByCommit}
          />

          {/* Section 2: Authors */}
          <h2 style={sectionHeadingStyle}>
            Authors
            <span style={{ fontWeight: 400, fontSize: 14, color: '#57606a', marginLeft: 8 }}>
              ({authors.length})
            </span>
          </h2>
          <AuthorsSection authors={authors} />

          {/* Section 3: Comments */}
          <h2 style={sectionHeadingStyle}>
            Comments
            <span style={{ fontWeight: 400, fontSize: 14, color: '#57606a', marginLeft: 8 }}>
              ({comments.length})
            </span>
          </h2>
          <CommentsSection comments={comments} />
        </>
      )}
    </div>
  );
}
