const asyncHandler = require('@/utils/asyncHandler');
const { sendSuccess } = require('@/utils/responseFormatter');
const teamMemberService = require('@/services/teamMemberService');

const getTeamMembers = asyncHandler(async (req, res) => {
  const activeOnly = req.query.all !== '1';
  const members = await teamMemberService.listTeamMembers({ activeOnly });
  sendSuccess(res, { members });
});

const createTeamMember = asyncHandler(async (req, res) => {
  const member = await teamMemberService.createTeamMember({
    file: req.file,
    fullName: req.body.fullName,
    role: req.body.role,
    bio: req.body.bio,
    instagramUrl: req.body.instagramUrl,
    linkedinUrl: req.body.linkedinUrl,
    sortOrder: req.body.sortOrder,
    active: req.body.active,
  });
  sendSuccess(res, { member }, 'Team member added', 201);
});

const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await teamMemberService.updateTeamMember(req.params.id, {
    file: req.file,
    fullName: req.body.fullName,
    role: req.body.role,
    bio: req.body.bio,
    instagramUrl: req.body.instagramUrl,
    linkedinUrl: req.body.linkedinUrl,
    sortOrder: req.body.sortOrder,
    active: req.body.active,
  });
  sendSuccess(res, { member }, 'Team member updated');
});

const deleteTeamMember = asyncHandler(async (req, res) => {
  await teamMemberService.deleteTeamMember(req.params.id);
  sendSuccess(res, null, 'Team member removed');
});

const reorderTeamMembers = asyncHandler(async (req, res) => {
  const members = await teamMemberService.reorderTeamMembers(req.body.order);
  sendSuccess(res, { members }, 'Team order updated');
});

module.exports = {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
};
