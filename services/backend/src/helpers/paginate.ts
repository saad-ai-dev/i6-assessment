import { AxiosInstance } from 'axios';

export async function paginate<T>(
  client: AxiosInstance,
  endpoint: string,
  perPage = 100,
  maxPages = 5,
): Promise<T[]> {
  const allItems: T[] = [];
  let page = 1;

  while (page <= maxPages) {
    const response = await client.get<T[]>(endpoint, {
      params: { per_page: perPage, page },
    });

    allItems.push(...response.data);

    const linkHeader = response.headers['link'] as string | undefined;
    if (!linkHeader || !linkHeader.includes('rel="next"')) break;
    page++;
  }

  return allItems;
}
