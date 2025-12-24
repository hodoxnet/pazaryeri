import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-foreground">
        Sayfa Bulunamadı
      </h2>
      <p className="mb-8 text-muted-foreground">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
