import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Truck, Shield, Headphones, ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/api/products";
import { getTopCategories } from "@/lib/api/categories";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { CategorySlider } from "@/components/organisms/CategorySlider";
import { CategoryProductTabs } from "@/components/organisms/CategoryProductTabs";
import { Button } from "@/components/atoms/Button";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("siteTitle"),
    description: t("siteDescription"),
  };
}

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const [products, categories] = await Promise.all([
    getFeaturedProducts(8),
    getTopCategories(10),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  {tc("products")}
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg">
                  {tc("allCategories")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {t("freeShipping")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("freeShippingDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {t("securePayment")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("securePaymentDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t("support")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("supportDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <CategorySlider
            categories={categories}
            title={t("featuredCategories")}
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {t("bestSellers")}
            </h2>
            <Link href="/products">
              <Button variant="ghost" rightIcon={<ArrowRight className="h-4 w-4" />}>
                {tc("viewAll")}
              </Button>
            </Link>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Discover by Category */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <CategoryProductTabs
            products={products}
            categories={categories}
            title={t("discoverByCategory")}
            productsPerTab={5}
          />
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Pazaryeri",
            url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/{locale}/products?search={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </div>
  );
}
