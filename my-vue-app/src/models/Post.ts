export interface Post {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface PostCreateRequest {
  title: string;
  body: string;
}

export interface PostUpdateRequest {
  title?: string;
  body?: string;
}
