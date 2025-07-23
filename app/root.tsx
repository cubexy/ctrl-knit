import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Provider from "./components/layout/Provider";
import UIProvider from "./components/layout/UIProvider";

export function Layout({ children }: { children: React.ReactNode }) {
  const blockingScript = `(function() { const theme = window.localStorage.getItem('theme') || 'mylight'; document.documentElement.setAttribute('data-theme', theme); })();`;
  return (
    <html lang="en" suppressHydrationWarning>
      <Provider>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script>{blockingScript}</script>
          <Meta />
          <Links />
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body>
          <UIProvider>
            {children}
            <ScrollRestoration />
            <Scripts />
          </UIProvider>
        </body>
      </Provider>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
