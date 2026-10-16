// Drink catalog for "Treat the Table" feature.
// Prices are suggested — restaurants can override.
// Categories map to brand promotion types for future cross-promotion.

export const TABLE_DRINK_CATALOG = [
  // Wine
  { id: 'bottle_red',      emoji: '🍷', label: 'Bottle of Red Wine',     category: 'wine',      price: 350, serves: 6, description: 'A bottle of house red for the table' },
  { id: 'bottle_white',    emoji: '🥂', label: 'Bottle of White Wine',    category: 'wine',      price: 320, serves: 6, description: 'Crisp house white, chilled and ready' },
  { id: 'bottle_bubbly',   emoji: '🍾', label: 'Bottle of MCC / Bubbly',  category: 'sparkling', price: 450, serves: 6, description: 'South African bubbly to kick off the night' },
  { id: 'wine_pairing',    emoji: '🍇', label: 'Wine Pairing (per seat)', category: 'wine',      price: 180, serves: 1, description: 'A glass paired to each course, per person' },

  // Spirits & Shots
  { id: 'round_shots',     emoji: '🥃', label: 'Round of Shots',          category: 'spirits',   price: 120, serves: 6, description: 'One shot each — the table decides what' },
  { id: 'bottle_whiskey',  emoji: '🥃', label: 'Bottle of Whiskey',       category: 'spirits',   price: 780, serves: 6, description: 'A bottle to share at your own pace' },
  { id: 'bottle_gin',      emoji: '🌿', label: 'Bottle of Gin',           category: 'spirits',   price: 680, serves: 6, description: 'South African craft gin, tonics included' },

  // Beer
  { id: 'round_craft',     emoji: '🍺', label: 'Round of Craft Beers',    category: 'beer',      price: 90,  serves: 6, description: 'Local craft on tap or in the bottle' },
  { id: 'craft_tasting',   emoji: '🍻', label: 'Beer Flight (per seat)',   category: 'beer',      price: 120, serves: 1, description: '4-glass flight from the local brewery' },

  // Cocktails
  { id: 'round_cocktails', emoji: '🍸', label: 'Round of Cocktails',      category: 'cocktails', price: 200, serves: 6, description: 'One cocktail each — chef\'s choice or classic' },
  { id: 'signature_jug',   emoji: '🫧', label: 'Signature Cocktail Jug',  category: 'cocktails', price: 280, serves: 6, description: 'A sharing jug of the restaurant\'s signature mix' },

  // Non-alcoholic
  { id: 'round_mocktails', emoji: '🧃', label: 'Round of Mocktails',      category: 'nonalc',   price: 80,  serves: 6, description: 'Alcohol-free sharing option for the whole table' },
]

export const DRINK_CATEGORIES = [
  { id: 'wine',      label: 'Wine',       emoji: '🍷' },
  { id: 'sparkling', label: 'Sparkling',  emoji: '🍾' },
  { id: 'spirits',   label: 'Spirits',    emoji: '🥃' },
  { id: 'beer',      label: 'Beer',       emoji: '🍺' },
  { id: 'cocktails', label: 'Cocktails',  emoji: '🍸' },
  { id: 'nonalc',    label: 'Non-Alc',    emoji: '🧃' },
]

export function getDrinkById(id) {
  return TABLE_DRINK_CATALOG.find(d => d.id === id)
}
