export type NorthCarolinaLocation = {
  slug: string;
  city: string;
  region: string;
  description: string;
  intro: string;
  localNote: string;
  projectIdeas: Array<{ title: string; description: string }>;
  nearbyAreas: string[];
};

export const northCarolinaLocations: NorthCarolinaLocation[] = [
  {
    slug: "hickory",
    city: "Hickory",
    region: "the Catawba Valley",
    description:
      "Shop metal carports, garages, RV covers, and barns for Hickory, NC properties with personal dealer guidance, delivery, and professional installation.",
    intro:
      "Whether you need everyday vehicle coverage, enclosed workshop space, or room for outdoor equipment, we can help you compare a metal building that fits your Hickory-area property and plans.",
    localNote:
      "Hickory-area projects range from compact residential carports to fully enclosed garages and larger storage buildings. Your installation ZIP code helps determine the available models, engineering requirements, and current lead time.",
    projectIdeas: [
      { title: "Two-car coverage", description: "Carports and garages sized for daily drivers, trucks, and additional storage." },
      { title: "Workshop space", description: "Enclosed garages with room for tools, projects, and organized equipment." },
      { title: "RV and boat protection", description: "Taller structures designed around campers, trailers, and recreational vehicles." },
    ],
    nearbyAreas: ["Conover", "Newton", "Claremont", "Long View", "Granite Falls"],
  },
  {
    slug: "lenoir",
    city: "Lenoir",
    region: "Caldwell County and the foothills",
    description:
      "Explore metal carports, garages, RV covers, and barns for Lenoir, NC with friendly online guidance, delivery, and professional installation.",
    intro:
      "From a simple vehicle cover to an enclosed garage or equipment building, we help Lenoir-area customers sort through sizes, roof styles, colors, and options without the pressure of a showroom visit.",
    localNote:
      "Sloped foothills properties make site preparation especially important. The building pad must meet the manufacturer’s requirements before installation, so confirm grading, access, and local permitting early in the process.",
    projectIdeas: [
      { title: "Garage and tool storage", description: "Secure enclosed space for vehicles, lawn equipment, tools, and seasonal storage." },
      { title: "Camper coverage", description: "RV covers with the height and width needed for larger recreational vehicles." },
      { title: "Flexible utility buildings", description: "Customizable layouts for work space, equipment, and property maintenance needs." },
    ],
    nearbyAreas: ["Hudson", "Gamewell", "Granite Falls", "Sawmills", "Cajah’s Mountain"],
  },
  {
    slug: "morganton",
    city: "Morganton",
    region: "Burke County and the western foothills",
    description:
      "Get help choosing metal carports, garages, RV covers, and barns for Morganton, NC properties, with delivery and professional installation available.",
    intro:
      "We help Morganton-area homeowners and property owners choose practical metal structures for vehicles, campers, workshops, farm equipment, and general storage.",
    localNote:
      "Building dimensions, door placement, anchoring, and site access should be planned together. Sharing photos and your installation ZIP code helps us identify the right options before an order is placed.",
    projectIdeas: [
      { title: "Vehicle and trailer storage", description: "Open or enclosed designs for cars, trucks, trailers, and outdoor gear." },
      { title: "Barn-style buildings", description: "Center sections with lean-tos for equipment, storage, livestock, or mixed use." },
      { title: "Backyard workshops", description: "Enclosed buildings configured for hobbies, repairs, and organized work space." },
    ],
    nearbyAreas: ["Drexel", "Valdese", "Glen Alpine", "Rutherford College", "Connelly Springs"],
  },
  {
    slug: "statesville",
    city: "Statesville",
    region: "Iredell County",
    description:
      "Compare metal carports, garages, RV covers, barns, and commercial buildings for Statesville, NC with straightforward dealer guidance.",
    intro:
      "Statesville-area properties have room for everything from residential carports to larger garages and commercial-style storage. We’ll help you narrow the choices and request current pricing for your location.",
    localNote:
      "Larger buildings often need more advance planning for access, permitting, and a properly prepared pad. We can help you identify the questions to ask locally before delivery is scheduled.",
    projectIdeas: [
      { title: "Multi-vehicle garages", description: "Enclosed storage with multiple garage doors and customizable walk-in access." },
      { title: "Business and equipment space", description: "Wider, longer buildings for inventory, machinery, work vehicles, or operations." },
      { title: "RV-ready structures", description: "High-clearance covers and garages planned around your camper’s exact dimensions." },
    ],
    nearbyAreas: ["Troutman", "Harmony", "Stony Point", "Cleveland", "Mooresville"],
  },
  {
    slug: "lincolnton",
    city: "Lincolnton",
    region: "Lincoln County",
    description:
      "Shop customizable metal carports, garages, RV covers, and barns for Lincolnton, NC with delivery and professional installation available.",
    intro:
      "We help Lincolnton-area customers plan metal buildings for daily vehicles, work trucks, equipment, campers, farm use, and secure storage—all from home.",
    localNote:
      "The best design starts with exact vehicle and equipment measurements, enough space around the building, and a level installation area. We’ll help you turn those details into a clear quote request.",
    projectIdeas: [
      { title: "Carports for daily use", description: "Convenient open-sided coverage for cars, trucks, and driveway parking." },
      { title: "Farm and equipment storage", description: "Barns and larger buildings for tractors, implements, feed, and supplies." },
      { title: "Enclosed garages", description: "Weather-protected storage with customizable doors, windows, colors, and trim." },
    ],
    nearbyAreas: ["Denver", "Iron Station", "Maiden", "Vale", "Cherryville"],
  },
];

export function getNorthCarolinaLocation(slug: string) {
  return northCarolinaLocations.find((location) => location.slug === slug);
}
