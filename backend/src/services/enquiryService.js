const prisma = require('@/config/database');

const AppError = require('@/utils/AppError');

const { withDatabaseErrors } = require('@/utils/databaseErrors');

const logger = require('@/utils/logger');



const SPAM_MARKERS = [/https?:\/\//gi, /www\./gi];



function looksLikeSpam(payload) {

  if (payload.website?.trim() || payload._honeypot?.trim()) return true;

  const message = String(payload.message || '');

  const linkHits = (message.match(SPAM_MARKERS[0]) || []).length;

  if (linkHits > 3) return true;

  if (message.length > 2000) return true;

  return false;

}



async function createEnquiry(payload) {

  if (looksLikeSpam(payload)) {

    logger.warn('[enquiry] Spam submission filtered (honeypot or heuristics).');

    return {

      id: 'filtered',

      name: payload.name,

      phone: payload.phone || '',

      email: payload.email,

      message: payload.message,

      subject: payload.subject || null,

      source: payload.source || null,

      status: 'new',

      createdAt: new Date(),

    };

  }



  return withDatabaseErrors(async () =>

    prisma.enquiry.create({

      data: {

        name: payload.name,

        phone: payload.phone,

        email: payload.email,

        message: payload.message,

        subject: payload.subject || null,

        source: payload.source || null,

        landingPageId: payload.landingPageId || null,

      },

    })

  );

}



async function listEnquiries(query) {

  return withDatabaseErrors(async () => {

    const page = parseInt(query.page, 10) || 1;

    const limit = Math.min(parseInt(query.limit, 10) || 20, 100);

    const skip = (page - 1) * limit;



    const where = {};

    if (query.status) where.status = query.status;

    if (query.source) where.source = query.source;

    if (query.landingPageId) where.landingPageId = query.landingPageId;

    if (query.search) {

      where.OR = [

        { name: { contains: query.search, mode: 'insensitive' } },

        { email: { contains: query.search, mode: 'insensitive' } },

        { phone: { contains: query.search, mode: 'insensitive' } },

        { subject: { contains: query.search, mode: 'insensitive' } },

        { message: { contains: query.search, mode: 'insensitive' } },

      ];

    }



    const [enquiries, total] = await Promise.all([

      prisma.enquiry.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),

      prisma.enquiry.count({ where }),

    ]);



    return {

      enquiries,

      pagination: { total, page, limit, pages: Math.ceil(total / limit) },

    };

  });

}



async function updateEnquiryStatus(id, status) {

  const allowed = ['new', 'contacted', 'closed'];

  if (!allowed.includes(status)) {

    throw AppError.badRequest(`status must be one of ${allowed.join(', ')}`);

  }

  return withDatabaseErrors(() =>

    prisma.enquiry.update({ where: { id }, data: { status } })

  );

}



async function deleteEnquiry(id) {

  return withDatabaseErrors(() => prisma.enquiry.delete({ where: { id } }));

}



module.exports = {

  createEnquiry,

  listEnquiries,

  updateEnquiryStatus,

  deleteEnquiry,

};


