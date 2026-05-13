import apiClient, { extractApiError, unwrap } from "@/lib/apiClient";

export const setAdminToken = (token) => {
  if (typeof window !== "undefined") {
    if (token) window.localStorage.setItem("hft_admin_token", token);
    else window.localStorage.removeItem("hft_admin_token");
  }

  if (token) apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete apiClient.defaults.headers.common.Authorization;
};

export const getStoredAdminToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("hft_admin_token");
};

const run = async (request, fallback) => {
  try {
    const res = await request();
    return { success: true, data: unwrap(res), message: res?.data?.message };
  } catch (error) {
    const { message, details } = extractApiError(error, fallback);
    return { success: false, message, details };
  }
};

export const adminLogin = async (credentials) => {
  const result = await run(
    () => apiClient.post("/auth/login", credentials),
    "Login failed. Check admin email and password."
  );

  if (result.success && result.data?.token) setAdminToken(result.data.token);
  return result;
};

export const getAdminProfile = () =>
  run(() => apiClient.get("/auth/profile"), "Session expired. Please login again.");

export const getDashboardSnapshot = async () => {
  const [tours, blogs, enquiries, testimonials, gallery, settings] = await Promise.all([
    run(() => apiClient.get("/tours", { params: { limit: 8 } }), "Could not load tours."),
    run(() => apiClient.get("/blogs", { params: { limit: 6 } }), "Could not load blogs."),
    run(() => apiClient.get("/enquiry", { params: { limit: 8 } }), "Could not load enquiries."),
    run(() => apiClient.get("/testimonials"), "Could not load testimonials."),
    run(() => apiClient.get("/gallery"), "Could not load gallery."),
    run(() => apiClient.get("/settings"), "Could not load settings."),
  ]);
  return { tours, blogs, enquiries, testimonials, gallery, settings };
};

export const listTours = (params = {}) =>
  run(() => apiClient.get("/tours", { params }), "Could not load tours.");

export const getTour = (id) =>
  run(() => apiClient.get(`/tours/${id}`), "Could not load this tour.");

export const createTour = (payload) =>
  run(() => apiClient.post("/tours", payload), "Could not create tour.");

export const updateTour = (id, payload) =>
  run(() => apiClient.put(`/tours/${id}`, payload), "Could not update tour.");

export const deleteTour = (id) =>
  run(() => apiClient.delete(`/tours/${id}`), "Could not delete tour.");

export const listBlogs = (params = {}) =>
  run(() => apiClient.get("/blogs", { params }), "Could not load blogs.");

export const getBlog = (id) =>
  run(() => apiClient.get(`/blogs/${id}`), "Could not load this blog.");

export const createBlog = (payload) =>
  run(() => apiClient.post("/blogs", payload), "Could not create blog.");

export const updateBlog = (id, payload) =>
  run(() => apiClient.put(`/blogs/${id}`, payload), "Could not update blog.");

export const deleteBlog = (id) =>
  run(() => apiClient.delete(`/blogs/${id}`), "Could not delete blog.");

export const listTestimonials = () =>
  run(() => apiClient.get("/testimonials"), "Could not load testimonials.");

export const createTestimonial = (payload) =>
  run(() => apiClient.post("/testimonials", payload), "Could not create testimonial.");

export const updateTestimonial = (id, payload) =>
  run(() => apiClient.put(`/testimonials/${id}`, payload), "Could not update testimonial.");

export const deleteTestimonial = (id) =>
  run(() => apiClient.delete(`/testimonials/${id}`), "Could not delete testimonial.");

export const listGalleryItems = () =>
  run(() => apiClient.get("/gallery"), "Could not load gallery.");

export const createGalleryItem = (payload) =>
  run(() => apiClient.post("/gallery", payload), "Could not upload gallery image.");

export const updateGalleryItem = (id, payload) =>
  run(() => apiClient.put(`/gallery/${id}`, payload), "Could not update gallery image.");

export const deleteGalleryItem = (id) =>
  run(() => apiClient.delete(`/gallery/${id}`), "Could not delete gallery image.");

export const listEnquiries = (params = {}) =>
  run(() => apiClient.get("/enquiry", { params }), "Could not load enquiries.");

export const updateEnquiryStatus = (id, status) =>
  run(() => apiClient.patch(`/enquiry/${id}/status`, { status }), "Could not update enquiry.");

export const deleteEnquiry = (id) =>
  run(() => apiClient.delete(`/enquiry/${id}`), "Could not delete enquiry.");

export const getSettings = () =>
  run(() => apiClient.get("/settings"), "Could not load website settings.");

export const updateSettings = (payload) =>
  run(() => apiClient.put("/settings", payload), "Could not update website settings.");
