import { Link } from "react-router";

const Error = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-100 p-6">
      <title>Error - 404</title>
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="badge badge-error px-4 py-3 text-sm font-semibold text-error-content">
            404 — Page not found
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-base-content">Oops, nothing to see here.</h1>

        <p className="mb-6 text-base-content/70">
          The page you’re looking for doesn’t exist or may have moved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn btn-primary">
            Go back home
          </Link>
        </div>

        <div className="mt-8">
          <div className="mockup-code text-left text-white">
            <pre data-prefix=">">
              <code>Requested route: not found</code>
            </pre>
            <pre data-prefix="$">
              <code>Try navigating from the menu</code>
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Error;
