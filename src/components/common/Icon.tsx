const paths = {
  phone:
    'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 3h4m-3 14h2',
  laptop: 'M5 3h14v13H5ZM2 20h20l-3-4H5Z',
  headphones: 'M3 14v-3a9 9 0 0 1 18 0v3M3 12h4v9H3ZM17 12h4v9h-4Z',
  watch: 'm8 7 1-5h6l1 5m-8 10 1 5h6l1-5M7 7h10v10H7Z',
  appliance:
    'M5 2h14v20H5ZM5 7h14M8 4h1m2 0h1m5 9a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
  filter: 'M4 6h16M7 12h10M10 18h4',
  home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
  cart: 'M3 3h2l3 12h11l3-9H6M9 21h.01M19 21h.01',
  orders: 'M6 3h12v18l-3-2-3 2-3-2-3 2ZM9 7h6M9 11h6',
  repair: 'm14 7 3 3 4-4a7 7 0 0 1-9 9l-6 6-3-3 6-6a7 7 0 0 1 9-9Z',
  user: 'M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  grid: 'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z',
  check: 'm5 12 4 4L19 6',
} as const;
export type IconName = keyof typeof paths;
export function Icon({
  name,
  className = 'h-5 w-5',
}: {
  name: keyof typeof paths;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}
