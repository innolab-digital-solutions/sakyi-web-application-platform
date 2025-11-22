import { ApiResponse } from "@/types/shared/api";

export interface BlogCategory{
    id?: number;
    name: string;
    slug: string;
}

export interface BlogPost{
    id: number;
    thumbnail: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    status: "published";
    published_at: string;
    reading_time: string;
    category: BlogCategory;
}

export type BlogPostsApiResponse = ApiResponse<BlogPost[]> | undefined;

export type BlogCategoriesApiResponse = ApiResponse<BlogCategory[]> | undefined;