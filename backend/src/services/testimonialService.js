const prisma = require('@/config/database');

async function listTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
}

async function createTestimonial(payload) {
  return prisma.testimonial.create({
    data: {
      name: payload.name,
      city: payload.city || null,
      image: payload.image || null,
      review: payload.review,
      rating: payload.rating,
    },
  });
}

async function updateTestimonial(id, payload) {
  return prisma.testimonial.update({
    where: { id },
    data: {
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.city !== undefined ? { city: payload.city || null } : {}),
      ...(payload.image !== undefined ? { image: payload.image || null } : {}),
      ...(payload.review !== undefined ? { review: payload.review } : {}),
      ...(payload.rating !== undefined ? { rating: payload.rating } : {}),
    },
  });
}

async function deleteTestimonial(id) {
  return prisma.testimonial.delete({ where: { id } });
}

module.exports = {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
