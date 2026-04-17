// Eye animation constants
export const EYE_CONFIG = {
  centerX: 198.13,
  centerY: 88.18,
  maxRadius: 30,
  smallPupilRadius: 3.71,
  bigPupilRadius: 12,
  smallPupilPosition: {
    x: 193.18,
    y: 96.58,
  },
  distanceDivisor: 5,
  transitionDuration: 0.3,
  lerpFactor: 0.08, // Smooth interpolation factor (0-1, lower = smoother/slower)
};

// Doll animation constants
export const DOLL_ANIMATION = {
  floatingRange: [0, -30, 0] as [number, number, number], // Increased movement distance
  duration: 3, // Reduced frequency (slower animation)
  ease: "easeInOut" as const,
};

// SVG viewBox dimensions
export const SVG_VIEWBOX = {
  doll: "0 0 325.73 302.49",
  decorative: "0 0 741.18 407.84",
};

// Colors
export const COLORS = {
  doll: "#597182",
  universe: "#2d4454",
  errorCode: "#0f212e",
  eyeBackground: "#1b2c38",
  eyeOuter: "#2d4454",
};

// Text content
export const TEXT_CONTENT = {
  errorCode: "404",
  title: "Oops! The page you were looking for doesn't exist.",
  description: "You may have misstyped the address\nor the page may have moved.",
  buttonText: "Go to home page",
};

// Animation transitions
export const TRANSITIONS = {
  textContent: {
    delay: 0.3,
    duration: 0.6,
  },
};
