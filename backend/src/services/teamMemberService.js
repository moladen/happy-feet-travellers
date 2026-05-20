const prisma = require('@/config/database');
const AppError = require('@/utils/AppError');
const { saveTeamUpload, deleteTeamFileIfStored } = require('@/utils/teamMedia');

function normalizeUrl(value) {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  return trimmed || null;
}

function toPublicMember(member) {
  return {
    id: member.id,
    fullName: member.fullName,
    role: member.role,
    bio: member.bio,
    instagramUrl: member.instagramUrl,
    linkedinUrl: member.linkedinUrl,
    imageUrl: member.imageUrl,
    sortOrder: member.sortOrder,
    active: member.active,
  };
}

function parseSortOrder(value, fallback = 0) {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseActive(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

async function listTeamMembers({ activeOnly = true } = {}) {
  const members = await prisma.teamMember.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  return members.map(toPublicMember);
}

async function getNextSortOrder() {
  const last = await prisma.teamMember.findFirst({
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });
  return (last?.sortOrder ?? -1) + 1;
}

async function createTeamMember({
  file,
  fullName,
  role,
  bio,
  instagramUrl,
  linkedinUrl,
  sortOrder,
  active,
}) {
  if (!file) throw new AppError('Profile image is required', 400);
  const name = String(fullName || '').trim();
  const memberRole = String(role || '').trim();
  const memberBio = String(bio || '').trim();
  if (name.length < 2) throw new AppError('Full name is required (min 2 characters)', 400);
  if (memberRole.length < 2) throw new AppError('Role is required (min 2 characters)', 400);
  if (memberBio.length < 10) throw new AppError('Bio is required (min 10 characters)', 400);

  const imageUrl = saveTeamUpload(file);
  const member = await prisma.teamMember.create({
    data: {
      fullName: name,
      role: memberRole,
      bio: memberBio,
      instagramUrl: normalizeUrl(instagramUrl),
      linkedinUrl: normalizeUrl(linkedinUrl),
      imageUrl,
      sortOrder: parseSortOrder(sortOrder, await getNextSortOrder()),
      active: parseActive(active, true),
    },
  });
  return toPublicMember(member);
}

async function updateTeamMember(
  id,
  { file, fullName, role, bio, instagramUrl, linkedinUrl, sortOrder, active }
) {
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) throw new AppError('Team member not found', 404);

  let imageUrl = existing.imageUrl;
  if (file) {
    const nextUrl = saveTeamUpload(file);
    deleteTeamFileIfStored(existing.imageUrl);
    imageUrl = nextUrl;
  }

  const data = { imageUrl };
  if (fullName !== undefined) {
    const name = String(fullName).trim();
    if (name.length < 2) throw new AppError('Full name must be at least 2 characters', 400);
    data.fullName = name;
  }
  if (role !== undefined) {
    const memberRole = String(role).trim();
    if (memberRole.length < 2) throw new AppError('Role must be at least 2 characters', 400);
    data.role = memberRole;
  }
  if (bio !== undefined) {
    const memberBio = String(bio).trim();
    if (memberBio.length < 10) throw new AppError('Bio must be at least 10 characters', 400);
    data.bio = memberBio;
  }
  if (instagramUrl !== undefined) data.instagramUrl = normalizeUrl(instagramUrl);
  if (linkedinUrl !== undefined) data.linkedinUrl = normalizeUrl(linkedinUrl);
  if (sortOrder !== undefined) data.sortOrder = parseSortOrder(sortOrder, existing.sortOrder);
  if (active !== undefined) data.active = parseActive(active, existing.active);

  const member = await prisma.teamMember.update({ where: { id }, data });
  return toPublicMember(member);
}

async function deleteTeamMember(id) {
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) throw new AppError('Team member not found', 404);
  await prisma.teamMember.delete({ where: { id } });
  deleteTeamFileIfStored(existing.imageUrl);
}

async function reorderTeamMembers(orderedIds) {
  if (!Array.isArray(orderedIds) || !orderedIds.length) {
    throw new AppError('order must be a non-empty array of member ids', 400);
  }
  await prisma.$transaction(
    orderedIds.map((memberId, index) =>
      prisma.teamMember.update({
        where: { id: memberId },
        data: { sortOrder: index },
      })
    )
  );
  return listTeamMembers({ activeOnly: false });
}

module.exports = {
  listTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
};
