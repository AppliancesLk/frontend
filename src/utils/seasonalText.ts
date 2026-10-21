import type { SeasonalTheme } from '../types/seasonal-theme.types';
export const seasonalPresets: Record<
  SeasonalTheme,
  {
    name: string;
    occasion: string;
    description: string;
    headline: string;
    message: string;
  }
> = {
  DEFAULT: {
    name: 'Default',
    occasion: 'Everyday Appliances.lk',
    description: 'Your current storefront, just as it is.',
    headline: '',
    message: '',
  },
  AVURUDU: {
    name: 'Avurudu',
    occasion: 'Sinhala & Tamil New Year',
    description: 'A radiant sun, swaying leaves and a traditional oil lamp.',
    headline: 'A fresh start, together.',
    message:
      'Wishing you a joyful Sinhala & Tamil New Year, from all of us at Appliances.lk.',
  },
  CHRISTMAS: {
    name: 'Christmas',
    occasion: 'Christmas',
    description: 'Gentle snowfall, a festive tree and Santa flying by.',
    headline: 'A little wonder. A lot of joy.',
    message:
      'Wishing you a warm and wonderful Christmas, filled with the people and things you love.',
  },
  HALLOWEEN: {
    name: 'Halloween',
    occasion: 'Halloween',
    description: 'Floating bats, a glowing pumpkin and drifting mist.',
    headline: 'Good things, with a little mischief.',
    message:
      'A playful twist on your everyday favourites. Happy Halloween from Appliances.lk.',
  },
  EASTER: {
    name: 'Easter',
    occasion: 'Easter · Pasku',
    description: 'Painted eggs, spring leaves and a playful little bunny.',
    headline: 'Make room for brighter days.',
    message:
      'Wishing you a peaceful Easter and a season full of fresh beginnings.',
  },
};
export const seasonalText = {
  title: 'Seasonal themes',
  description:
    'Seasonal banners, logo ornaments and a little motion. Your store colors stay exactly as they are.',
  choose: 'Choose your occasion',
  customize: 'Make it yours',
  preview: 'Storefront preview',
  previewHint: 'Changes are published when you save.',
  headline: 'Greeting headline',
  message: 'Greeting message',
  defaults: 'Leave these blank to use the seasonal greeting.',
  greeting: 'Show the seasonal greeting',
  decorations: 'Add logo decorations and seasonal artwork',
  animations: 'Animate the seasonal banner',
  motionHint:
    'Effects stay inside the banner and pause offscreen. Reduced motion and data-saving preferences are respected. Visitors can pause effects too.',
  pauseEffects: 'Pause effects',
  playEffects: 'Play effects',
  timing: 'Choose the moment',
  now: 'Start immediately',
  schedule: 'Schedule a start',
  startsAt: 'Starts at',
  endsAt: 'Ends at (optional)',
  timezone:
    'All dates and times use Sri Lanka time (UTC+05:30). The store returns to Default when the theme ends.',
  save: 'Save theme',
  saving: 'Saving theme…',
  saved: 'Seasonal theme saved.',
  scheduled: 'Theme scheduled. Default will apply until the start time.',
  reset: 'Restore default',
  restoreTitle: 'Restore the everyday look?',
  restoreDescription:
    'The current seasonal selection and its schedule will be cleared.',
  defaultHint:
    'Default keeps the current appearance and removes seasonal greetings and decorations.',
  loadError: 'Unable to load seasonal settings. Please try again.',
  saveError: 'Unable to save the seasonal theme. Please try again.',
  invalidDates:
    'Choose a valid start and end time. The end must be in the future and after the start.',
  current: 'Live in your store',
  awaiting: 'Scheduled',
  ended: 'Ended',
  inactive: 'Everyday look',
  lightPreview: 'Light preview',
  darkPreview: 'Dark preview',
  browse: 'Explore products',
  greetingLabel: 'Seasonal greeting',
  versionHint:
    'Another admin may have updated the theme. Reload to see their changes.',
} as const;
