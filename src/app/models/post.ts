export interface Post {
    title: string;
    permalink: string;
    category: {categoryId: string,category: string}
    excerpt: string;
    postImgPath: string;
    content: string;
    isFeatured: boolean;
    views: number;
    status: string;
    createdAt: Date;
}
