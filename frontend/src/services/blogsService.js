import { mockBlogs } from '@/data/mockData';
import { publicFetch } from '@/lib/publicApi';
import { isNotFoundError, withPublicDataFetch } from '@/lib/publicApiError';

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
  return withPublicDataFetch({
    context: 'blog',
    mock: () => mockBlogs.map(normaliseBlog),
    run: async () => {
      const data = await publicFetch('/blogs');
      return normaliseList(pickList(data));
    },
  });
};

export const getBlogById = async (idOrSlug) => {
  try {
    const id = encodeURIComponent(String(idOrSlug));
    const data = await publicFetch(`/blogs/${id}`);
    return normaliseBlog(data);
  } catch (err) {
    if (isNotFoundError(err)) return null;
    return withPublicDataFetch({
      context: 'blog',
      mock: () => {
        const match = mockBlogs.find(
          (blog) => String(blog.id) === String(idOrSlug) || blog.slug === idOrSlug
        );
        return match ? normaliseBlog(match) : null;
      },
      run: async () => {
        throw err;
      },
    });
  }
};
