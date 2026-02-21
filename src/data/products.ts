export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock: number;
}

export const categories = [
  "All",
  "Guitars",
  "Pianos & Keyboards",
  "Drums & Percussion",
  "Wind Instruments",
  "String Instruments",
];

export const products: Product[] = [
  {
    id: "1",
    name: "Fender Stratocaster",
    category: "Guitars",
    price: 1299,
    image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&h=600&fit=crop",
    description: "The iconic Fender Stratocaster delivers versatile tones with its three single-coil pickups, comfortable contoured body, and smooth tremolo system. A timeless choice for any guitarist.",
    stock: 12,
  },
  {
    id: "2",
    name: "Gibson Les Paul Standard",
    category: "Guitars",
    price: 2499,
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=600&fit=crop",
    description: "The Gibson Les Paul Standard features a mahogany body with a maple top, dual humbucker pickups, and legendary sustain. The gold standard of rock guitars.",
    stock: 6,
  },
  {
    id: "3",
    name: "Yamaha Grand Piano C3X",
    category: "Pianos & Keyboards",
    price: 4999,
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=600&fit=crop",
    description: "The Yamaha C3X Grand Piano offers rich, expressive tone with a responsive touch. Handcrafted with precision, it's perfect for concert halls and studios.",
    stock: 3,
  },
  {
    id: "4",
    name: "Roland RD-2000 Stage Piano",
    category: "Pianos & Keyboards",
    price: 2699,
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&h=600&fit=crop",
    description: "The Roland RD-2000 combines authentic piano sounds with cutting-edge technology. Weighted keys and dual sound engines make it ideal for live performance.",
    stock: 8,
  },
  {
    id: "5",
    name: "Pearl Masters Maple Complete",
    category: "Drums & Percussion",
    price: 1899,
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&h=600&fit=crop",
    description: "The Pearl Masters Maple Complete drum kit delivers warm, resonant tones from premium maple shells. Professional-grade hardware and stunning finishes.",
    stock: 5,
  },
  {
    id: "6",
    name: "Zildjian A Custom Cymbal Pack",
    category: "Drums & Percussion",
    price: 899,
    image: "https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=600&h=600&fit=crop",
    description: "Zildjian A Custom cymbals deliver bright, cutting tones perfect for modern music. This pack includes hi-hats, crash, and ride cymbals.",
    stock: 15,
  },
  {
    id: "7",
    name: "Yamaha YAS-875EX Alto Saxophone",
    category: "Wind Instruments",
    price: 3499,
    image: "https://images.unsplash.com/photo-1546539782-6fc531453083?w=600&h=600&fit=crop",
    description: "The Yamaha YAS-875EX alto saxophone offers a warm, rich tone with excellent projection. Hand-engraved and built for professional performers.",
    stock: 4,
  },
  {
    id: "8",
    name: "Bach Stradivarius Trumpet",
    category: "Wind Instruments",
    price: 2899,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&h=600&fit=crop",
    description: "The Bach Stradivarius trumpet is the benchmark for professional trumpets. Brilliant tone, precise intonation, and superb craftsmanship.",
    stock: 7,
  },
  {
    id: "9",
    name: "Stradivarius Violin Replica",
    category: "String Instruments",
    price: 1599,
    image: "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=600&h=600&fit=crop",
    description: "This meticulously crafted Stradivarius replica delivers warm, singing tones with excellent projection. Hand-carved spruce top and maple back.",
    stock: 9,
  },
  {
    id: "10",
    name: "Taylor 814ce Acoustic Guitar",
    category: "Guitars",
    price: 3299,
    image: "https://images.unsplash.com/photo-1558098329-a11cff621064?w=600&h=600&fit=crop",
    description: "The Taylor 814ce features rosewood back and sides with a Sitka spruce top, delivering lush, full-range acoustic tone with built-in electronics.",
    stock: 10,
  },
];
