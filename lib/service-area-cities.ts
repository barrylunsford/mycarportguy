export type ServiceAreaCity = {
  stateSlug: string;
  stateName: string;
  stateAbbreviation: string;
  slug: string;
  city: string;
  region: string;
  description: string;
  planningNote: string;
  nearbyAreas: string[];
};

export const serviceAreaCities: ServiceAreaCity[] = [
  {
    stateSlug: "georgia", stateName: "Georgia", stateAbbreviation: "GA", slug: "atlanta", city: "Atlanta", region: "the Atlanta metro area",
    description: "Compare metal carports, garages, RV covers, barns, and storage buildings for Atlanta-area properties with online dealer guidance.",
    planningNote: "Metro Atlanta projects may fall under different city or county rules. Confirm permits, setbacks, utilities, drainage, and installation access for the exact property before ordering.",
    nearbyAreas: ["Marietta", "Smyrna", "Decatur", "Roswell", "Douglasville"],
  },
  {
    stateSlug: "tennessee", stateName: "Tennessee", stateAbbreviation: "TN", slug: "knoxville", city: "Knoxville", region: "East Tennessee",
    description: "Shop metal carports, garages, RV covers, and barns for Knoxville, TN properties with delivery and professional installation.",
    planningNote: "East Tennessee terrain, drainage, access, and local permit requirements can affect a project. A level, accessible site and accurate measurements help keep installation on track.",
    nearbyAreas: ["Maryville", "Oak Ridge", "Farragut", "Sevierville", "Powell"],
  },
  {
    stateSlug: "south-carolina", stateName: "South Carolina", stateAbbreviation: "SC", slug: "greenville", city: "Greenville", region: "the Upstate",
    description: "Explore metal carports, garages, RV covers, and barns for Greenville, SC with straightforward online ordering guidance.",
    planningNote: "Upstate properties vary from neighborhood lots to rural acreage. Confirm local setbacks and permits, leave safe installation access, and prepare a level pad before delivery.",
    nearbyAreas: ["Mauldin", "Simpsonville", "Greer", "Travelers Rest", "Easley"],
  },
  {
    stateSlug: "south-carolina", stateName: "South Carolina", stateAbbreviation: "SC", slug: "columbia", city: "Columbia", region: "the Midlands",
    description: "Find metal carports, garages, RV covers, barns, and storage buildings for Columbia, SC homes and properties.",
    planningNote: "Plan for drainage, strong sun, wind requirements, local permitting, and adequate crew access. The installation ZIP code determines available designs and current scheduling.",
    nearbyAreas: ["Lexington", "West Columbia", "Cayce", "Irmo", "Blythewood"],
  },
];

export function getServiceAreaCity(stateSlug: string, citySlug: string) {
  return serviceAreaCities.find((location) => location.stateSlug === stateSlug && location.slug === citySlug);
}
