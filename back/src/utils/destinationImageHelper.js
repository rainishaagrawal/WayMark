/**
 * Maps a destination name/keyword to a relevant curated image.
 * Used to auto-assign a trip banner image based on the trip's location
 * when the user does not upload their own custom banner.
 * This keeps every trip's banner visually distinct instead of reusing one
 * generic image for every trip.
 */

const DESTINATION_IMAGE_MAP = [
  { keywords: ["kyoto", "japan", "tokyo", "osaka"], image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["santorini", "greece", "athens", "mykonos"], image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["zermatt", "switzerland", "andermatt", "alps"], image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["norway", "fjord", "aurora", "arctic"], image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["venice", "italy", "rome", "milan", "florence"], image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["paris", "france", "nice", "lyon"], image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["bali", "indonesia", "jakarta"], image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["new york", "usa", "manhattan", "brooklyn"], image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["dubai", "uae", "abu dhabi"], image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["london", "england", "uk", "britain"], image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["thailand", "bangkok", "phuket", "chiang mai"], image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["maldives"], image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["iceland", "reykjavik"], image: "https://images.unsplash.com/photo-1531168556467-80aace0d0144?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["peru", "cusco", "machu picchu"], image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80" },
  { keywords: ["egypt", "cairo", "giza"], image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80" },
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
];

export const getDestinationImage = (destinationName = "") => {
  const lower = destinationName.toLowerCase();

  for (const entry of DESTINATION_IMAGE_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.image;
    }
  }

  // Deterministic fallback based on name hash so the same unknown destination
  // still always gets the same fallback image (not random each time).
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = (hash + lower.charCodeAt(i)) % FALLBACK_IMAGES.length;
  }
  return FALLBACK_IMAGES[hash] || FALLBACK_IMAGES[0];
};

export default getDestinationImage;
