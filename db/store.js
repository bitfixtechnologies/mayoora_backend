const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'db.json');

const DEFAULT_CATEGORIES = [
  { slug: 'cameras', name: 'CAMERAS', image: 'https://images.unsplash.com/photo-1576815316499-106518a203f1?auto=format&fit=crop&w=800&q=80' },
  { slug: 'lights', name: 'LIGHTS', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80' },
  { slug: 'audio', name: 'AUDIO', image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80' },
  { slug: 'lenses', name: 'LENSES', image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80' },
  { slug: 'grip-rigs', name: 'GRIP & RIGS', image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=800&q=80' },
  { slug: 'monitors', name: 'MONITORS', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' },
];

const DEFAULT_OFFERS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1500705077387-65f31ef00c90?auto=format&fit=crop&w=1600&q=80',
    title: 'Power Up Your Production',
    subtitle: 'Affordable rental for Cinema camera, lights and other accessories',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    title: 'Professional Gear for Creatives',
    subtitle: 'Everything you need to bring your vision to life',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    title: 'Top Tier Cinematic Tools',
    subtitle: 'Quality service and exceptional equipment',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1600&q=80',
    title: 'Special Monsoon Discount',
    subtitle: 'Get 20% off on premium Cinema & Lighting kits this season!',
  }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    title: "RED KOMODO 6K",
    category: "cameras",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
    price: "5500",
    features: [
      "RED KOMODO 6K BODY", "ADAPTER (R TO EF)", "FILTER (0.3, 0.6, 0.9, 1.2, ULTA PL)",
      "VIDEO TRANSMITTER", "7 INCH MONITOR", "MANUAL FOLLOW FOCUS", "MATTE BOX (6X6)",
      "CLIP-ON MATTE BOX (6X6)", "SHOULDER PAD", "TRIPOD (SUPERTEC)", "LOW STAND",
      "LOW BASE", "DIRECTORS MONITOR", "LAPTOP (MAC BOOK)"
    ],
    footerText: "FOCUS PULLER (6 TO 9 BATA INCLUDED) ASSISTANT (6 TO 9 BATA INCLUDED)",
    isKit: true
  },
  {
    id: 'p2',
    title: "SONY FX6",
    category: "cameras",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    price: "3500",
    features: [
      "SONY FX6 WITH ADAPTER", "FILTER (PL)", "LILLIPUT", "CLIP-ON MATTE BOX",
      "SHOULDER PAD", "VIDEO TRANSMITTER", "MACBOOK LAPTOP", "DIRECTORS MONITOR",
      "TRIPOD (SUPERTEC) (MID, LOW BASE)"
    ],
    footerText: "FOCUS PULLER (6 TO 9 BATA INCLUDED) ASSISTANT (6 TO 9 BATA INCLUDED)",
    isKit: true
  },
  {
    id: 'p3',
    title: "SONY FX3",
    category: "cameras",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=800&q=80",
    price: "2500",
    features: [
      "SONY FX3 WITH ADAPTER", "FILTER (0.3, 0.6, 0.9, PL)", "LILLIPUT", "MATTE BOX",
      "SHOULDER PAD", "VIDEO TRANSMITTER", "MACBOOK LAPTOP", "DIRECTORS MONITOR",
      "TRIPOD (SUPERTEC) (MID, LOW BASE)"
    ],
    footerText: "FOCUS PULLER (6 TO 9 BATA INCLUDED) ASSISTANT (6 TO 9 BATA INCLUDED)",
    isKit: true
  },
  {
    id: 'p4',
    title: "SONY A7S III",
    category: "cameras",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
    price: "1800",
    features: ["SONY A7S III BODY", "FE 24-70MM f/2.8 GM LENS", "2x 128GB SD CARDS", "TRIPOD"],
    footerText: "CAMERA ASSISTANT BATA INCLUDED",
    isKit: false
  },
  {
    id: 'p5',
    title: "APUTURE 600D",
    category: "lights",
    image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80",
    price: "2000",
    features: ["APUTURE LS 600D PRO COB LIGHT", "REFLECTOR", "CONTROLLER BOX", "LIGHT STAND", "SOFTBOX"],
    footerText: "LIGHT BOY NOT INCLUDED",
    isKit: false
  },
  {
    id: 'p6',
    title: "NANLITE PAVOTUBE 30C",
    category: "lights",
    image: "https://images.unsplash.com/photo-1513829096996-c85c54be59cd?auto=format&fit=crop&w=800&q=80",
    price: "1500",
    features: ["2x PAVOTUBE RGB TUBE", "MOUNT CLIPS", "POWER ADAPTERS", "CARRY BAG"],
    footerText: "",
    isKit: false
  },
  {
    id: 'p7',
    title: "SENNHEISER G4",
    category: "audio",
    image: "https://images.unsplash.com/photo-1590608897129-79da98d15969?auto=format&fit=crop&w=800&q=80",
    price: "800",
    features: ["SENNHEISER G4 WIRELESS TRANSMITTER", "G4 RECEIVER", "LAVALIER MIC", "XLR CABLE", "HOT SHOE MOUNT"],
    footerText: "",
    isKit: false
  },
  {
    id: 'p8',
    title: "CP3 PRIME LENS SET",
    category: "lenses",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    price: "4500",
    features: ["ZEISS CP.3 25MM T2.1", "ZEISS CP.3 35MM T2.1", "ZEISS CP.3 50MM T2.1", "ZEISS CP.3 85MM T2.1", "HARD FLIGHT CASE"],
    footerText: "FOCUS PULLER BATA INCLUDED",
    isKit: true
  },
  {
    id: 'p9',
    title: "SONY GM 50 (1.2)",
    category: "lenses",
    image: "https://images.unsplash.com/photo-1621510456681-23a23cfb5f57?auto=format&fit=crop&w=800&q=80",
    price: "1200",
    features: ["SONY FE 50MM F/1.2 GM LENS", "FRONT CAP", "REAR CAP", "LENS HOOD"],
    footerText: "",
    isKit: false
  },
  {
    id: 'p10',
    title: "SONY GM 35 (1.4)",
    category: "lenses",
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80",
    price: "1100",
    features: ["SONY FE 35MM F/1.4 GM LENS", "FRONT CAP", "REAR CAP", "LENS HOOD"],
    footerText: "",
    isKit: false
  },
  {
    id: 'p11',
    title: "DJI RONIN RS3 PRO",
    category: "grip-rigs",
    image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80",
    price: "1500",
    features: ["DJI RS 3 PRO GIMBAL", "BG30 GRIP", "QUICK-RELEASE PLATES", "FOCUS MOTOR (2022)"],
    footerText: "GIMBAL OPERATOR / ASSISTANT SEPARATE",
    isKit: false
  }
];

// Read from JSON file
function readData() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData = seedData();
      return initialData;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB file:', err);
    return { users: [], products: [], categories: [], offers: [] };
  }
}

// Write to JSON file
function writeData(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}

// Seed function
function seedData() {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);

  const initialData = {
    users: [
      {
        id: 'u_' + Date.now(),
        username: adminUsername,
        password: hashedPassword
      }
    ],
    products: DEFAULT_PRODUCTS,
    categories: DEFAULT_CATEGORIES,
    offers: DEFAULT_OFFERS
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
  return initialData;
}

// Initialize / sync configuration admin username & password on start if DB already exists but admin creds changed
function initialize() {
  const data = readData();
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
  
  // Check if admin user exists, if not or credentials mismatch, create or update
  const adminIndex = data.users.findIndex(u => u.username === adminUsername);
  if (adminIndex === -1) {
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    data.users.push({
      id: 'u_' + Date.now(),
      username: adminUsername,
      password: hashedPassword
    });
    writeData(data);
  } else {
    // Optionally check if password needs updating to match env
    const admin = data.users[adminIndex];
    if (!bcrypt.compareSync(adminPassword, admin.password)) {
      admin.password = bcrypt.hashSync(adminPassword, 10);
      writeData(data);
    }
  }
}

// Execute initialization
initialize();

module.exports = {
  read: readData,
  write: writeData
};
