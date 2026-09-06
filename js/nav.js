// Shared across every page. Requires supabaseClient.js to be loaded first.

// Returns { id, email, full_name, role } or null if nobody is logged in.
async function getCurrentUser() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return null;

  const { data: profile, error } = await sb
    .from("profiles")
    .select("full_name, role")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    full_name: profile.full_name,
    role: profile.role,
  };
}

// Shows/hides nav links based on login state and role, and wires the logout button.
// Elements opt in with data-nav="guest" | "citizen" | "authority" | "any".
async function initNav() {
  const user = await getCurrentUser();
  const groups = document.querySelectorAll("[data-nav]");

  groups.forEach((el) => {
    const audience = el.getAttribute("data-nav");
    let show = false;
    if (audience === "guest") show = !user;
    if (audience === "any") show = !!user;
    if (audience === "citizen") show = user && user.role === "citizen";
    if (audience === "authority") show = user && user.role === "authority";
    el.style.display = show ? "" : "none";
  });

  const nameSlot = document.querySelector("[data-user-name]");
  if (nameSlot && user) nameSlot.textContent = user.full_name || user.email;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await sb.auth.signOut();
      window.location.href = "index.html";
    });
  }

  return user;
}

// Call at the top of a protected page. Redirects to index.html if the
// visitor isn't logged in, or isn't the required role.
async function requireRole(role) {
  const user = await getCurrentUser();
  if (!user || user.role !== role) {
    window.location.href = "index.html";
    return null;
  }
  return user;
}
