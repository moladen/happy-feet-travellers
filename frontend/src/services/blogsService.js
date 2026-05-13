import apiClient, { unwrap } from '@/lib/apiClient';
import { mockBlogs } from '@/data/mockData';

const pickList = (data) => data?.blogs ?? data ?? [];

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const normaliseBlog = (blog) => {
  if (!blog || typeof blog !== 'object') return blog;
  return {
    ...blog,
    image: blog.image || blog.coverImage || null,
    author: blog.author || blog.authorName || null,
    authorPhoto: blog.authorPhoto || blog.authorImage || null,
    date: blog.date || formatDate(blog.publishedAt) || formatDate(blog.createdAt),
  };
};

const normaliseList = (list) => (Array.isArray(list) ? list.map(normaliseBlog) : []);

export const getBlogs = async () => {
  try {
    const res = await apiClient.get('/blogs');
    return normaliseList(pickList(unwrap(res)));
  } catch {
    return mockBlogs.map(normaliseBlog);
  }
};

export const getBlogById = async (idOrSlug) => {
  try {
    const res = await apiClient.get(`/blogs/${idOrSlug}`);
    return normaliseBlog(unwrap(res));
  } catch {
    const match = mockBlogs.find(
      (blog) => String(blog.id) === String(idOrSlug) || blog.slug === idOrSlug
    );
    return match ? normaliseBlog(match) : null;
  }
};
