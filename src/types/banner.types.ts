export const BANNER_POSITIONS = [
  'top',
  'middle',
  'bottom-one',
  'bottom-two',
] as const;
export type BannerPosition = (typeof BANNER_POSITIONS)[number];
export interface BannerSlide {
  imageUrl: string;
  alt: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
}
export interface BannerSection {
  position: BannerPosition;
  visible: boolean;
  slides: BannerSlide[];
}
