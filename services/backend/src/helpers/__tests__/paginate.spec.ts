import { paginate } from '../paginate';
import { AxiosInstance } from 'axios';

function createMockClient(pages: { data: unknown[]; link?: string }[]): AxiosInstance {
  let callCount = 0;
  return {
    get: jest.fn().mockImplementation(() => {
      const page = pages[callCount++];
      return Promise.resolve({
        data: page.data,
        headers: { link: page.link },
      });
    }),
  } as unknown as AxiosInstance;
}

describe('paginate', () => {
  it('should return data from a single page', async () => {
    const client = createMockClient([{ data: [1, 2, 3] }]);

    const result = await paginate<number>(client, '/test');

    expect(result).toEqual([1, 2, 3]);
    expect(client.get).toHaveBeenCalledTimes(1);
    expect(client.get).toHaveBeenCalledWith('/test', { params: { per_page: 100, page: 1 } });
  });

  it('should follow pagination via Link header', async () => {
    const client = createMockClient([
      { data: [1, 2], link: '<url>; rel="next"' },
      { data: [3, 4] },
    ]);

    const result = await paginate<number>(client, '/test');

    expect(result).toEqual([1, 2, 3, 4]);
    expect(client.get).toHaveBeenCalledTimes(2);
  });

  it('should stop at maxPages', async () => {
    const client = createMockClient([
      { data: [1], link: '<url>; rel="next"' },
      { data: [2], link: '<url>; rel="next"' },
      { data: [3], link: '<url>; rel="next"' },
    ]);

    const result = await paginate<number>(client, '/test', 100, 2);

    expect(result).toEqual([1, 2]);
    expect(client.get).toHaveBeenCalledTimes(2);
  });

  it('should use custom perPage value', async () => {
    const client = createMockClient([{ data: [1] }]);

    await paginate<number>(client, '/test', 50);

    expect(client.get).toHaveBeenCalledWith('/test', { params: { per_page: 50, page: 1 } });
  });
});
