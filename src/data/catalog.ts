export const PHONE_E164 = "917069047465";
export const PHONE_DISPLAY = "+91 70690 47465";
export const ADDRESS =
  "7, Omkar Elegance, Near Zundal Over Bridge, S.P. Ring Road, Zundal, Ahmedabad 382421";

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=7%20Omkar%20Elegance%20Near%20Zundal%20Over%20Bridge%20S.P.%20Ring%20Road%20Zundal%20Ahmedabad%20382421";

export function whatsappLink(text: string) {
  return `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(text)}`;
}

export const MOVEMENT_URL = whatsappLink(
  "Namaste Grink, I would like to join the #HealthierHappier movement.",
);

export type Badge = "Pantry" | "On order" | "Subscription" | "Gifting";

export type Product = {
  id: string;
  name: string;
  badge: Badge;
  summary: string;
  points: string[];
  image: string;
  imageAlt: string;
};

export const products: Product[] = [
  {
    id: "ghee",
    name: "A2 Gir Cow Ghee",
    badge: "Pantry",
    summary: "Hand-churned by the traditional bilona method. The goodness of Gir, in a jar.",
    points: [
      "Made from A2 Gir cow milk, naturally rich in A2 protein.",
      "Traditional bilona method — hand-churned curd for an authentic taste.",
      "100% organic. No chemicals and no shortcuts.",
      "No preservatives or additives. Nothing artificial.",
      "Pure, natural, traditional. The 300 ml jar is on the table now.",
    ],
    image: "/media/ghee-jar.jpg",
    imageAlt: "Jar of Grink premium Gir cow ghee with a brass bowl and wooden spoon",
  },
  {
    id: "honey",
    name: "Raw Honey",
    badge: "Pantry",
    summary: "100% natural multiflora Apis cerana honey. Raw, unfiltered, and sourced with care.",
    points: [
      "100% natural multiflora Apis cerana honey.",
      "Raw and unfiltered.",
      "No additives.",
      "Sustainably sourced.",
      "Empowering tribes, preserving nature.",
    ],
    image: "/media/slice-honey.jpg",
    imageAlt: "Open jar of raw honey with a wooden dipper and honeycomb",
  },
  {
    id: "juices",
    name: "Cold-Pressed Juices",
    badge: "On order",
    summary: "Pressed when you ask. Orange, pomegranate, mango, and the Goodness of Nature blend.",
    points: [
      "Made on order, not held in stock.",
      "Orange, pomegranate and mango.",
      "Goodness of Nature: amla, beetroot and carrot, blended so the amla stays easy to drink.",
      "A fresh bottle for the day, not a shelf drink.",
    ],
    image: "/media/slice-juices.jpg",
    imageAlt: "Three bottles of cold-pressed juice with orange, mango and pomegranate",
  },
  {
    id: "lip-balm",
    name: "Beewax Lip Balm",
    badge: "Pantry",
    summary: "A little tin that lives in the purse. No added colours, no unnecessary chemicals.",
    points: [
      "Made with beewax.",
      "No added colours.",
      "No unnecessary chemical additives.",
      "Small enough to carry every day.",
    ],
    image: "/media/slice-lip-balm.jpg",
    imageAlt: "Open tin of beewax lip balm beside honeycomb",
  },
  {
    id: "mukhwas",
    name: "Mukhwas",
    badge: "Pantry",
    summary: "A classic after-meal mouth freshener, packed for the home table and for gifting.",
    points: [
      "A traditional finish to a meal.",
      "Packed in small jars for the table or a hamper.",
      "Ask us what is in the current mix.",
    ],
    image: "/media/mukhwas.jpg",
    imageAlt: "Grink jars on the market table, including a jar of mukhwas",
  },
  {
    id: "pastries",
    name: "Pastries & Cookies",
    badge: "Pantry",
    summary: "Handmade bakes that sit beside honey and ghee — cookies, brownies and small pastries.",
    points: [
      "Handmade cookies and small bakes.",
      "Made to be eaten, and to be gifted.",
      "A natural pairing inside a hamper.",
    ],
    image: "/media/slice-pastries.jpg",
    imageAlt: "Assorted cookies and brownies on a wooden board",
  },
  {
    id: "sprouts",
    name: "Monthly Sprouts",
    badge: "Subscription",
    summary: "A standing order of fresh sprouts. The monthly plan is 20% off the counter price.",
    points: [
      "Fresh sprouts, delivered on a monthly rhythm.",
      "20% off when you subscribe.",
      "Tell us how many people you cook for and we will size the order.",
    ],
    image: "/media/slice-sprouts.jpg",
    imageAlt: "Wooden bowl of fresh green sprouts",
  },
  {
    id: "rice",
    name: "Brown Rice",
    badge: "Pantry",
    summary: "More fibre, more vitamins, more minerals — a quieter staple for the everyday pot.",
    points: [
      "More fibre, more vitamins, more minerals.",
      "Also listed with our seasonal grains, so ask what is packed this month.",
      "Good in a family order or a hamper.",
    ],
    image: "/media/slice-rice.jpg",
    imageAlt: "Bowl of brown rice with wheat ears",
  },
  {
    id: "hampers",
    name: "Personalised Gift Hampers",
    badge: "Gifting",
    summary: "Two to six jars, your colours, and your name on the box. From ₹2,500 onwards.",
    points: [
      "Choose from 2, 4 or 6 jar hampers.",
      "Prices start at ₹2,500 onwards.",
      "Custom logos, colours and packaging.",
      "Branding for corporate gifting.",
      "Honey, ghee, dry fruits, mithai, cookies, chocolates and festive décor.",
    ],
    image: "/media/slice-hampers.jpg",
    imageAlt: "Kraft gift hamper tied with a green ribbon",
  },
];

export const hampers = [
  {
    id: "classic",
    name: "Festive Classic",
    option: "Option 1",
    jars: "2 jar gift hamper",
    price: "₹2,500 onwards",
    text: "A blend of tradition and taste, with premium essentials for a joyful celebration.",
  },
  {
    id: "delight",
    name: "Premium Delight",
    option: "Option 2",
    jars: "4 jar gift hamper",
    price: "₹4,500 onwards",
    text: "Premium dry fruits, pure honey and festive décor — a truly special gift.",
  },
  {
    id: "grand",
    name: "Grand Celebration",
    option: "Option 3",
    jars: "6 jar gift hamper",
    price: "₹7,500 onwards",
    text: "A wholesome assortment of premium products, sweets and festive traditions.",
  },
] as const;

export const hamperIncludes = [
  "Traditional Indian mithai",
  "Premium assorted dry fruits",
  "Pure honey",
  "A2 Gir cow ghee",
  "Handmade cookies",
  "Assorted chocolates",
  "Decorative diyas and Labh Shubh sets",
];

export const seasonal = [
  { name: "Kesar mango", note: "When the season is on" },
  { name: "Jaggery from Gir", note: "Seasonal, from Gir" },
  { name: "Jeera", note: "Ask for the current lot" },
  { name: "Brown rice", note: "Also in the pantry" },
  { name: "Millets", note: "Seasonal grains" },
  { name: "Beewax candle", note: "Upcoming" },
];

export const testimonials = [
  {
    quote:
      "I have been using GRINK Gir Cow Ghee for a couple of months and am happy with the quality. The assurance of a reliable source gives me confidence, and the timely delivery with every order makes the experience even better. Highly satisfied!",
    name: "Kalpanaben Shah",
    product: "A2 Gir Cow Ghee",
  },
  {
    quote:
      "I love amla, but having it on its own can be a little difficult for me. The combination of amla, beetroot, and carrot in Goodness Of Nature Juice makes it so much tastier while bringing together the goodness of these nutritious ingredients. Loved the taste and the blend! Highly recommended!",
    name: "Ms. Priyal",
    product: "Goodness of Nature juice",
  },
  {
    quote:
      "I have been using GRINK Beewax Lip Balm for a long time, and I absolutely love it! It’s handy, easy to carry, and has become a permanent part of my purse. I love that it’s made without added colours or unnecessary chemical additives. It’s my go-to lip balm whenever I need it.",
    name: "Ms. Kamal Mehta",
    product: "Beewax Lip Balm",
  },
];

export const trust = [
  { title: "100% natural ingredients", text: "Food that still tastes of where it came from." },
  { title: "No preservatives or additives", text: "Nothing artificial in the jar." },
  { title: "Sustainably sourced", text: "Tribes, Gir, and a lighter hand on the land." },
  { title: "Good for you and the planet", text: "A healthier tomorrow, packed today." },
];

export type EnquiryForm = {
  name: string;
  phone: string;
  address: string;
  requirement: string;
  reference: string;
  picks: string[];
};

export const emptyForm: EnquiryForm = {
  name: "",
  phone: "",
  address: "",
  requirement: "",
  reference: "",
  picks: [],
};

export function normalisePhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function isIndianMobile(input: string) {
  return /^[6-9]\d{9}$/.test(normalisePhone(input));
}

export function buildEnquiry(form: EnquiryForm) {
  const lines = [
    "Namaste Grink Agro,",
    "",
    `Name: ${form.name.trim()}`,
    `Phone: ${form.phone.trim()}`,
    `Address: ${form.address.trim()}`,
    "Requirement:",
    form.requirement.trim(),
  ];
  if (form.reference.trim()) lines.push(`Reference: ${form.reference.trim()}`);
  lines.push("", "Sent from the Grink website.");
  return lines.join("\n");
}

export function isEnquiryForm(value: unknown): value is EnquiryForm {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.name === "string" &&
    typeof row.phone === "string" &&
    typeof row.address === "string" &&
    typeof row.requirement === "string" &&
    typeof row.reference === "string" &&
    Array.isArray(row.picks) &&
    row.picks.every((item) => typeof item === "string")
  );
}
