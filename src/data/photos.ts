export interface Photo { id: string; w: number; h: number; widths: number[]; bg: string; alt: string; label: string }

export const PHOTOS: Record<string, Photo> = {
  c01: { id: 'c01', w: 851, h: 672, widths: [480, 851], bg: '#5b5a57', alt: "Grey U-shaped modular kitchen with a glass display unit and built-in oven", label: "Kitchen" },
  c02: { id: 'c02', w: 936, h: 811, widths: [480, 936], bg: '#32322e', alt: "Dark charcoal L-shaped modular kitchen with under-cabinet lighting and built-in oven", label: "Kitchen" },
  c03: { id: 'c03', w: 1440, h: 1695, widths: [480, 960, 1440], bg: '#3b4040', alt: "Light blue gloss modular kitchen with drawers and a corner worktop", label: "Kitchen" },
  c04: { id: 'c04', w: 1048, h: 1179, widths: [480, 960, 1048], bg: '#3d372b', alt: "Charcoal and timber display unit with a glass showcase, open niches and a patterned back panel", label: "Display unit" },
  c05: { id: 'c05', w: 1081, h: 812, widths: [480, 960, 1081], bg: '#4c4535', alt: "Open kitchen with navy wall units, timber base cabinets and an island beside the living area", label: "Kitchen" },
  c06: { id: 'c06', w: 1084, h: 816, widths: [480, 960, 1084], bg: '#494138', alt: "Kitchen with timber-finish cabinets, a cream worktop and glazed wall units", label: "Kitchen" },
  c07: { id: 'c07', w: 1081, h: 812, widths: [480, 960, 1081], bg: '#4a433b', alt: "U-shaped kitchen with navy wall units, timber base cabinets and a peninsula", label: "Kitchen" },
  c08: { id: 'c08', w: 1440, h: 1080, widths: [480, 960, 1440], bg: '#4b4f46', alt: "Kitchen with white loft cabinets, green drawers and a herringbone-pattern backsplash", label: "Kitchen" },
  c09: { id: 'c09', w: 1159, h: 1372, widths: [480, 960, 1159], bg: '#51514e', alt: "Kitchen with tall cream units, built-in ovens, a loft with glass doors and a dark stone worktop", label: "Kitchen" },
  c10: { id: 'c10', w: 1080, h: 1080, widths: [480, 960, 1080], bg: '#574e49', alt: "TV back panel in white marble-look stone with fluted timber side panels and a floating console", label: "TV unit" },
  c11: { id: 'c11', w: 1080, h: 1080, widths: [480, 960, 1080], bg: '#474b47', alt: "Teal gloss base cabinets with glass-door wall units and a stone-look backsplash", label: "Kitchen" },
  c12: { id: 'c12', w: 1440, h: 1800, widths: [480, 960, 1440], bg: '#464a4b', alt: "Sky-blue and white L-shaped kitchen with glazed upper units and a patterned backsplash", label: "Kitchen" },
  c13: { id: 'c13', w: 1440, h: 1080, widths: [480, 960, 1440], bg: '#3f443f', alt: "Pull-out drawer organiser holding crockery and cookware", label: "Kitchen storage" },
  c14: { id: 'c14', w: 1440, h: 1695, widths: [480, 960, 1440], bg: '#534839', alt: "Illuminated timber wall niche with shelves and storage drawers below", label: "Wall unit" },
  c15: { id: 'c15', w: 1058, h: 1196, widths: [480, 960, 1058], bg: '#4b4339', alt: "Glass-front loft cabinets with warm lighting above a grey base unit", label: "Kitchen loft" },
  c16: { id: 'c16', w: 1440, h: 1440, widths: [480, 960, 1440], bg: '#59574e', alt: "The same L-shaped kitchen in sage green", label: "Finish option" },
  c17: { id: 'c17', w: 1440, h: 1440, widths: [480, 960, 1440], bg: '#5e5752', alt: "The same L-shaped kitchen in taupe", label: "Finish option" },
  c18: { id: 'c18', w: 1440, h: 1440, widths: [480, 960, 1440], bg: '#595451', alt: "The same L-shaped kitchen in slate blue", label: "Finish option" },
  c19: { id: 'c19', w: 1440, h: 1440, widths: [480, 960, 1440], bg: '#5d564f', alt: "The same L-shaped kitchen in cream", label: "Finish option" },
  c20: { id: 'c20', w: 1440, h: 1440, widths: [480, 960, 1440], bg: '#5a544f', alt: "The same L-shaped kitchen in light grey", label: "Finish option" },
};

/** Order used by the fullscreen lightbox (matches the on-page order of the gallery). */
export const GALLERY_ORDER: string[] = [
  'c03', 'c08', 'c05',
  'c16', 'c17', 'c18', 'c19', 'c20',
  'c14', 'c15', 'c13',
  'c10', 'c06', 'c01',
];
