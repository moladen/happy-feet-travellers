import { getApiOrigin } from '@/lib/heroSlides';

export const TEAM_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';
export const TEAM_IMAGE_MAX_MB = 5;

export const FALLBACK_TEAM_MEMBERS = [
  {
    id: 'fallback-aniket',
    fullName: 'Aniket Patil',
    role: 'Founder · Trip planning',
    bio: 'Designs fixed departures and custom routes across India.',
    instagramUrl: null,
    linkedinUrl: null,
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'fallback-sneha',
    fullName: 'Sneha Kelkar',
    role: 'Operations · Stays & transfers',
    bio: 'Coordinates hotels, drivers and on-ground vendors.',
    instagramUrl: null,
    linkedinUrl: null,
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'fallback-vivek',
    fullName: 'Vivek Joshi',
    role: 'Trip captain · Northeast & Spiti',
    bio: 'Leads high-altitude batches with a calm, safety-first style.',
    instagramUrl: null,
    linkedinUrl: null,
    imageUrl:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80',
  },
];

export function resolveTeamImageUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  if (path.startsWith('/uploads')) return `${getApiOrigin()}${path}`;
  return path;
}

export function validateTeamImageFile(file) {
  if (!file) return 'Choose a profile photo to upload.';
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) return 'Only JPG, PNG, and WebP images are allowed.';
  if (file.size > TEAM_IMAGE_MAX_MB * 1024 * 1024) {
    return `Image must be ${TEAM_IMAGE_MAX_MB}MB or smaller.`;
  }
  return null;
}

export function mapMembersForDisplay(members) {
  if (!Array.isArray(members) || !members.length) return [];
  return members.map((member) => ({
    id: member.id,
    fullName: member.fullName,
    role: member.role,
    bio: member.bio,
    instagramUrl: member.instagramUrl || null,
    linkedinUrl: member.linkedinUrl || null,
    imageUrl: resolveTeamImageUrl(member.imageUrl),
  }));
}
