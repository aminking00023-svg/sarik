import { MapData, StatePiece } from "../types";

export const mapsData: Record<"india" | "usa", MapData> = {
  india: {
    id: "india",
    name: "India Geography Puzzle",
    viewBox: "0 0 600 560",
    width: 600,
    height: 560,
    // Unified background map boundary silhouette representing the country of India
    bgOutline: "M 250,20 L 265,35 L 285,45 L 305,45 L 325,35 L 335,45 L 330,65 L 345,75 L 335,95 L 320,110 L 330,120 L 325,140 L 350,150 L 390,165 L 420,165 L 430,155 L 450,175 L 470,170 L 490,185 L 530,195 L 545,215 L 530,225 L 520,245 L 540,265 L 520,285 L 500,285 L 485,270 L 460,275 L 440,260 L 435,280 L 415,280 L 398,310 L 385,340 L 370,365 L 340,395 L 328,425 L 315,455 L 302,485 L 295,510 L 285,535 L 27.5,535 L 270,510 L 265,485 L 255,455 L 240,425 L 225,395 L 210,365 L 200,340 L 190,310 L 175,280 L 160,260 L 140,245 L 125,230 L 110,215 L 120,185 L 135,165 L 155,150 L 175,140 L 195,120 L 215,110 L 225,95 L 235,75 L 245,65 L 240,45 Z",
    pieces: [
      {
        id: "IN-JK",
        name: "Jammu, Kashmir & Ladakh",
        capital: "Srinagar (Summer) / Jammu (Winter)",
        abbr: "JK",
        color: "bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-emerald-300",
        textColor: "#064e3b",
        // Precise geographic stylization for drag, snap & drop
        path: "M 250,20 L 265,35 L 285,45 L 305,45 L 325,35 L 330,65 L 295,95 L 255,85 L 240,45 Z",
        centerX: 280,
        centerY: 48,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Home to the stunning Dal Lake, beautiful snow-clad mountain passes, and the highest salt-water lake Pangong Tso."
      },
      {
        id: "IN-PB",
        name: "Punjab, Himachal & Haryana",
        capital: "Chandigarh",
        abbr: "PB",
        color: "bg-teal-100 hover:bg-teal-200 text-teal-950 border-teal-300",
        textColor: "#115e59",
        path: "M 255,85 L 295,95 L 330,65 L 343,78 L 320,110 L 290,135 L 245,115 Z",
        centerX: 295,
        centerY: 100,
        targetX: 0,
        targetY: 0,
        funFactAhead: "The name Punjab means 'The Land of Five Rivers', known as the granary of India with green, rich heritage farms."
      },
      {
        id: "IN-RJ",
        name: "Rajasthan",
        capital: "Jaipur",
        abbr: "RJ",
        color: "bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300",
        textColor: "#78350f",
        path: "M 245,115 L 290,135 L 270,195 L 220,215 L 175,175 L 185,130 Z",
        centerX: 230,
        centerY: 165,
        targetX: 0,
        targetY: 0,
        funFactAhead: "India's largest state by land, covered by the beautiful golden Thar Desert and historic royal fortresses of kings."
      },
      {
        id: "IN-UP",
        name: "Uttar Pradesh & Uttarakhand",
        capital: "Lucknow",
        abbr: "UP",
        color: "bg-orange-100 hover:bg-orange-200 text-orange-950 border-orange-300",
        textColor: "#7c2d12",
        path: "M 290,135 L 320,110 L 330,120 L 325,140 L 350,150 L 385,155 L 400,205 L 350,210 L 295,200 L 270,195 Z",
        centerX: 335,
        centerY: 170,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Home to the mighty Ganges River, the historical city of Varanasi, and the globally celebrated monument of love, the Taj Mahal."
      },
      {
        id: "IN-GJ",
        name: "Gujarat",
        capital: "Gandhinagar",
        abbr: "GJ",
        color: "bg-orange-100 hover:bg-orange-200 text-orange-900 border-orange-200",
        textColor: "#7c2d12",
        path: "M 185,130 L 175,175 L 220,215 L 210,250 L 160,260 L 140,245 L 125,230 L 155,190 Z",
        centerX: 170,
        centerY: 210,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Features the unique seasonal salt desert of Rann of Kutch and is the exclusive historic sanctuary of Asiatic Lions."
      },
      {
        id: "IN-MP",
        name: "Madhya Pradesh & Chhattisgarh",
        capital: "Bhopal",
        abbr: "MP",
        color: "bg-lime-100 hover:bg-lime-200 text-lime-950 border-lime-300",
        textColor: "#3f6212",
        path: "M 270,195 L 295,200 L 350,210 L 385,250 L 365,315 L 320,320 L 285,295 L 210,250 L 220,215 Z",
        centerX: 285,
        centerY: 245,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Often called the 'Heart of India' with ancient rock shelters at Bhimbetka and magnificent national tiger reserves."
      },
      {
        id: "IN-MH",
        name: "Maharashtra",
        capital: "Mumbai",
        abbr: "MH",
        color: "bg-blue-100 hover:bg-blue-200 text-blue-950 border-blue-300",
        textColor: "#172554",
        path: "M 210,250 L 285,295 L 320,320 L 310,370 L 245,360 L 205,320 L 195,290 Z",
        centerX: 250,
        centerY: 310,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Houses Mumbai (the commercial capital), incredible volcanic rock temples at Ellora, and majestic hilltop fortresses of the Marathas."
      },
      {
        id: "IN-KA",
        name: "Karnataka & Goa",
        capital: "Bengaluru",
        abbr: "KA",
        color: "bg-violet-100 hover:bg-violet-200 text-violet-950 border-violet-300",
        textColor: "#4c1d95",
        path: "M 205,320 L 245,360 L 280,390 L 270,455 L 215,405 Z",
        centerX: 235,
        centerY: 385,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Silicon Valley of India is Bengaluru! Famed for the ancient golden ruins of Hampi empires and sweet sandalwood forests."
      },
      {
        id: "IN-AP",
        name: "Andhra Pradesh & Telangana",
        capital: "Amaravati / Hyderabad",
        abbr: "AP",
        color: "bg-pink-100 hover:bg-pink-200 text-pink-950 border-pink-300",
        textColor: "#500724",
        path: "M 285,295 L 320,320 L 365,315 L 355,365 L 315,435 L 280,390 L 245,360 Z",
        centerX: 310,
        centerY: 355,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Famous for the historic Koh-i-noor diamond mines, tasty spicy Biryanis, and classical Kuchipudi temple dances."
      },
      {
        id: "IN-KL",
        name: "Kerala",
        capital: "Thiruvananthapuram",
        abbr: "KL",
        color: "bg-purple-100 hover:bg-purple-200 text-purple-950 border-purple-300",
        textColor: "#4a044e",
        path: "M 215,405 L 270,455 L 260,490 L 240,425 Z",
        centerX: 238,
        centerY: 450,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Known as 'God's Own Country', rich with networks of emerald lagoons, spice hills, and stunning coconut grove coastlines."
      },
      {
        id: "IN-TN",
        name: "Tamil Nadu",
        capital: "Chennai",
        abbr: "TN",
        color: "bg-rose-100 hover:bg-rose-200 text-rose-950 border-rose-300",
        textColor: "#4c0519",
        path: "M 270,455 L 315,435 L 302,485 L 285,535 L 275,535 L 260,490 Z",
        centerX: 285,
        centerY: 480,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Features grand historic Dravidian stone temples, Nilgiri heritage mountain rails, and the classical Bharatanatyam dance."
      },
      {
        id: "IN-OR",
        name: "Odisha & Jharkhand",
        capital: "Bhubaneswar",
        abbr: "OR",
        color: "bg-indigo-100 hover:bg-indigo-200 text-indigo-950 border-indigo-300",
        textColor: "#1e1b4b",
        path: "M 365,315 L 385,250 L 415,280 L 435,280 L 415,315 L 398,335 M 365,315 M 350,210 L 400,205 L 430,225 L 415,280 L 385,250 Z",
        centerX: 395,
        centerY: 270,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Home of the majestic Konark Sun Temple shaped like a giant chariot, and Chilika Lake, India's largest coastal water lagoon."
      },
      {
        id: "IN-BR",
        name: "Bihar & West Bengal",
        capital: "Patna / Kolkata",
        abbr: "BR",
        color: "bg-sky-100 hover:bg-sky-200 text-sky-950 border-sky-300",
        textColor: "#082f49",
        path: "M 400,205 L 430,155 L 445,170 L 435,225 L 400,205 Z M 435,225 L 445,170 L 450,175 L 470,170 L 460,255 L 430,225 Z",
        centerX: 435,
        centerY: 195,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Ancient land where Gautam Buddha achieved enlightenment in Bodh Gaya, and where famous Darjeeling tea hills overlook Bengal."
      },
      {
        id: "IN-NE",
        name: "Northeast States (Seven Sisters)",
        capital: "Guwahati / Shillong",
        abbr: "NE",
        color: "bg-cyan-100 hover:bg-cyan-200 text-cyan-950 border-cyan-300",
        textColor: "#164e63",
        path: "M 470,170 L 490,185 L 530,195 L 545,215 L 530,225 L 520,245 L 540,265 L 520,285 L 500,285 L 485,270 L 460,275 M 470,170 L 460,255 L 460,275 Z",
        centerX: 505,
        centerY: 220,
        targetX: 0,
        targetY: 0,
        funFactAhead: "A biologically vibrant region of green mist-filled valleys, home to the rare single-horned Rhino and the world's rainiest village."
      }
    ]
  },
  usa: {
    id: "usa",
    name: "USA Geography Puzzle",
    viewBox: "0 0 600 560",
    width: 600,
    height: 560,
    // Unified silhouette representation of the United States of America
    bgOutline: "M 40,110 L 90,110 L 140,110 L 190,115 L 240,120 L 290,120 L 340,115 L 390,120 L 420,115 L 450,110 L 485,85 L 505,80 L 535,90 L 555,100 L 565,115 L 575,130 L 555,150 L 545,160 L 555,175 L 565,215 L 545,230 L 535,250 L 515,270 L 525,320 L 540,355 L 530,375 L 510,405 L 515,445 L 495,440 L 480,425 L 450,420 L 420,410 L 390,415 L 350,445 L 310,480 L 285,475 L 275,415 L 245,410 L 210,410 L 180,410 L 160,395 L 140,405 L 120,415 L 105,375 L 85,340 L 45,270 L 65,245 L 50,190 L 35,145 L 30,130 Z",
    pieces: [
      {
        id: "US-NW",
        name: "Northwest (WA, OR, ID)",
        capital: "Olympia / Salem / Boise",
        abbr: "NW",
        color: "bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-emerald-300",
        textColor: "#064e3b",
        path: "M 40,110 L 140,110 L 160,190 L 140,210 L 75,210 L 50,190 Z",
        centerX: 95,
        centerY: 155,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Famed for volcanic emerald mountain ranges like Cascade, massive ancient evergreen pines, and juicy sweet apples."
      },
      {
        id: "US-CA",
        name: "California",
        capital: "Sacramento",
        abbr: "CA",
        color: "bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300",
        textColor: "#78350f",
        path: "M 75,210 L 140,210 L 105,375 L 85,340 L 45,270 L 65,245 Z",
        centerX: 85,
        centerY: 280,
        targetX: 0,
        targetY: 0,
        funFactAhead: "The Golden State, boasting the world's tallest Redwood trees, active tech cities in Silicon Valley, and sunny Pacific shores."
      },
      {
        id: "US-SW",
        name: "Southwest (NV, UT, AZ)",
        capital: "Carson City / Salt Lake City / Phoenix",
        abbr: "SW",
        color: "bg-orange-100 hover:bg-orange-200 text-orange-950 border-orange-300",
        textColor: "#7c2d12",
        path: "M 140,210 L 210,210 L 210,345 L 180,365 L 105,375 Z",
        centerX: 160,
        centerY: 290,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Carved with the spectacular geological wonder of the Grand Canyon, dry red deserts, and neon-lit oasis towns."
      },
      {
        id: "US-RM",
        name: "Rocky Mountains (MT, WY, CO, UT-E)",
        capital: "Helena / Cheyenne / Denver",
        abbr: "RM",
        color: "bg-teal-100 hover:bg-teal-200 text-teal-950 border-teal-300",
        textColor: "#115e59",
        path: "M 140,110 L 250,115 L 250,310 L 210,310 L 210,210 L 160,190 Z",
        centerX: 200,
        centerY: 170,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Home of majestic snowpeaks, the amazing thermal hot springs of Yellowstone, and herds of wild bison."
      },
      {
        id: "US-TX",
        name: "Texas",
        capital: "Austin",
        abbr: "TX",
        color: "bg-rose-100 hover:bg-rose-200 text-rose-950 border-rose-300",
        textColor: "#4c0519",
        path: "M 210,310 L 290,310 L 330,345 L 350,445 L 310,480 L 285,475 L 275,415 L 245,410 L 210,410 Z",
        centerX: 270,
        centerY: 385,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Known as the Lone Star State, famous for wide grazing rangelands, cattle ranches, oil towers, and NASA's Space Center."
      },
      {
        id: "US-GP",
        name: "Great Plains (ND, SD, NE, KS, OK)",
        capital: "Bismarck / Pierre / Lincoln / Topeka",
        abbr: "GP",
        color: "bg-lime-100 hover:bg-lime-200 text-lime-950 border-lime-300",
        textColor: "#3f6212",
        path: "M 250,115 L 315,120 L 315,310 L 290,310 L 250,310 Z",
        centerX: 285,
        centerY: 210,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Famed as the breadbasket of the continent, flat prairies featuring vast golden fields of wheat and famous tornadoes."
      },
      {
        id: "US-MW",
        name: "Midwest (MN, IA, MO, IL, WI)",
        capital: "St. Paul / Des Moines / Springfield",
        abbr: "MW",
        color: "bg-cyan-100 hover:bg-cyan-200 text-cyan-950 border-cyan-300",
        textColor: "#164e63",
        path: "M 315,120 L 385,120 L 385,310 L 330,310 L 315,310 Z",
        centerX: 350,
        centerY: 215,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Lapped by the spectacular system of Great Lakes, featuring mighty barge rivers, robust agriculture, and energetic lake breezes."
      },
      {
        id: "US-SO",
        name: "South (AR, LA, MS, AL, TN, KY)",
        capital: "Little Rock / Jackson / Nashville",
        abbr: "SO",
        color: "bg-purple-100 hover:bg-purple-200 text-purple-950 border-purple-300",
        textColor: "#4a044e",
        path: "M 290,310 L 420,310 L 420,410 L 390,415 L 350,445 L 330,345 Z",
        centerX: 360,
        centerY: 370,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Blessed with beautiful musical history of Jazz and Country, warm hospitality, bayous filled with friendly gators, and sweet tea."
      },
      {
        id: "US-GL",
        name: "Great Lakes & East (MI, IN, OH, PA)",
        capital: "Lansing / Indianapolis / Columbus / Harrisburg",
        abbr: "GL",
        color: "bg-blue-100 hover:bg-blue-200 text-blue-950 border-blue-300",
        textColor: "#172554",
        path: "M 385,120 L 460,115 L 470,265 L 420,265 L 385,250 Z",
        centerX: 425,
        centerY: 185,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Industrial, academic, and energetic engine of America, surrounded by vast shipping lakes, pine forests, and historic mills."
      },
      {
        id: "US-SE",
        name: "Southeast (GA, NC, SC, FL)",
        capital: "Atlanta / Raleigh / Columbia / Tallahassee",
        abbr: "SE",
        color: "bg-orange-100 hover:bg-orange-205 text-orange-950 border-orange-300",
        textColor: "#7c2d12",
        path: "M 420,265 L 485,250 L 515,270 L 525,320 L 540,355 L 530,375 L 510,405 L 480,425 L 450,420 L 420,410 L 420,310 Z",
        centerX: 470,
        centerY: 345,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Offers gorgeous sunny beaches, the marshy Everglades, launch sites of rocket space voyages, and tall peach orchards."
      },
      {
        id: "US-NE",
        name: "Northeast (NY, VT, NH, ME, MA)",
        capital: "Albany / Boston / Augusta",
        abbr: "NE",
        color: "bg-indigo-100 hover:bg-indigo-200 text-indigo-950 border-indigo-300",
        textColor: "#1e1b4b",
        path: "M 460,115 L 485,85 L 505,80 L 535,90 L 555,100 L 565,115 L 575,130 L 535,220 L 485,250 L 470,115 Z",
        centerX: 520,
        centerY: 150,
        targetX: 0,
        targetY: 0,
        funFactAhead: "Deep historical heart of the nation featuring stunning amber maple forests, coastal lighthouses, and iconic historic cities."
      }
    ]
  }
};

export function getDifficultyMap(country: "india" | "usa", difficulty: "easy" | "medium" | "hard"): MapData {
  const baseMap = mapsData[country];
  if (difficulty === "hard") {
    // Hard mode uses standard granular segments
    return baseMap;
  }

  const piecesMap = new Map(baseMap.pieces.map(p => [p.id, p]));

  // Define groupings for India
  const indiaEasyGroups = [
    {
      id: "IN-E-NORTH",
      name: "North & Central Highlands",
      abbr: "NCH",
      capital: "Srinagar / Lucknow / Bhopal",
      color: "bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-emerald-300",
      textColor: "#064e3b",
      members: ["IN-JK", "IN-PB", "IN-UP", "IN-MP"],
      funFactAhead: "Includes the majestic cold Himalayas, fertile valleys of Punjab, and the historical Ganges plains!"
    },
    {
      id: "IN-E-WEST",
      name: "Western Deserts & Salt Coast",
      abbr: "WDC",
      capital: "Jaipur / Gandhinagar",
      color: "bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300",
      textColor: "#78350f",
      members: ["IN-RJ", "IN-GJ"],
      funFactAhead: "Home to India's vast golden Thar Desert and the rare Asiatic Lions roaming safe sanctuary woods!"
    },
    {
      id: "IN-E-SOUTH",
      name: "Southern Deccan Peninsula",
      abbr: "SDP",
      capital: "Mumbai / Bengaluru / Chennai",
      color: "bg-indigo-100 hover:bg-indigo-200 text-indigo-950 border-indigo-300",
      textColor: "#1e1b4b",
      members: ["IN-MH", "IN-KA", "IN-AP", "IN-KL", "IN-TN"],
      funFactAhead: "Famed for tropical backwaters, bustling IT cities, and massive centuries-old stone temple towers."
    },
    {
      id: "IN-E-EAST",
      name: "Eastern Plains & Northeast Seven Sisters",
      abbr: "ENS",
      capital: "Kolkata / Patna / Guwahati",
      color: "bg-cyan-100 hover:bg-cyan-200 text-cyan-950 border-cyan-300",
      textColor: "#164e63",
      members: ["IN-OR", "IN-BR", "IN-NE"],
      funFactAhead: "A wildlife-rich region containing the rare single-horned Rhinos and the wettest rainforest valleys on Earth."
    }
  ];

  const indiaMediumGroups = [
    {
      id: "IN-M-JKPB",
      name: "Mountains & Rivers North",
      abbr: "MRN",
      capital: "Srinagar / Chandigarh",
      color: "bg-teal-100 hover:bg-teal-200 text-teal-950 border-teal-300",
      textColor: "#115e59",
      members: ["IN-JK", "IN-PB"],
      funFactAhead: "Filled with spectacular cold mountain landscapes and Punjab's five sprawling flowing rivers."
    },
    {
      id: "IN-M-RJ",
      name: "Rajasthan",
      abbr: "RJ",
      capital: "Jaipur",
      color: "bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300",
      textColor: "#78350f",
      members: ["IN-RJ"],
      funFactAhead: "India's largest desert state, filled with glorious pink palaces and massive hilltop fortresses."
    },
    {
      id: "IN-M-UPMP",
      name: "Central & Ganges Plains",
      abbr: "CGP",
      capital: "Lucknow / Bhopal",
      color: "bg-orange-100 hover:bg-orange-200 text-orange-950 border-orange-300",
      textColor: "#7c2d12",
      members: ["IN-UP", "IN-MP"],
      funFactAhead: "Contains the world-famous Taj Mahal and beautiful ancient cave paintings surrounded by rich tiger parks."
    },
    {
      id: "IN-M-GJMH",
      name: "West Coast & Arabian Sea Ports",
      abbr: "WSP",
      capital: "Mumbai / Gandhinagar",
      color: "bg-blue-100 hover:bg-blue-200 text-blue-950 border-blue-300",
      textColor: "#172554",
      members: ["IN-GJ", "IN-MH"],
      funFactAhead: "Bridges the Arabian Sea, housing dynamic harbors, ancient rock temples, and friendly local cultures."
    },
    {
      id: "IN-M-KAAP",
      name: "Silicon Deccan Plateau",
      abbr: "SDP",
      capital: "Bengaluru / Hyderabad",
      color: "bg-violet-100 hover:bg-violet-200 text-violet-950 border-violet-300",
      textColor: "#4c1d95",
      members: ["IN-KA", "IN-AP"],
      funFactAhead: "The high-tech heart of local cyber sciences, surrounding historic ruins of magnificent golden empires."
    },
    {
      id: "IN-M-KLTN",
      name: "Deep South Tropics",
      abbr: "DST",
      capital: "Chennai / Thiruvananthapuram",
      color: "bg-rose-100 hover:bg-rose-200 text-rose-950 border-rose-300",
      textColor: "#4c0519",
      members: ["IN-KL", "IN-TN"],
      funFactAhead: "Laid-back backwater networks, spices, tea farms, and beautiful Bharatanatyam classical temple dances."
    },
    {
      id: "IN-M-ORBR",
      name: "Eastern Plains & Deltas",
      abbr: "EPD",
      capital: "Patna / Bhubaneswar",
      color: "bg-lime-100 hover:bg-lime-200 text-lime-950 border-lime-300",
      textColor: "#3f6212",
      members: ["IN-OR", "IN-BR"],
      funFactAhead: "Contains Asia's largest brackish lagoon (Chilika Lake) and Bodh Gaya where Buddha reached enlightenment."
    },
    {
      id: "IN-M-NE",
      name: "Northeast Wilderness (Seven Sisters)",
      abbr: "NE",
      capital: "Guwahati / Shillong",
      color: "bg-cyan-100 hover:bg-cyan-200 text-cyan-950 border-cyan-300",
      textColor: "#164e63",
      members: ["IN-NE"],
      funFactAhead: "A scenic wonderland of living root bridges, tea plantations, and the wettest rain forests on Earth."
    }
  ];

  // Define groupings for USA
  const usaEasyGroups = [
    {
      id: "US-E-WEST",
      name: "Western Coast & Rocky Mountains",
      abbr: "WCR",
      capital: "Sacramento / Denver",
      color: "bg-emerald-100 hover:bg-emerald-250 text-emerald-950 border-emerald-300",
      textColor: "#064e3b",
      members: ["US-NW", "US-CA", "US-SW", "US-RM"],
      funFactAhead: "Crosses magnificent Cascade peaks, sunny seaside cliffs, and yellow thermal springs of safe bison ranges!"
    },
    {
      id: "US-E-MID",
      name: "Central Plains & Great Lakes",
      abbr: "CPL",
      capital: "St. Paul / Bismarck",
      color: "bg-lime-100 hover:bg-lime-250 text-lime-950 border-lime-300",
      textColor: "#3f6212",
      members: ["US-GP", "US-MW"],
      funFactAhead: "Vast sprawling plains of robust wheat harvests, massive cargo lakes, and energetic inland breezes!"
    },
    {
      id: "US-E-SOUTH",
      name: "The Southern Territory & Florida",
      abbr: "STF",
      capital: "Austin / Nashville / Atlanta",
      color: "bg-rose-100 hover:bg-rose-250 text-rose-950 border-rose-300",
      textColor: "#4c0519",
      members: ["US-TX", "US-SO", "US-SE"],
      funFactAhead: "Famous for warm coastal bayous, cattle ranch fields, NASA space launch bays, and Florida sandy reefs."
    },
    {
      id: "US-E-EAST",
      name: "Industrial Lake region & Northeast",
      abbr: "ILN",
      capital: "New York / Boston / Lansing",
      color: "bg-indigo-100 hover:bg-indigo-200 text-indigo-950 border-indigo-300",
      textColor: "#1e1b4b",
      members: ["US-GL", "US-NE"],
      funFactAhead: "The cradle of American history, featuring beautiful fall maple tree hills and early seaside ports."
    }
  ];

  const usaMediumGroups = [
    {
      id: "US-M-PAC",
      name: "Pacific West Coast",
      abbr: "PWC",
      capital: "Sacramento / Olympia",
      color: "bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-emerald-300",
      textColor: "#064e3b",
      members: ["US-NW", "US-CA"],
      funFactAhead: "Includes spectacular giant Redwood groves, snowy peaks, and thriving digital technology labs."
    },
    {
      id: "US-M-SWMT",
      name: "Southwest Desert & Rockies",
      abbr: "SDR",
      capital: "Phoenix / Denver",
      color: "bg-teal-100 hover:bg-teal-200 text-teal-950 border-teal-300",
      textColor: "#115e59",
      members: ["US-SW", "US-RM"],
      funFactAhead: "Home to the mighty Grand Canyon gorges, thermal geysers at Yellowstone, and bison herds."
    },
    {
      id: "US-M-GPMW",
      name: "Central Harvest Valley",
      abbr: "CHV",
      capital: "Lincoln / Des Moines / St. Paul",
      color: "bg-lime-100 hover:bg-lime-200 text-lime-950 border-lime-300",
      textColor: "#3f6212",
      members: ["US-GP", "US-MW"],
      funFactAhead: "Features beautiful flat farm valleys feeding millions, bordered by deep, cold cargo lakes."
    },
    {
      id: "US-M-TX",
      name: "Texas Range State",
      abbr: "TX",
      capital: "Austin",
      color: "bg-rose-100 hover:bg-rose-200 text-rose-950 border-rose-305",
      textColor: "#4c0519",
      members: ["US-TX"],
      funFactAhead: "The Lone Star State, featuring massive cattle ranches, oil wells, and NASA Mission Controls."
    },
    {
      id: "US-M-SO",
      name: "Music Heartland South",
      abbr: "MHS",
      capital: "Nashville / Jackson",
      color: "bg-purple-100 hover:bg-purple-200 text-purple-950 border-purple-300",
      textColor: "#4a044e",
      members: ["US-SO"],
      funFactAhead: "Famed birthplace of Blues, Country, and Jazz music, with gators hidden amongst deep cypress bayous."
    },
    {
      id: "US-M-SE",
      name: "Sunny Southeast",
      abbr: "SSE",
      capital: "Tallahassee / Atlanta",
      color: "bg-orange-100 hover:bg-orange-200 text-orange-950 border-orange-300",
      textColor: "#7c2d12",
      members: ["US-SE"],
      funFactAhead: "Home of beautiful sandy Florida keys, peach farming groves, and giant space rocket pads."
    },
    {
      id: "US-M-GLNE",
      name: "Historical Lakes & Northeast",
      abbr: "HLN",
      capital: "Boston / New York",
      color: "bg-indigo-100 hover:bg-indigo-200 text-indigo-950 border-indigo-300",
      textColor: "#1e1b4b",
      members: ["US-GL", "US-NE"],
      funFactAhead: "The nation's cradle, showing scenic fall foliage colors alongside ancient stone lighthouses."
    }
  ];

  const activeGroups = country === "india"
    ? (difficulty === "easy" ? indiaEasyGroups : indiaMediumGroups)
    : (difficulty === "easy" ? usaEasyGroups : usaMediumGroups);

  const finalPieces = activeGroups.map((group) => {
    const basePieces = group.members.map(mid => piecesMap.get(mid)).filter(p => !!p) as StatePiece[];
    
    // Concatenate the paths to build a single composite path matching standard multi-polygon
    const compositePath = basePieces.map(p => p.path).join(" ");
    
    // Compute average center coordinates for label placing
    const totalX = basePieces.reduce((sum, p) => sum + p.centerX, 0);
    const totalY = basePieces.reduce((sum, p) => sum + p.centerY, 0);
    const avgX = Math.round(totalX / basePieces.length);
    const avgY = Math.round(totalY / basePieces.length);

    const mergedPiece: StatePiece = {
      id: group.id,
      name: group.name,
      capital: group.capital,
      abbr: group.abbr,
      color: group.color,
      textColor: group.textColor,
      path: compositePath,
      centerX: avgX,
      centerY: avgY,
      targetX: 0,
      targetY: 0,
      funFactAhead: group.funFactAhead
    };

    return mergedPiece;
  });

  return {
    ...baseMap,
    pieces: finalPieces
  };
}
