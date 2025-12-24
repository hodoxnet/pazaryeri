"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-primary">500</h1>
      <h2 className="mb-2 text-2xl font-semibold text-foreground">
        Bir Hata Oluştu
      </h2>
      <p className="mb-8 text-muted-foreground">
        Bir hata oluştu. Lütfen daha sonra tekrar deneyin.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
