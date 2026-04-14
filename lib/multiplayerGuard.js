
import { validateNDSPAccess } from './complianceLayer';

export function canJoinMultiplayer(profile) {
  const check = validateNDSPAccess(profile);
  if (!check.allowed) return false;
  return profile.instanceScope === 'multi_player_instance';
}
