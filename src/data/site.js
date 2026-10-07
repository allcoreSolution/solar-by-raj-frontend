export const site = {
  name: "Solar Pro Energy",
  phone: "+91 XXXXXXXXX",
  phoneHref: "tel:+91 XXXXXXXXX",
  whatsapp: "https://wa.me/91XXXXXXXXXX?text=Hello%20Solar%20Pro%20Energy%2C%20I%20am%20interested%20in%20solar%20installation.%20Please%20share%20more%20details.",
  email: "XXXXXXXXXX@gmail.com",
  address: " Lucknow , Uttar Pradesh, India",
  map: "lucknow map link",
  stats: [["Installations", 151, "+"], ["Bill savings", 99.9, "%"], ["Years panel life", 25, "+"]],
};
const u = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
export const img = {
  field: u("1558449028-b53a39d100fc", 1600),
  panel: u("1613665813446-82a78c468a1d", 800),
  inverter: u("1624397640148-949b1732bb0a", 800),
  battery: u("1620714223084-8fcacc6dfd8d", 800),
  mount: u("1497440001374-f26997328c1b", 1200),
  farm: u("1466611653911-95081537e5b7", 1200),
};

export const features = [
  ["💡", "Lower Electricity Bills", "Save up to 90% with optimized rooftop solar design."],
  ["🌿", "Clean & Green Energy", "Generate renewable energy and reduce carbon footprint."],
  ["🛡️", "Reliable & Durable", "High-quality panels, inverters and mounting structures."],
  ["🤝", "Expert Support", "Survey, installation, paperwork and maintenance support."],
];
export const products = [
  ["Solar Panels", "Mono PERC and high-efficiency panels for maximum generation.", img.panel],
  ["Solar Inverters", "Reliable inverters for smooth and safe power conversion.", img.inverter],
  ["Solar Batteries", "Energy storage for backup, hybrid and off-grid power needs.", img.battery],
  ["Mounting Structure", "Strong GI and aluminium structures for long-lasting stability.", img.mount],
];
export const whySolar = [
  ["₹", "Save Money", "Reduce monthly power expenses from day one."],
  ["⌂", "Property Value", "Add long-term value to your building."],
  ["⚙", "Low Maintenance", "Durable systems with easy periodic cleaning."],
  ["★", "Government Benefits", "Guidance for applicable subsidy schemes."],
  ["☘", "Eco Friendly", "Lower emissions and protect the planet."],
];

// Shown when the API is offline, so the site never looks empty.
const px = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800`;
const P = (title, type, location, sizeKw, description, photo, featured = false) => ({ _id: `f-${title}`, title, type, location, sizeKw, featured, description, image: px(photo), images: [px(photo)] });
export const fallbackProjects = [
  P("10kW Home Solar", "Home", "Kanpur", 10, "Complete 10kW residential rooftop solar installation with high-efficiency panels and inverter.", 12243093, true),
  P("3kW Rooftop Solar", "Home", "Gomti Nagar, Lucknow", 3, "Compact 3kW rooftop system for a family home, sized to cut the monthly bill sharply.", 13558357, false),
  P("5kW Villa Solar", "Home", "Varanasi", 5, "5kW on-grid system for a two-storey villa with net metering and app monitoring.", 32387194, false),
  P("6kW Residential Solar", "Home", "Prayagraj", 6, "6kW residential plant with a shade-free layout planned after a detailed roof survey.", 12284244, false),
  P("8kW Home Solar with Battery", "Home", "Noida", 8, "8kW hybrid home system with battery backup to keep lights and fans on during power cuts.", 27863809, false),
  P("4kW Colony House Solar", "Home", "Gorakhpur", 4, "4kW rooftop system for a colony house, installed in two days with full paperwork support.", 12943046, false),
  P("50kW Commercial Solar", "Commercial", "Ghaziabad", 50, "Commercial rooftop system designed to reduce daytime electricity costs and improve energy independence.", 6961122, true),
  P("25kW School Rooftop", "Commercial", "Lucknow", 25, "25kW rooftop plant on a school building that covers most of the daytime classroom load.", 38171120, false),
  P("30kW Hospital Solar", "Commercial", "Kanpur", 30, "30kW system that trims the hospital's daytime grid bill without disturbing patient care.", 9875678, false),
  P("40kW Hotel Solar", "Commercial", "Agra", 40, "40kW rooftop installation for a hotel, cutting air-conditioning and lighting costs.", 11645008, false),
  P("60kW Shopping Mall Solar", "Commercial", "Meerut", 60, "60kW phased install on a mall roof, completed with no shutdown of the building.", 13199323, false),
  P("20kW Showroom Solar", "Commercial", "Bareilly", 20, "20kW showroom rooftop system with live generation monitoring for the owner.", 6961123, false),
  P("100kW Industrial Rooftop", "Industrial", "Lucknow", 100, "Large-scale industrial rooftop installation focused on reliable generation and long-term savings.", 9229392, true),
  P("150kW Textile Unit Solar", "Industrial", "Kanpur", 150, "150kW rooftop plant for a textile unit with steady daytime machine load.", 11815854, false),
  P("200kW Cold Storage Solar", "Industrial", "Noida", 200, "200kW system supporting round-the-clock cooling with strong daytime generation.", 35425747, false),
  P("250kW Steel Plant Rooftop", "Industrial", "Ghaziabad", 250, "250kW rooftop installation on a steel unit, with a structural roof assessment done first.", 9893727, false),
  P("120kW Warehouse Solar", "Industrial", "Varanasi", 120, "120kW warehouse roof system with high-efficiency panels and an annual maintenance plan.", 35501726, false),
  P("500kW Factory Solar", "Industrial", "Meerut", 500, "500kW factory rooftop plant, commissioned in phases while production kept running.", 4320449, false),
  P("75kW Solar Farm", "Farm", "Unnao", 75, "Ground-mounted solar installation for agricultural power requirements and daytime operations.", 15751131, false),
  P("30kW Irrigation Solar", "Farm", "Sitapur", 30, "30kW plant running tube-well pumps for irrigation, on a simple ground-mount structure.", 37061433, false),
  P("100kW Farm Solar Plant", "Farm", "Barabanki", 100, "100kW ground-mounted plant on farm land, with feasibility and grid checks done up front.", 28321970, false),
  P("150kW Agro Solar Park", "Farm", "Raebareli", 150, "150kW solar park for a farm group, supplying cold storage and processing sheds.", 33900746, false),
  P("50kW Orchard Solar", "Farm", "Hardoi", 50, "50kW system beside an orchard, powering pumps and a packing unit.", 15751130, false),
  P("200kW Ground Mount Solar", "Farm", "Lakhimpur Kheri", 200, "200kW ground-mounted installation with full commissioning support and monitoring.", 27637329, false)
];
export const fallbackTestimonials = [
  { _id: "t1", name: "Rahul Sharma", role: "Homeowner", city: "Lucknow", rating: 5, quote: "Solar Pro Energy installed the best system for our home. Our electricity bill is almost zero now!" },
  { _id: "t2", name: "Priya Singh", role: "Homeowner", city: "Varanasi", rating: 5, quote: "The team surveyed our roof, explained everything clearly and finished the install in two days. Very neat work." },
  { _id: "t3", name: "Amit Gupta", role: "Factory Owner", city: "Kanpur", rating: 5, quote: "Our daytime power cost has dropped a lot since the rooftop plant went live. Good support even after installation." },
  { _id: "t4", name: "Sunita Devi", role: "Farm Owner", city: "Unnao", rating: 5, quote: "Solar now runs our tube-well pumps in the daytime. No more worry about power cuts during irrigation." },
];
