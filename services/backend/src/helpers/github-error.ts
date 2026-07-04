import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

export function handleGitHubError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const message =
      error.response?.data?.message ?? 'GitHub API request failed';

    if (status === 404) {
      throw new HttpException('Repository not found', HttpStatus.NOT_FOUND);
    }
    if (status === 403) {
      throw new HttpException(
        'GitHub API rate limit exceeded. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    throw new HttpException(message, status);
  }
  throw new HttpException(
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
