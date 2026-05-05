/**
 * @param {import("firebase/auth").User | null} user
 * @returns {Promise<Record<string, string>>}
 */
export async function getAdminRequestHeaders(user) {
  if (!user) {
    return {};
  }

  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}
