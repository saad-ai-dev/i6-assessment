import { MemoryCache } from '../cache';

describe('MemoryCache', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache(1000);
  });

  describe('get/set', () => {
    it('should return null for missing keys', () => {
      expect(cache.get('missing')).toBeNull();
    });

    it('should store and retrieve values', () => {
      cache.set('key', { data: 'value' });
      expect(cache.get('key')).toEqual({ data: 'value' });
    });

    it('should return null for expired entries', () => {
      cache = new MemoryCache(1000);
      cache.set('key', 'value');

      jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 2000);
      expect(cache.get('key')).toBeNull();
      jest.restoreAllMocks();
    });
  });

  describe('getOrFetch', () => {
    it('should return cached value without calling fetcher', async () => {
      const fetcher = jest.fn().mockResolvedValue('fresh');
      cache.set('key', 'cached');

      const result = await cache.getOrFetch('key', fetcher);

      expect(result).toBe('cached');
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('should call fetcher on cache miss and cache the result', async () => {
      const fetcher = jest.fn().mockResolvedValue('fetched');

      const result = await cache.getOrFetch('key', fetcher);

      expect(result).toBe('fetched');
      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(cache.get('key')).toBe('fetched');
    });

    it('should deduplicate concurrent requests for the same key', async () => {
      let resolvePromise: (value: string) => void;
      const fetcher = jest.fn().mockReturnValue(
        new Promise<string>((resolve) => {
          resolvePromise = resolve;
        }),
      );

      const promise1 = cache.getOrFetch('key', fetcher);
      const promise2 = cache.getOrFetch('key', fetcher);

      resolvePromise!('result');

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toBe('result');
      expect(result2).toBe('result');
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('should clear inflight on error and allow retry', async () => {
      const fetcher = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');

      await expect(cache.getOrFetch('key', fetcher)).rejects.toThrow('fail');

      const result = await cache.getOrFetch('key', fetcher);
      expect(result).toBe('success');
      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });
});
