import Festival from "../models/Festival.js";
import { findOrCreateDestinationByName } from "./destinationService.js";
import { getDestinationImage } from "../utils/destinationImageHelper.js";

/**
 * Festival Service - was missing a controller/service/routes entirely in the
 * original backend even though the Festival model existed. Adds global
 * festival listing + search (point 18).
 */
const CURATED_FESTIVALS = [
  {
    name: "Gion Matsuri Festival",
    destinationName: "Kyoto, Japan",
    description: "Japan's most famous festival featuring grand float parades, traditional kimono dances & evening lantern street markets.",
    start: "2026-07-01", end: "2026-07-31",
    category: "CULTURAL",
  },
  {
    name: "Carnival of Venice",
    destinationName: "Venice, Italy",
    description: "Opulent masquerade balls, elaborate historic Venetian masks & grand canal gondola pageantry.",
    start: "2026-02-03", end: "2026-02-17",
    category: "CULTURAL",
  },
  {
    name: "Songkran Water Festival",
    destinationName: "Bangkok, Thailand",
    description: "Thailand's traditional New Year celebration with citywide water fights and temple blessings.",
    start: "2026-04-13", end: "2026-04-15",
    category: "SEASONAL",
  },
  {
    name: "Oktoberfest",
    destinationName: "Munich, Germany",
    description: "The world's largest beer festival with traditional Bavarian food, music, and folk costumes.",
    start: "2026-09-19", end: "2026-10-04",
    category: "FOOD",
  },
  {
    name: "Diwali Festival of Lights",
    destinationName: "Jaipur, India",
    description: "The festival of lights celebrated with fireworks, oil lamps, sweets, and vibrant street decorations.",
    start: "2026-11-08", end: "2026-11-12",
    category: "RELIGIOUS",
  },
  {
    name: "Rio Carnival",
    destinationName: "Rio de Janeiro, Brazil",
    description: "The world's biggest carnival with samba parades, elaborate costumes, and street parties.",
    start: "2026-02-13", end: "2026-02-18",
    category: "MUSIC",
  },
  {
    name: "Cherry Blossom Festival",
    destinationName: "Tokyo, Japan",
    description: "Celebrating the seasonal bloom of sakura trees with hanami picnics across the city's parks.",
    start: "2026-03-20", end: "2026-04-10",
    category: "SEASONAL",
  },
  {
    name: "Edinburgh Fringe Festival",
    destinationName: "Edinburgh, Scotland",
    description: "The world's largest arts festival featuring theatre, comedy, dance, and music performances.",
    start: "2026-08-07", end: "2026-08-31",
    category: "MUSIC",
  },
  {
    name: "Dia de los Muertos",
    destinationName: "Mexico City, Mexico",
    description: "A vibrant celebration honoring deceased loved ones with altars, marigolds, and sugar skull art.",
    start: "2026-11-01", end: "2026-11-02",
    category: "CULTURAL",
  },
  {
    name: "Chinese New Year",
    destinationName: "Beijing, China",
    description: "Lunar New Year celebrations with lion dances, red lanterns, fireworks, and family feasts.",
    start: "2026-02-17", end: "2026-03-03",
    category: "SEASONAL",
  },
  {
    name: "Holi Festival of Colors",
    destinationName: "Mathura, India",
    description: "The vibrant Hindu festival of spring where crowds throw colored powder and water at each other in joyous celebration.",
    start: "2026-03-03", end: "2026-03-04",
    category: "CULTURAL",
  },
  {
    name: "La Tomatina",
    destinationName: "Buñol, Spain",
    description: "The world's biggest food fight featuring tens of thousands of participants throwing over-ripe tomatoes in the streets.",
    start: "2026-08-26", end: "2026-08-26",
    category: "FOOD",
  },
  {
    name: "Mardi Gras",
    destinationName: "New Orleans, USA",
    description: "Famous carnival celebration with elaborate parade floats, colorful beads, jazz music, and lively street parties in the French Quarter.",
    start: "2026-02-17", end: "2026-02-17",
    category: "MUSIC",
  },
  {
    name: "Glastonbury Festival",
    destinationName: "Somerset, UK",
    description: "A legendary five-day festival of contemporary performing arts, music, dance, comedy, and theatre in the English countryside.",
    start: "2026-06-24", end: "2026-06-28",
    category: "MUSIC",
  },
  {
    name: "Sapporo Snow Festival",
    destinationName: "Sapporo, Japan",
    description: "Spectacular winter festival featuring massive, intricate ice and snow sculptures illuminating the city parks.",
    start: "2026-02-04", end: "2026-02-11",
    category: "SEASONAL",
  },
  {
    name: "Cannes Film Festival",
    destinationName: "Cannes, France",
    description: "An exclusive, glamorous international film festival previewing new films of all genres from around the world.",
    start: "2026-05-12", end: "2026-05-23",
    category: "CULTURAL",
  },
  {
    name: "Coachella Valley Music and Arts Festival",
    destinationName: "Indio, USA",
    description: "Massive desert music festival featuring top musical artists, massive art installations, and celebrity attendees.",
    start: "2026-04-10", end: "2026-04-19",
    category: "MUSIC",
  },
  { name: "Day of the Dead", destinationName: "Oaxaca, Mexico", description: "Traditional Mexican holiday honoring deceased loved ones.", start: "2026-10-31", end: "2026-11-02", category: "CULTURAL" },
  { name: "Tomorrowland", destinationName: "Boom, Belgium", description: "One of the world's largest and most notable music festivals.", start: "2026-07-17", end: "2026-07-26", category: "MUSIC" },
  { name: "Burning Man", destinationName: "Black Rock City, USA", description: "A unique event focused on community, art, self-expression, and self-reliance.", start: "2026-08-30", end: "2026-09-07", category: "CULTURAL" },
  { name: "Pingxi Lantern Festival", destinationName: "New Taipei City, Taiwan", description: "Thousands of sky lanterns are released into the night sky.", start: "2026-03-03", end: "2026-03-03", category: "CULTURAL" },
  { name: "Harbin Ice and Snow Festival", destinationName: "Harbin, China", description: "The largest ice and snow festival in the world.", start: "2026-01-05", end: "2026-02-28", category: "SEASONAL" },
  { name: "Saint Patrick's Day", destinationName: "Dublin, Ireland", description: "Cultural and religious celebration held on the traditional death date of Saint Patrick.", start: "2026-03-17", end: "2026-03-17", category: "CULTURAL" },
  { name: "Boryeong Mud Festival", destinationName: "Boryeong, South Korea", description: "An annual festival which takes place during the summer, featuring mud baths and mud slides.", start: "2026-07-17", end: "2026-07-26", category: "SEASONAL" },
  { name: "Albuquerque International Balloon Fiesta", destinationName: "Albuquerque, USA", description: "A yearly hot air balloon festival that takes place during early October.", start: "2026-10-03", end: "2026-10-11", category: "SEASONAL" },
  { name: "Sundance Film Festival", destinationName: "Park City, USA", description: "The largest independent film festival in the United States.", start: "2026-01-22", end: "2026-02-01", category: "CULTURAL" },
  { name: "Kumbh Mela", destinationName: "Prayagraj, India", description: "A mass Hindu pilgrimage of faith in which Hindus gather to bathe in a sacred or holy river.", start: "2026-01-14", end: "2026-02-26", category: "RELIGIOUS" },
  { name: "Fuji Rock Festival", destinationName: "Naeba, Japan", description: "An annual rock festival held in Naeba Ski Resort.", start: "2026-07-24", end: "2026-07-26", category: "MUSIC" },
  { name: "Lollapalooza", destinationName: "Chicago, USA", description: "An annual four-day music festival held in Grant Park.", start: "2026-07-30", end: "2026-08-02", category: "MUSIC" },
  { name: "Ultra Music Festival", destinationName: "Miami, USA", description: "An annual outdoor electronic music festival.", start: "2026-03-27", end: "2026-03-29", category: "MUSIC" },
  { name: "Comic-Con International", destinationName: "San Diego, USA", description: "A comic book convention and multigenre entertainment event.", start: "2026-07-23", end: "2026-07-26", category: "CULTURAL" },
  { name: "Notting Hill Carnival", destinationName: "London, UK", description: "An annual Caribbean carnival event.", start: "2026-08-30", end: "2026-08-31", category: "CULTURAL" },
  { name: "Bermuda Carnival", destinationName: "Hamilton, Bermuda", description: "A vibrant Caribbean carnival celebration.", start: "2026-06-12", end: "2026-06-15", category: "CULTURAL" },
  { name: "Calgary Stampede", destinationName: "Calgary, Canada", description: "An annual rodeo, exhibition, and festival.", start: "2026-07-03", end: "2026-07-12", category: "CULTURAL" },
  { name: "Inti Raymi", destinationName: "Cusco, Peru", description: "A religious ceremony of the Inca Empire in honor of the sun god Inti.", start: "2026-06-24", end: "2026-06-24", category: "RELIGIOUS" },
  { name: "Pushkar Camel Fair", destinationName: "Pushkar, India", description: "An annual multi-day livestock fair and cultural fete.", start: "2026-11-15", end: "2026-11-23", category: "CULTURAL" },
  { name: "Vivid Sydney", destinationName: "Sydney, Australia", description: "An annual festival of light, music and ideas.", start: "2026-05-22", end: "2026-06-13", category: "CULTURAL" },
  { name: "White Nights Festival", destinationName: "St. Petersburg, Russia", description: "An annual international arts festival during the season of the midnight sun.", start: "2026-05-26", end: "2026-07-23", category: "CULTURAL" },
  { name: "Montreux Jazz Festival", destinationName: "Montreux, Switzerland", description: "A music festival held annually in Switzerland, on the Lake Geneva shoreline.", start: "2026-07-03", end: "2026-07-18", category: "MUSIC" },
  { name: "Roskilde Festival", destinationName: "Roskilde, Denmark", description: "A Danish music festival held south of Roskilde.", start: "2026-06-27", end: "2026-07-04", category: "MUSIC" },
  { name: "Sziget Festival", destinationName: "Budapest, Hungary", description: "One of the largest music and cultural festivals in Europe.", start: "2026-08-05", end: "2026-08-11", category: "MUSIC" },
  { name: "Hellfest", destinationName: "Clisson, France", description: "A French rock festival focusing on heavy metal music.", start: "2026-06-19", end: "2026-06-21", category: "MUSIC" },
  { name: "Electric Daisy Carnival", destinationName: "Las Vegas, USA", description: "A globally renowned electronic dance music festival.", start: "2026-05-15", end: "2026-05-17", category: "MUSIC" },
  { name: "Taste of Chicago", destinationName: "Chicago, USA", description: "The world's largest food festival.", start: "2026-07-08", end: "2026-07-12", category: "FOOD" },
  { name: "Pizzafest", destinationName: "Naples, Italy", description: "A celebration of pizza in its birthplace.", start: "2026-09-04", end: "2026-09-13", category: "FOOD" },
  { name: "Salon du Chocolat", destinationName: "Paris, France", description: "A yearly trade fair for the international chocolate industry.", start: "2026-10-28", end: "2026-11-01", category: "FOOD" },
  { name: "Melbourne Food and Wine Festival", destinationName: "Melbourne, Australia", description: "A gastronomic event celebrating food and wine.", start: "2026-03-13", end: "2026-03-22", category: "FOOD" }
];

const seedFestivalsIfEmpty = async () => {
  const count = await Festival.countDocuments();
  if (count > 0) return;

  for (let i = 0; i < CURATED_FESTIVALS.length; i++) {
    const fest = CURATED_FESTIVALS[i];
    try {
      const destination = await findOrCreateDestinationByName(fest.destinationName);
      const startDate = new Date(fest.start);
      const endDate = new Date(fest.end);
      
      const imageUrl = `https://loremflickr.com/800/600/${encodeURIComponent(fest.name.split(' ')[0])}?random=${i}`;

      await Festival.create({
        name: fest.name,
        destination: destination._id,
        description: fest.description,
        startDate,
        endDate,
        category: fest.category,
        image: imageUrl,
      });
    } catch (e) {
      console.warn("Festival seed skipped:", fest.name, e.message);
    }
  }
};

export const getAllFestivals = async (queryParams = {}) => {
  await seedFestivalsIfEmpty();

  const { category, page = 1, limit = 20 } = queryParams;
  const query = {};
  if (category) query.category = category;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const [festivals, count] = await Promise.all([
    Festival.find(query).populate("destination").sort({ startDate: 1 }).skip(skip).limit(parseInt(limit, 10)),
    Festival.countDocuments(query),
  ]);

  return { festivals, pagination: { total: count, page: parseInt(page, 10), limit: parseInt(limit, 10) } };
};

export const searchFestivals = async (keyword) => {
  await seedFestivalsIfEmpty();
  if (!keyword) return getAllFestivals();

  const words = keyword.trim().split(/\s+/).map(w => new RegExp(w, "i"));
  
  const festivals = await Festival.find({
    $and: words.map(regex => ({ name: regex }))
  }).populate("destination").limit(30);

  // Also match on populated destination name/city/country
  const allFestivals = await Festival.find({}).populate("destination");
  const destinationMatches = allFestivals.filter(f => 
    words.every(regex => 
      regex.test(f.name) ||
      regex.test(f.destination?.name || "") || 
      regex.test(f.destination?.city || "") || 
      regex.test(f.destination?.country || "") ||
      regex.test(f.category || "")
    )
  );

  const merged = [...festivals, ...destinationMatches].filter(
    (f, idx, arr) => arr.findIndex((x) => x._id.toString() === f._id.toString()) === idx
  );

  return { festivals: merged };
};
