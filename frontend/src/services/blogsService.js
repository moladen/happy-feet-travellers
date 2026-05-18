import { mockBlogs } from '@/data/mockData';
import { publicFetch, shouldUseMockFallback } from '@/lib/publicApi';

const pickList = (data) => data?.blogs ?? (Array.isArray(data) ? data : []);

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
    const data = await publicFetch('/blogs');
    return normaliseList(pickList(data));
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getBlogs]', err?.message || err);
    }
    return shouldUseMockFallback() ? mockBlogs.map(normaliseBlog) : [];
  }
};

export const getBlogById = async (idOrSlug) => {
  try {
    const id = encodeURIComponent(String(idOrSlug));
    const data = await publicFetch(`/blogs/${id}`);
    return normaliseBlog(data);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getBlogById]', err?.message || err);
    }
    if (!shouldUseMockFallback()) return null;
    const match = mockBlogs.find(
      (blog) => String(blog.id) === String(idOrSlug) || blog.slug === idOrSlug
    );
    return match ? normaliseBlog(match) : null;
  }
};
