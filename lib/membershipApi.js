async function authedJsonFetch(user, url, body) {
  if (!user) {
    throw new Error("You must be signed in to manage membership.");
  }

  const token = await user.getIdToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.message || "Membership request failed.");
  }

  return result;
}

export function subscribeToMembership(user, payload) {
  return authedJsonFetch(user, "/api/memberships/subscribe", payload);
}

export function manageMembership(user, payload) {
  return authedJsonFetch(user, "/api/memberships/manage", payload);
}
