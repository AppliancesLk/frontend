import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { BrandLogo } from '../common/BrandLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { Icon, type IconName } from '../common/Icon';
const trust: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'truck',
    title: 'Islandwide delivery',
    description: 'From our store to your door.',
  },
  {
    icon: 'shield',
    title: 'Shop with confidence',
    description: 'Clear prices. Clear availability.',
  },
  {
    icon: 'repair',
    title: 'Care beyond the purchase',
    description: 'Request and track device repairs.',
  },
  {
    icon: 'chat',
    title: 'A little help, anytime',
    description: 'Leave a message for our team.',
  },
];
export function SiteFooter() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const customer = !user || user.role === 'CUSTOMER';
  const checkout = pathname === ROUTES.checkout;
  const repairRoute =
    user?.role === 'ADMIN'
      ? ROUTES.adminRepairs
      : user?.role === 'REPAIRER'
        ? ROUTES.repairerRepairs
        : ROUTES.repairRequest;
  const supportRoute =
    user?.role === 'ADMIN'
      ? ROUTES.adminChat
      : user?.role === 'REPAIRER'
        ? ROUTES.repairerRepairs
        : ROUTES.liveChat;
  const groups = [
    {
      title: 'Shop',
      links: [
        [ROUTES.products, 'All products'],
        [ROUTES.home, 'Discover Appliances.lk'],
      ],
    },
    {
      title: 'Repairs',
      links: [
        [repairRoute, customer ? 'Request a repair' : 'Manage repairs'],
        [customer ? ROUTES.repairs : repairRoute, 'Repair status'],
      ],
    },
    {
      title: 'Account',
      links: [
        [ROUTES.account, 'Your account'],
        [
          customer
            ? ROUTES.orders
            : user?.role === 'ADMIN'
              ? ROUTES.admin
              : ROUTES.repairer,
          customer ? 'Your orders' : 'Your workspace',
        ],
        ...(!user
          ? [
              [ROUTES.login, 'Sign in'],
              [ROUTES.register, 'Create account'],
            ]
          : []),
      ],
    },
  ];
  return (
    <footer className="site-footer">
      {!checkout && (
        <>
          <div className="footer-trust shell-wide">
            {trust.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <Icon name={item.icon} className="h-6 w-6 shrink-0" />
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs leading-5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="footer-columns shell-wide">
            <div className="footer-brand">
              <Link to={ROUTES.home} aria-label="Appliances.lk home">
                <BrandLogo inverse />
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-7">
                Good technology for everyday life. Appliances, electronics and a
                helping hand when you need it.
              </p>
            </div>
            {groups.map((group) => (
              <details key={group.title} className="footer-link-group" open>
                <summary>
                  {group.title}
                  <span className="md:hidden">+</span>
                </summary>
                <ul>
                  {group.links.map(([path, label]) => (
                    <li key={`${path}-${label}`}>
                      <Link to={path}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            <div className="footer-contact">
              <h2>Let’s talk</h2>
              <p className="mt-3 text-sm leading-7">
                Need a hand choosing, ordering or repairing a device?
              </p>
              <Link
                to={supportRoute}
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
              >
                <Icon name="chat" />
                Chat with us
              </Link>
            </div>
          </div>
        </>
      )}
      <div className="footer-bottom shell-wide">
        <p className="text-xs">
          © {new Date().getFullYear()} Appliances.lk. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs">Make yourself at home</span>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
