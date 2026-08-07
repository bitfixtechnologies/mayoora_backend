const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Offer = require('../models/Offer');
const Product = require('../models/Product');
const PromoPopup = require('../models/PromoPopup');
const GalleryItem = require('../models/GalleryItem');

const connection_string = process.env.CONNECTION_STRING;

const DEFAULT_CATEGORIES = [
  { slug: 'cameras', name: 'CAMERAS', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' },
  { slug: 'lights', name: 'LIGHTS', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80' },
  { slug: 'audio', name: 'AUDIO', image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80' },
  { slug: 'lenses', name: 'LENSES', image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80' },
  { slug: 'grip-rigs', name: 'GRIP & RIGS', image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=800&q=80' },
  { slug: 'monitors', name: 'MONITORS', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' },
];

const DEFAULT_OFFERS = [
  {
    image: 'https://images.unsplash.com/photo-1500705077387-65f31ef00c90?auto=format&fit=crop&w=1600&q=80',
    title: 'Power Up Your Production',
    subtitle: 'Affordable rental for Cinema camera, lights and other accessories',
  },
  {
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    title: 'Professional Gear for Creatives',
    subtitle: 'Everything you need to bring your vision to life',
  },
  {
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    title: 'Top Tier Cinematic Tools',
    subtitle: 'Quality service and exceptional equipment',
  },
  {
    image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1600&q=80',
    title: 'Special Monsoon Discount',
    subtitle: 'Get 20% off on premium Cinema & Lighting kits this season!',
  }
];

const DEFAULT_GALLERY = [
  { category: 'PHOTO', url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80', title: 'Camera Rig Close Up' },
  { category: 'PHOTO', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', title: 'Wedding Shoot Setup' },
  { category: 'PHOTO', url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80', title: 'Cinema Theatre View' },
  { category: 'PHOTO', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', title: 'Outdoor Shooting Location' },
  { category: 'PHOTO', url: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=800&q=80', title: 'Cine Camera Operator' },
  { category: 'PHOTO', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', title: 'Paris Filming Session' },
  { category: 'PHOTO', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Golden Hour Portrait' },
  { category: 'PHOTO', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80', title: 'Event Production Crew' },
];

const DEFAULT_PRODUCTS = [
  {
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
    title: "SONY A7S III",
    category: "cameras",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
    price: "1800",
    features: ["SONY A7S III BODY", "FE 24-70MM f/2.8 GM LENS", "2x 128GB SD CARDS", "TRIPOD"],
    footerText: "CAMERA ASSISTANT BATA INCLUDED",
    isKit: false
  },
  {
    title: "APUTURE 600D",
    category: "lights",
    image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80",
    price: "2000",
    features: ["APUTURE LS 600D PRO COB LIGHT", "REFLECTOR", "CONTROLLER BOX", "LIGHT STAND", "SOFTBOX"],
    footerText: "LIGHT BOY NOT INCLUDED",
    isKit: false
  },
  {
    title: "NANLITE PAVOTUBE 30C",
    category: "lights",
    image: "https://images.unsplash.com/photo-1513829096996-c85c54be59cd?auto=format&fit=crop&w=800&q=80",
    price: "1500",
    features: ["2x PAVOTUBE RGB TUBE", "MOUNT CLIPS", "POWER ADAPTERS", "CARRY BAG"],
    footerText: "",
    isKit: false
  },
  {
    title: "SENNHEISER G4",
    category: "audio",
    image: "https://images.unsplash.com/photo-1590608897129-79da98d15969?auto=format&fit=crop&w=800&q=80",
    price: "800",
    features: ["SENNHEISER G4 WIRELESS TRANSMITTER", "G4 RECEIVER", "LAVALIER MIC", "XLR CABLE", "HOT SHOE MOUNT"],
    footerText: "",
    isKit: false
  },
  {
    title: "CP3 PRIME LENS SET",
    category: "lenses",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    price: "4500",
    features: ["ZEISS CP.3 25MM T2.1", "ZEISS CP.3 35MM T2.1", "ZEISS CP.3 50MM T2.1", "ZEISS CP.3 85MM T2.1", "HARD FLIGHT CASE"],
    footerText: "FOCUS PULLER BATA INCLUDED",
    isKit: true
  },
  {
    title: "SONY GM 50 (1.2)",
    category: "lenses",
    image: "https://images.unsplash.com/photo-1621510456681-23a23cfb5f57?auto=format&fit=crop&w=800&q=80",
    price: "1200",
    features: ["SONY FE 50MM F/1.2 GM LENS", "FRONT CAP", "REAR CAP", "LENS HOOD"],
    footerText: "",
    isKit: false
  },
  {
    title: "SONY GM 35 (1.4)",
    category: "lenses",
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80",
    price: "1100",
    features: ["SONY FE 35MM F/1.4 GM LENS", "FRONT CAP", "REAR CAP", "LENS HOOD"],
    footerText: "",
    isKit: false
  },
  {
    title: "DJI RONIN RS3 PRO",
    category: "grip-rigs",
    image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80",
    price: "1500",
    features: ["DJI RS 3 PRO GIMBAL", "BG30 GRIP", "QUICK-RELEASE PLATES", "FOCUS MOTOR (2022)"],
    footerText: "GIMBAL OPERATOR / ASSISTANT SEPARATE",
    isKit: false
  }
];

mongoose.connect(connection_string).then(async () => {
    console.log("mongodb connected to the server");
    
    // Auto-create default administrator account if database has zero users
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        
        await User.create({
          username: adminUsername,
          password: hashedPassword
        });
        console.log(`[Database] Default administrator account created: ${adminUsername}`);
      }
    } catch (err) {
      console.error("Error setting up default admin:", err);
    }

    // Auto-seed default categories if empty
    try {
      const categoryCount = await Category.countDocuments();
      if (categoryCount === 0) {
        await Category.insertMany(DEFAULT_CATEGORIES);
        console.log(`[Database] Auto-seeded default categories`);
      }
    } catch (err) {
      console.error("Error seeding default categories:", err);
    }

    // Auto-seed default offers if empty
    try {
      const offerCount = await Offer.countDocuments();
      if (offerCount === 0) {
        await Offer.insertMany(DEFAULT_OFFERS);
        console.log(`[Database] Auto-seeded default offers`);
      }
    } catch (err) {
      console.error("Error seeding default offers:", err);
    }

    // Auto-seed default products if empty
    try {
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        await Product.insertMany(DEFAULT_PRODUCTS);
        console.log(`[Database] Auto-seeded default products`);
      }
    } catch (err) {
      console.error("Error seeding default products:", err);
    }

    // Auto-seed default promo popup config if empty
    try {
      const promoPopupCount = await PromoPopup.countDocuments();
      if (promoPopupCount === 0) {
        await PromoPopup.create({
          image: '/DJI.jpg',
          title: 'DJI RONIN RS3 PRO',
          subtitle: 'FOR RENT',
          tagline: 'Power. Precision. Pro.',
          features: ['Flexible Rentals', 'Fast Delivery', '24/7 Support'],
          buttonText: 'Rent Now',
          buttonLink: 'https://wa.me/919496350343',
          website: 'www.rentalcamerawayanad.in',
          isActive: true
        });
        console.log(`[Database] Auto-seeded default promo popup config`);
      }
    } catch (err) {
      console.error("Error seeding default promo popup config:", err);
    }

    // Auto-seed default gallery items if empty
    try {
      const galleryCount = await GalleryItem.countDocuments();
      if (galleryCount === 0) {
        await GalleryItem.insertMany(DEFAULT_GALLERY);
        console.log(`[Database] Auto-seeded default gallery items`);
      }
    } catch (err) {
      console.error("Error seeding default gallery items:", err);
    }
}).catch(err => {
    console.log("connection failed");
    console.log(err);
});