export const INTEREST_CATEGORIES = [
  {
    label: 'Food & Drink',
    emoji: '🍽️',
    items: [
      { id: 'wine', label: 'Wine', emoji: '🍷' },
      { id: 'craft_beer', label: 'Craft Beer', emoji: '🍺' },
      { id: 'cocktails', label: 'Cocktails', emoji: '🍸' },
      { id: 'fine_dining', label: 'Fine Dining', emoji: '⭐' },
      { id: 'street_food', label: 'Street Food', emoji: '🌮' },
      { id: 'cooking', label: 'Cooking', emoji: '👨‍🍳' },
      { id: 'baking', label: 'Baking', emoji: '🥐' },
      { id: 'coffee', label: 'Coffee', emoji: '☕' },
      { id: 'plant_based', label: 'Plant-Based', emoji: '🥗' },
      { id: 'braai', label: 'Braai', emoji: '🔥' },
      { id: 'whiskey', label: 'Whiskey', emoji: '🥃' },
      { id: 'cheese', label: 'Cheese & Charcuterie', emoji: '🧀' },
    ],
  },
  {
    label: 'Lifestyle',
    emoji: '✨',
    items: [
      { id: 'travel', label: 'Travel', emoji: '✈️' },
      { id: 'photography', label: 'Photography', emoji: '📸' },
      { id: 'art', label: 'Art', emoji: '🎨' },
      { id: 'music', label: 'Music', emoji: '🎵' },
      { id: 'theatre', label: 'Theatre', emoji: '🎭' },
      { id: 'film', label: 'Film & TV', emoji: '🎬' },
      { id: 'reading', label: 'Reading', emoji: '📚' },
      { id: 'fashion', label: 'Fashion', emoji: '👗' },
      { id: 'wellness', label: 'Wellness', emoji: '🧘' },
      { id: 'gaming', label: 'Gaming', emoji: '🎮' },
      { id: 'podcasts', label: 'Podcasts', emoji: '🎙️' },
      { id: 'volunteering', label: 'Volunteering', emoji: '🤝' },
    ],
  },
  {
    label: 'Business & Ideas',
    emoji: '💡',
    items: [
      { id: 'entrepreneurship', label: 'Entrepreneurship', emoji: '🚀' },
      { id: 'tech', label: 'Technology', emoji: '💻' },
      { id: 'finance', label: 'Finance & Investing', emoji: '📈' },
      { id: 'marketing', label: 'Marketing', emoji: '📣' },
      { id: 'design', label: 'Design', emoji: '✏️' },
      { id: 'sustainability', label: 'Sustainability', emoji: '🌍' },
      { id: 'social_impact', label: 'Social Impact', emoji: '❤️' },
      { id: 'education', label: 'Education', emoji: '🎓' },
      { id: 'science', label: 'Science', emoji: '🔬' },
      { id: 'writing', label: 'Writing', emoji: '✍️' },
    ],
  },
  {
    label: 'Active Life',
    emoji: '⚡',
    items: [
      { id: 'running', label: 'Running', emoji: '🏃' },
      { id: 'cycling', label: 'Cycling', emoji: '🚴' },
      { id: 'hiking', label: 'Hiking', emoji: '🥾' },
      { id: 'yoga', label: 'Yoga', emoji: '🧘' },
      { id: 'gym', label: 'Gym & Fitness', emoji: '💪' },
      { id: 'rugby', label: 'Rugby', emoji: '🏉' },
      { id: 'football', label: 'Football', emoji: '⚽' },
      { id: 'cricket', label: 'Cricket', emoji: '🏏' },
      { id: 'golf', label: 'Golf', emoji: '⛳' },
      { id: 'swimming', label: 'Swimming', emoji: '🏊' },
      { id: 'tennis', label: 'Tennis', emoji: '🎾' },
      { id: 'surfing', label: 'Surfing', emoji: '🏄' },
    ],
  },
]

export const ALL_INTERESTS = INTEREST_CATEGORIES.flatMap(c => c.items)

export const getInterestById = (id) => ALL_INTERESTS.find(i => i.id === id)
export const getInterestsByIds = (ids = []) => ids.map(id => getInterestById(id)).filter(Boolean)

// ─── Conversation Prompts ─────────────────────────────────────
// Each prompt has tags (matching interest IDs) and a question.
// When rendering for a table, we surface prompts that match the
// combined interests of all diners present, plus general ones.

export const CONVERSATION_PROMPTS = [
  // General — always good at any table
  { id: 'g1', tags: [], question: "If you could eat one meal for the rest of your life, what would it be and why?" },
  { id: 'g2', tags: [], question: "What's the best meal you've ever had, and what made it unforgettable?" },
  { id: 'g3', tags: [], question: "If you could invite any person — alive or dead — to this table tonight, who would it be?" },
  { id: 'g4', tags: [], question: "What's something you've changed your mind about in the last year?" },
  { id: 'g5', tags: [], question: "What's your most ambitious goal right now — the one you don't tell most people?" },
  { id: 'g6', tags: [], question: "What's the most interesting place you've been to that most people haven't heard of?" },
  { id: 'g7', tags: [], question: "If you could master any skill overnight, what would you choose?" },
  { id: 'g8', tags: [], question: "What's a compliment you received that genuinely stayed with you?" },
  { id: 'g9', tags: [], question: "What's something about South Africa that you think the rest of the world is missing out on?" },
  { id: 'g10', tags: [], question: "What's the first thing you'd do if you had a completely free, unplanned weekend?" },

  // Food & Drink
  { id: 'f1', tags: ['wine', 'fine_dining'], question: "Red or white — and what's the most interesting wine you've tried recently?" },
  { id: 'f2', tags: ['cooking', 'baking'], question: "What's the last thing you cooked that actually impressed yourself?" },
  { id: 'f3', tags: ['travel', 'street_food'], question: "What's the most memorable street food you've eaten on your travels?" },
  { id: 'f4', tags: ['braai'], question: "Classic boerewors or lamb chops — and what's your secret braai move?" },
  { id: 'f5', tags: ['whiskey', 'cocktails'], question: "What's the best cocktail or spirit you've discovered in the last year?" },
  { id: 'f6', tags: ['plant_based', 'cooking'], question: "What's the best plant-based dish you've had that surprised you?" },
  { id: 'f7', tags: ['coffee'], question: "Single origin or blend — and where do you think South Africa's best coffee comes from?" },
  { id: 'f8', tags: ['craft_beer'], question: "What made you get into craft beer, and what's the most interesting local brewery you've found?" },
  { id: 'f9', tags: ['fine_dining', 'wine'], question: "Which restaurant experience made you feel like you were in a completely different world?" },
  { id: 'f10', tags: ['cheese'], question: "Cheese course: hard pass or the best part of the meal? What's your favourite?" },

  // Travel
  { id: 't1', tags: ['travel'], question: "Where's the one place you keep telling yourself you'll go but haven't made it yet?" },
  { id: 't2', tags: ['travel'], question: "What city surprised you the most — in a good way?" },
  { id: 't3', tags: ['travel', 'photography'], question: "If you had to pick one photo from your travels to show this table, which moment would it capture?" },
  { id: 't4', tags: ['travel', 'sustainability'], question: "How has travel changed the way you think about your daily life back home?" },

  // Business & Entrepreneurship
  { id: 'b1', tags: ['entrepreneurship'], question: "What's a business idea you had years ago that someone else has since built?" },
  { id: 'b2', tags: ['entrepreneurship', 'tech'], question: "If you were starting a company tomorrow, what problem would you solve?" },
  { id: 'b3', tags: ['finance'], question: "What's the best financial lesson you learned the hard way?" },
  { id: 'b4', tags: ['marketing'], question: "What's a piece of marketing or storytelling that genuinely moved you recently?" },
  { id: 'b5', tags: ['social_impact', 'sustainability'], question: "If your work could make one tangible difference in South Africa, what would it be?" },
  { id: 'b6', tags: ['tech'], question: "What tech change in the last 5 years has most changed how you live or work?" },
  { id: 'b7', tags: ['design'], question: "What's a piece of design — product, building, poster, anything — that you think is genuinely beautiful?" },
  { id: 'b8', tags: ['education'], question: "What's the most valuable thing you learned that wasn't taught in school?" },

  // Arts & Culture
  { id: 'a1', tags: ['music'], question: "What album or artist has become the soundtrack to a specific chapter of your life?" },
  { id: 'a2', tags: ['film'], question: "What film changed how you see the world — and have you rewatched it since?" },
  { id: 'a3', tags: ['reading'], question: "What's the last book that made you stop and think for a few days afterwards?" },
  { id: 'a4', tags: ['art'], question: "Is there a piece of art — painting, sculpture, street art — that you think about often?" },
  { id: 'a5', tags: ['theatre'], question: "What's the most powerful live performance you've ever seen?" },
  { id: 'a6', tags: ['writing', 'podcasts'], question: "What writer, podcast, or newsletter do you recommend to almost everyone you meet?" },

  // Active Life & Sports
  { id: 's1', tags: ['running', 'cycling', 'hiking'], question: "What's the hardest physical challenge you've completed, and would you do it again?" },
  { id: 's2', tags: ['rugby', 'cricket', 'football'], question: "What's your greatest sporting memory — watching or playing?" },
  { id: 's3', tags: ['yoga', 'wellness'], question: "What's the single wellness habit that's had the biggest effect on your life?" },
  { id: 's4', tags: ['golf'], question: "Best course you've played — and best excuse for a bad round?" },
  { id: 's5', tags: ['surfing', 'swimming'], question: "What does being in the water do for your headspace?" },

  // Deeper connectors
  { id: 'd1', tags: [], question: "What's a belief or value you hold that most people in your life would disagree with?" },
  { id: 'd2', tags: [], question: "What chapter of your life do you think you'll look back on as the most formative?" },
  { id: 'd3', tags: [], question: "What's something you're working on or building right now that you're genuinely excited about?" },
  { id: 'd4', tags: [], question: "What's the best advice you've ever been given — and did you take it at the time?" },
  { id: 'd5', tags: [], question: "If the people at this table formed a startup, what would each person's role be?" },
  { id: 'd6', tags: [], question: "What's a moment in your life where everything changed because you said yes to something unexpected?" },
  { id: 'd7', tags: ['volunteering', 'social_impact'], question: "What cause or community do you quietly put time or money into?" },
]

/**
 * Get a curated set of conversation prompts for a group of diners.
 * Surfaces interest-matched questions first, then fills with general ones.
 */
export function getPromptsForTable(dinerInterests = [], count = 8) {
  const interestSet = new Set(dinerInterests.flat())

  const matched = CONVERSATION_PROMPTS.filter(p =>
    p.tags.length > 0 && p.tags.some(t => interestSet.has(t))
  )
  const general = CONVERSATION_PROMPTS.filter(p => p.tags.length === 0)

  // Shuffle each group
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)

  const combined = [...shuffle(matched), ...shuffle(general)]
  const seen = new Set()
  const result = []
  for (const p of combined) {
    if (!seen.has(p.id)) { seen.add(p.id); result.push(p) }
    if (result.length >= count) break
  }
  return result
}
