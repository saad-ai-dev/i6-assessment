import { Test, TestingModule } from '@nestjs/testing';
import { ReposController } from '../repos.controller';
import { ReposService } from '../repos.service';

describe('ReposController', () => {
  let controller: ReposController;
  let service: jest.Mocked<ReposService>;

  const mockCommits = [
    {
      sha: 'abc123',
      title: 'Initial commit',
      author: {
        name: 'octocat',
        email: 'octo@example.com',
        date: '2024-01-01T00:00:00Z',
        login: 'octocat',
        avatarUrl: 'https://avatars.githubusercontent.com/octocat',
        profileUrl: 'https://github.com/octocat',
      },
      committer: {
        name: 'octocat',
        email: 'octo@example.com',
        date: '2024-01-01T00:00:00Z',
        login: 'octocat',
        avatarUrl: 'https://avatars.githubusercontent.com/octocat',
        profileUrl: 'https://github.com/octocat',
      },
      commentCount: 1,
    },
  ];

  const mockAuthors = [
    {
      login: 'octocat',
      name: 'octocat',
      email: 'octo@example.com',
      avatarUrl: 'https://avatars.githubusercontent.com/octocat',
      profileUrl: 'https://github.com/octocat',
      commitCount: 5,
    },
  ];

  const mockComments = [
    {
      id: 1,
      commitSha: 'abc123',
      body: 'Nice commit',
      htmlUrl: 'https://github.com/owner/repo/commit/abc123#comment-1',
      user: {
        login: 'reviewer',
        avatarUrl: 'https://avatars.githubusercontent.com/reviewer',
        profileUrl: 'https://github.com/reviewer',
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReposController],
      providers: [
        {
          provide: ReposService,
          useValue: {
            getCommits: jest.fn(),
            getAuthors: jest.fn(),
            getComments: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReposController>(ReposController);
    service = module.get(ReposService);
  });

  describe('getCommits', () => {
    it('should call service.getCommits with owner and repo', async () => {
      service.getCommits.mockResolvedValue(mockCommits);

      const result = await controller.getCommits('octocat', 'Spoon-Knife');

      expect(service.getCommits).toHaveBeenCalledWith('octocat', 'Spoon-Knife');
      expect(result).toEqual(mockCommits);
    });
  });

  describe('getAuthors', () => {
    it('should call service.getAuthors with owner and repo', async () => {
      service.getAuthors.mockResolvedValue(mockAuthors);

      const result = await controller.getAuthors('octocat', 'Spoon-Knife');

      expect(service.getAuthors).toHaveBeenCalledWith('octocat', 'Spoon-Knife');
      expect(result).toEqual(mockAuthors);
    });
  });

  describe('getComments', () => {
    it('should call service.getComments with owner and repo', async () => {
      service.getComments.mockResolvedValue(mockComments);

      const result = await controller.getComments('octocat', 'Spoon-Knife');

      expect(service.getComments).toHaveBeenCalledWith('octocat', 'Spoon-Knife');
      expect(result).toEqual(mockComments);
    });
  });
});
