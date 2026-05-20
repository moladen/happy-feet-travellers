import { publicFetch } from '@/lib/publicApi';
import { FALLBACK_TEAM_MEMBERS, mapMembersForDisplay } from '@/lib/teamMembers';

export async function fetchPublicTeamMembers() {
  try {
    const data = await publicFetch('/team-members');
    const members = mapMembersForDisplay(data?.members || []);
    return members.length ? members : mapMembersForDisplay(FALLBACK_TEAM_MEMBERS);
  } catch {
    return mapMembersForDisplay(FALLBACK_TEAM_MEMBERS);
  }
}
