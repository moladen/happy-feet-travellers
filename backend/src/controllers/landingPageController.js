const {
  listLandingPages,
  getLandingPage,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
  listLandingEnquiries,
} = require('@/services/landingPageService');

async function getLandingPages(req, res, next) {
  try {
    const admin = Boolean(req.user);
    const query = { ...req.query };
    if (!admin) query.published = 'true';
    const data = await listLandingPages(query);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getLandingPageById(req, res, next) {
  try {
    const admin = Boolean(req.user);
    const data = await getLandingPage(req.params.idOrSlug, { admin });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function postLandingPage(req, res, next) {
  try {
    const data = await createLandingPage(req.body);
    res.status(201).json({ success: true, message: 'Landing page created', data });
  } catch (err) {
    next(err);
  }
}

async function putLandingPage(req, res, next) {
  try {
    const data = await updateLandingPage(req.params.id, req.body);
    res.json({ success: true, message: 'Landing page updated', data });
  } catch (err) {
    next(err);
  }
}

async function removeLandingPage(req, res, next) {
  try {
    await deleteLandingPage(req.params.id);
    res.json({ success: true, message: 'Landing page deleted' });
  } catch (err) {
    next(err);
  }
}

async function getLandingPageEnquiries(req, res, next) {
  try {
    const data = await listLandingEnquiries(req.params.id, req.query);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLandingPages,
  getLandingPageById,
  postLandingPage,
  putLandingPage,
  removeLandingPage,
  getLandingPageEnquiries,
};
