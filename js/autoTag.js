// autoTag.js

export function autoTag(mail) {
  const text = `${mail.subject || ""} ${mail.body || ""}`.toLowerCase();

  let category = "Other";
  let hasDeadline = false;

  /* ===== CATEGORY DETECTION ===== */

  // Academics
  if (
    text.includes("quiz") ||
    text.includes("assignment") ||
    text.includes("exam") ||
    text.includes("class") ||
    text.includes("lecture") ||
    text.includes("tutorial")
  ) {
    category = "Academics";
  }

  // Events
  else if (
    text.includes("workshop") ||
    text.includes("seminar") ||
    text.includes("event") ||
    text.includes("registration") ||
    text.includes("club") ||
    text.includes("meet")
  ) {
    category = "Events";
  }

  // Mess
  else if (
    text.includes("mess") ||
    text.includes("menu") ||
    text.includes("breakfast") ||
    text.includes("lunch") ||
    text.includes("dinner")
  ) {
    category = "Mess";
  }

  /* ===== DEADLINE DETECTION ===== */

  if (
    text.includes("deadline") ||
    text.includes("due") ||
    text.includes("submit") ||
    text.includes("last date") ||
    text.includes("before")
  ) {
    hasDeadline = true;
  }

  return {
    category,
    hasDeadline
  };
}
