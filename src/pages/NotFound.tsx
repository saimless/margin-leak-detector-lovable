import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-10 sm:px-6">
      <div className="w-full max-w-md rounded-[1.5rem] border border-border bg-card px-6 py-8 text-center shadow-premium sm:px-8">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">404</h1>
        <p className="mb-4 text-lg text-muted-foreground sm:text-xl">Oops! Page not found</p>
        <a href="/" className="text-primary underline underline-offset-4 hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </main>
  );
};

export default NotFound;
