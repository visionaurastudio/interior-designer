/**
 * Business settings.
 * Anything left empty is intentionally NOT invented — fill these in before launch.
 */
export const BUSINESS = {
  name: 'Shree Shiv Steel Art',
  locality: 'Vile Parle East, Mumbai, Maharashtra',
  hours: 'Open until 9:00 PM',

  /** e.g. '+91 98XXXXXXXX' — enables the "Call Now" buttons. */
  phone: '',
  /** e.g. 'hello@yourdomain.com' — enquiry form falls back to the visitor's mail app. */
  email: '',
  /** e.g. a Formspree / Getform / own API URL that accepts a JSON POST. Preferred over email. */
  formEndpoint: '',

  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Shree Shiv Steel Art Vile Parle East Mumbai'),
};

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'kitchens', label: 'Kitchens' },
  { id: 'work', label: 'Our Work' },
  { id: 'why', label: 'Why Us' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
] as const;
