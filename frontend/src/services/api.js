import apiClient from '@/lib/apiClient';

export { getTours, getTourById } from './toursService';
export { getBlogs, getBlogById } from './blogsService';
export { submitContactForm } from './contactService';
export { subscribeToNewsletter } from './subscriberService';

export default apiClient;
