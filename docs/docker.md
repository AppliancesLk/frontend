# Frontend container

Build from the frontend repository root:

```powershell
docker build --build-arg VITE_API_URL=/api -t applianceslk-frontend:local .
```

The first stage compiles React/TypeScript with Vite on Node.js 24. The final image
contains only Nginx and the generated static files, and listens on port 80.

## Why nginx.conf exists

Vite's development server is not used in the final image. Nginx serves the built
HTML, CSS and JavaScript, and `nginx.conf` defines these behaviors:

- Return `index.html` for React Router paths so refreshing `/products` works.
- Proxy `/api/*` to `http://backend:3000/*`, removing the `/api` prefix.
- Proxy `/socket.io/*` with WebSocket upgrade support for live support chat.
- Cache generated assets and allow the backend's image uploads through the proxy.
- Expose `/healthz` for the frontend container health check.

The backend hostname is the Compose service name. Docker DNS is resolved at request
time, so the proxy can recover when the backend container is replaced.

The browser uses the frontend origin for API requests and chat. It never needs to
resolve Docker-only hostnames. Product/banner image URLs receive the `/api` prefix
through the existing image helpers.

`VITE_API_URL` is public **build-time** configuration, not a runtime secret. The
Docker build defaults to `/api`; the normal development `.env.example` continues to
use `http://localhost:3000`. Changing a Vite variable requires rebuilding the image;
putting it in the Nginx container's runtime environment will not update the bundle.
For this Nginx configuration, keep `/api` when using the bundled reverse proxy.

For deployment, terminate HTTPS at your ingress/reverse proxy and configure the
backend's `FRONTEND_URL` to match the public browser origin exactly.
