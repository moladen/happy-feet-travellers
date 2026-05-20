const express = require('express');
const {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
} = require('@/controllers/teamMemberController');
const { authMiddleware } = require('@/middlewares/authMiddleware');
const { teamImageUpload } = require('@/middlewares/teamUploadMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

router.get('/', getTeamMembers);
router.patch('/reorder', authMiddleware, validate('reorderTeamMembers'), reorderTeamMembers);
router.post('/', authMiddleware, teamImageUpload('image'), validate('createTeamMember'), createTeamMember);
router.put('/:id', authMiddleware, teamImageUpload('image'), validate('updateTeamMember'), updateTeamMember);
router.delete('/:id', authMiddleware, deleteTeamMember);

module.exports = router;
