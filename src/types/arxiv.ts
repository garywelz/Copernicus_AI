export interface ArxivPaper {
  title: string;
  author: {
    name: string;
  }[] | { name: string };
  published: string;
  id: string;
  summary?: string;
  doi?: string;
  journal_ref?: string;
}

export interface ArxivResponse {
  feed: {
    entry: ArxivPaper[];
  };
}

export interface ArxivSearchParams {
  search_query: string;
  max_results?: string;
  sortBy?: 'relevance' | 'lastUpdatedDate' | 'submittedDate';
  sortOrder?: 'ascending' | 'descending';
}

export interface ArxivSearchResult {
  success: boolean;
  status?: number;
  paperCount?: number;
  papers?: ArxivPaper[];
  error?: string;
} 