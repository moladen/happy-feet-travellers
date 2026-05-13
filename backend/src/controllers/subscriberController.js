const asyncHandler = require('@/utils/asyncHandler');
const { sendSuccess } = require('@/utils/responseFormatter');
const subscriberService = require('@/services/subscriberService');

const subscribe = asyncHandler(async (req, res) => {
  const subscriber = await subscriberService.subscribe(req.body);
  return sendSuccess(res, subscriber, 'Subscribed successfully', 201);
});

const unsubscribe = asyncHandler(async (req, res) => {
  const subscriber = await subscriberService.unsubscribe(req.body.email);
  return sendSuccess(res, subscriber, 'Unsubscribed');
});

const listSubscribers = asyncHandler(async (req, res) => {
  const data = await subscriberService.listSubscribers(req.query);
  return sendSuccess(res, data);
});

module.exports = { subscribe, unsubscribe, listSubscribers };
