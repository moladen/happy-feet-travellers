import apiClient from '@/lib/apiClient';

export { getTours, getTourById } from './toursService';
export { getUpcomingDepartures, getUpcomingDepartureBySlug } from './upcomingDeparturesService';
export {
  getPersonalizedTrips,
  getPersonalizedTripsWithMeta,
  getPersonalizedTripBySlug,
  getPersonalizedCategories,
} from './personalizedTripsService';
export { getBlogs, getBlogById } from './blogsService';
export { submitContactForm } from './contactService';
export { subscribeToNewsletter } from './subscriberService';

export default apiClient;
