import { Link, useParams } from 'react-router-dom';

function ProductDetailPlaceholder() {
  const { id } = useParams();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
        <Link
          to="/products"
          className="mb-6 inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Products
        </Link>

        <h1 className="text-2xl font-bold text-slate-900">
          Product Detail
        </h1>

        <p className="mt-4 text-sm text-slate-600">
          Product ID:
        </p>

        <p className="mt-1 break-all rounded-lg bg-slate-100 p-3 font-mono text-sm text-slate-700">
          {id}
        </p>

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            Product detail page will be implemented in the next ticket.
          </p>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailPlaceholder;