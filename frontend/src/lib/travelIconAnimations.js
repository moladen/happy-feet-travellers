/** CSS class names for subtle looping emoji / icon motion (see globals.css). */

export const TRAVEL_ICON_ANIMATION = {
  bounce: 'travel-icon-bounce',
  sway: 'travel-icon-sway',
  rotate: 'travel-icon-rotate',
  ring: 'travel-icon-ring',
  starSpin: 'travel-icon-star-spin',
  busDrive: 'travel-icon-bus-drive',
  float: 'travel-icon-float',
  pulse: 'travel-icon-pulse',
};

const EMOJI_ANIMATION = {
  '⭐': TRAVEL_ICON_ANIMATION.starSpin,
  '🚌': TRAVEL_ICON_ANIMATION.busDrive,
  '🤝': TRAVEL_ICON_ANIMATION.bounce,
  '🧭': TRAVEL_ICON_ANIMATION.rotate,
  '📞': TRAVEL_ICON_ANIMATION.ring,
  '🌿': TRAVEL_ICON_ANIMATION.sway,
  '🧳': TRAVEL_ICON_ANIMATION.float,
  '🛡️': TRAVEL_ICON_ANIMATION.pulse,
};

export function travelIconClassForEmoji(emoji) {
  return EMOJI_ANIMATION[emoji] || TRAVEL_ICON_ANIMATION.float;
}

export function travelIconClassForTitle(title = '') {
  const t = String(title).toLowerCase();
  if (t.includes('successful') || t.includes('rating')) return TRAVEL_ICON_ANIMATION.starSpin;
  if (t.includes('comfortable') || t.includes('travel &')) return TRAVEL_ICON_ANIMATION.busDrive;
  if (t.includes('trusted') || t.includes('pricing') || t.includes('straightforward')) {
    return TRAVEL_ICON_ANIMATION.bounce;
  }
  if (t.includes('leader') || t.includes('small group') || t.includes('compass')) {
    return TRAVEL_ICON_ANIMATION.rotate;
  }
  if (t.includes('reachable') || t.includes('whatsapp')) return TRAVEL_ICON_ANIMATION.ring;
  if (t.includes('local')) return TRAVEL_ICON_ANIMATION.sway;
  if (t.includes('safety') || t.includes('security')) return TRAVEL_ICON_ANIMATION.pulse;
  if (t.includes('happy') || t.includes('traveler')) return TRAVEL_ICON_ANIMATION.float;
  return TRAVEL_ICON_ANIMATION.float;
}
