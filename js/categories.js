// Shared across pages that deal with complaint categories.

const CATEGORIES = [
  "Sanitation & Waste",
  "Roads & Potholes",
  "Street Lighting",
  "Water Supply",
  "Drainage",
  "Public Property Damage",
  "Other",
];

const CATEGORY_ICONS = {
  "Sanitation & Waste": "🗑️",
  "Roads & Potholes": "🛣️",
  "Street Lighting": "💡",
  "Water Supply": "🚰",
  "Drainage": "🌊",
  "Public Property Damage": "🏚️",
  "Other": "📌",
};

// Higher-risk categories default to a higher priority in the authority queue.
const CATEGORY_PRIORITY = {
  "Water Supply": "high",
  "Drainage": "high",
  "Sanitation & Waste": "medium",
  "Roads & Potholes": "medium",
  "Street Lighting": "medium",
  "Public Property Damage": "low",
  "Other": "low",
};

// Very lightweight keyword matching used to auto-suggest a category from
// what the citizen typed. Good enough for a demo "AI-assisted" suggestion.
const CATEGORY_KEYWORDS = {
  "Sanitation & Waste": ["garbage", "trash", "waste", "bin", "dump", "litter", "rubbish"],
  "Roads & Potholes": ["pothole", "road", "pavement", "crack", "asphalt", "footpath"],
  "Street Lighting": ["light", "lamp", "streetlight", "dark", "bulb"],
  "Water Supply": ["water", "pipe", "leak", "tap", "supply", "pipeline"],
  "Drainage": ["drain", "sewage", "flood", "waterlog", "manhole", "overflow"],
  "Public Property Damage": ["bench", "park", "damaged", "broken", "vandal", "property", "fence"],
};

function suggestCategory(text) {
  const lower = (text || "").toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter((k) => lower.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  }
  return best; // null if nothing matched
}

function priorityForCategory(category) {
  return CATEGORY_PRIORITY[category] || "low";
}

function categoryIcon(category) {
  return CATEGORY_ICONS[category] || "📌";
}
