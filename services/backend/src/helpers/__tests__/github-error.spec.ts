import { HttpException, HttpStatus } from '@nestjs/common';
import { handleGitHubError } from '../github-error';
import axios from 'axios';

function createAxiosError(status: number, message?: string) {
  const error = new axios.AxiosError(
    'Request failed',
    'ERR_BAD_REQUEST',
    undefined,
    undefined,
    {
      status,
      data: { message: message ?? 'error' },
      statusText: '',
      headers: {},
      config: {} as any,
    },
  );
  return error;
}

describe('handleGitHubError', () => {
  it('should throw NOT_FOUND for 404', () => {
    expect(() => handleGitHubError(createAxiosError(404))).toThrow(
      new HttpException('Repository not found', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw TOO_MANY_REQUESTS for 403', () => {
    expect(() => handleGitHubError(createAxiosError(403))).toThrow(
      new HttpException(
        'GitHub API rate limit exceeded. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      ),
    );
  });

  it('should forward other Axios error status and message', () => {
    try {
      handleGitHubError(createAxiosError(422, 'Validation failed'));
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect((e as HttpException).getStatus()).toBe(422);
      expect((e as HttpException).getResponse()).toBe('Validation failed');
    }
  });

  it('should throw INTERNAL_SERVER_ERROR for non-Axios errors', () => {
    expect(() => handleGitHubError(new Error('random'))).toThrow(
      new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
});
