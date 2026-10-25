/**
 * Business settings.
 * Anything left empty is intentionally NOT invented — fill these in before launch.
 */
export const BUSINESS = {
  name: 'Shree Shiv Steel Art',
  locality: 'Vile Parle East, Mumbai, Maharashtra',
  addressLines: [
    'Shop No. 1/C, Kamdar Shopping Centre,',
    'Opposite Vile Parle Railway Station,',
    'V. S. Khandelkar Road, Vile Parle East,',
    'Mumbai, Maharashtra – 400057',
  ],
  hours: 'Open 9:00 AM – 9:00 PM',
  payments: 'UPI and cash',
  /** Directory listing detail supplied by the client; not independently verified. */
  listing: '4.6/5 from 4 ratings on a directory listing (supplied by the client, not independently verified)',

  /** e.g. '+91 98XXXXXXXX' — enables the "Call Now" buttons. */
  phone: '+91 9892851153',
  /** No business email has been supplied, so none is shown. */
  email: '',
  /** e.g. a Formspree / Getform / own API URL that accepts a JSON POST. Preferred over email. */
  formEndpoint: '',

  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Shree Shiv Steel Art, Kamdar Shopping Centre, V. S. Khandelkar Road, Vile Parle East, Mumbai 400057'),
};

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'kitchens', label: 'Kitchens' },
  { id: 'tv', label: 'TV Units' },
  { id: 'wardrobes', label: 'Wardrobes' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
] as const;

const digits = BUSINESS.phone.replace(/\D/g, '');
export const TEL_HREF = `tel:${BUSINESS.phone.replace(/\s+/g, '')}`;
/** Click-to-chat link built from the business phone number. */
export const WA_MESSAGE =
  'Hello Shree Shiv Steel Art! I visited your website and would like to enquire about your modular kitchens, TV units, wardrobes, and furniture. Please share more details.';
export const waUrl = (text = WA_MESSAGE) =>
  `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
