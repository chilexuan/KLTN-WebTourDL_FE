export interface Article {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  published_at: string;
  status: string; // 'draft' hoặc 'published'
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    username: string;
  };
  categoryId: number;
  comment_count: number;
  
}

export interface CreateArticleDto {
  title: string;
  content: string;
  image_url?: string;
  status?: string;
  categoryId: number;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  image_url?: string;
  status?: string;
  categoryId?: number;
}