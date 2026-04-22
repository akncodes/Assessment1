export type UserRole = "author" | "viewer" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  featured_image: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author_name?: string;
}

export interface PaginatedPosts {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
}
