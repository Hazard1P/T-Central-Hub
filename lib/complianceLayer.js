
export function validateNDSPAccess(profile) {
  if (!profile?.steamId) return { allowed: false, reason: 'No Steam ID' };
  if (!profile?.namespace) return { allowed: false, reason: 'No namespace' };
  return { allowed: true };
}

export function enforceInstanceIsolation(current, target) {
  if (!current || !target) return false;
  return current.namespace === target.namespace;
}
