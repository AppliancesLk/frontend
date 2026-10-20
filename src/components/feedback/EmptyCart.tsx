import { EmptyState } from '../ui/Feedback';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
const t = translations.cart;
export function EmptyCart() {
  return (
    <EmptyState
      title={t.empty}
      description={t.emptyDescription}
      action={
        <Link to={ROUTES.products} className="auth-primary mt-6">
          {translations.common.continueShopping}
        </Link>
      }
      icon="bag"
    />
  );
}
