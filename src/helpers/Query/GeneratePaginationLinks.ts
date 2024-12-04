import { PaginationState } from "./QueryResponse";

export function generatePaginationLinks(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
): PaginationState["links"] {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const links: Array<{
    label: string;
    active: boolean;
    url: string | null;
    page: number | null;
  }> = [];

  for (let page = 1; page <= totalPages; page++) {
    links.push({
      label: `${page}`,
      active: page === currentPage,
      url: `/users?page=${page}&items_per_page=${itemsPerPage}`,
      page,
    });
  }

  return links;
}
