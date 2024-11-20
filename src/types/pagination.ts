export interface IPaginationState {
  page: number;
  items_per_page: 10 | 30 | 50 | 100;
  links?: Array<{
    label: string;
    active: boolean;
    url: string | null;
    page: number | null;
  }>;
}
