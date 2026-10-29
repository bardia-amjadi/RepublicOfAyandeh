/**
 * Central site configuration. Edit values here — no component changes needed.
 */
export const site = {
  /** Official names */
  nameFa: 'جمهوری آینده',
  nameEn: 'Republic of Ayandeh',
  tagline: 'اطلس سیاسی و پرتال رسمی یک جهان خیالی',
  taglineEn: 'The political atlas and official portal of a fictional world',

  /** Brand assets live in public/assets/brand/. Replace the files, or change these paths. */
  logo: 'assets/brand/logo.svg',
  flag: 'assets/brand/flag.svg',

  /**
   * Instagram. >>> REPLACE `url` WITH THE REAL PROFILE LINK <<<
   * `handle` is shown next to the button; leave '' to hide it.
   */
  instagram: {
    url: 'https://www.instagram.com/',
    handle: '',
  },

  /** Short credit lines shown in the footer and About page. */
  credits: [
    'مرز بیرونی نقشه: Natural Earth (مالکیت عمومی)',
    'قلم: وزیرمتن (Vazirmatn) — مجوز SIL OFL',
  ],
} as const;

/** Main navigation. `to` values are router paths. */
export const navigation = [
  { to: '/', label: 'خانه', labelEn: 'Home', end: true },
  { to: '/map', label: 'نقشه سیاسی', labelEn: 'Political Map', end: false },
  { to: '/news', label: 'اخبار', labelEn: 'News', end: false },
  { to: '/characters', label: 'شخصیت‌ها', labelEn: 'Characters', end: false },
  { to: '/gallery', label: 'رسانه', labelEn: 'Media', end: false },
  { to: '/about', label: 'درباره', labelEn: 'About', end: false },
] as const;
