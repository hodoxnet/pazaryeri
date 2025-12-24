import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProductBySlug, getRelatedProducts } from "@/lib/api/products";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { Price } from "@/components/atoms/Price";
import { Badge } from "@/components/atoms/Badge";
import { AddToCartButton } from "./AddToCartButton";
import { FavoriteButton } from "./FavoriteButton";

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const variant = product.variants[0];
  const thumbnail = variant?.thumbnails[0];

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: thumbnail ? [{ url: thumbnail.url, alt: product.name }] : [],
      type: "website",
    },
  };
}

export const revalidate = 1800; // ISR: Revalidate every 30 minutes

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("product");
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const variant = product.variants[0];
  const thumbnail = variant?.thumbnails[0];
  const relatedProducts = await getRelatedProducts(
    product.id,
    product.parentCategoryId,
    4
  );

  const hasDiscount =
    variant?.originalPrice && variant.originalPrice > variant.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {thumbnail ? (
            <Image
              src={thumbnail.url}
              alt={thumbnail.alt || product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {hasDiscount && (
            <Badge variant="danger" className="absolute left-4 top-4">
              İndirim
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {product.name}
          </h1>

          {variant && (
            <div className="mt-4">
              <Price
                price={variant.price}
                originalPrice={variant.originalPrice}
                size="lg"
              />
            </div>
          )}

          {variant && (
            <div className="mt-4">
              {variant.stock > 0 ? (
                <Badge variant="success">{t("inStock")}</Badge>
              ) : (
                <Badge variant="danger">{t("outOfStock")}</Badge>
              )}
            </div>
          )}

          {/* Variant Options */}
          {variant?.options && variant.options.length > 0 && (
            <div className="mt-6 space-y-4">
              {variant.options.map((option, index) => (
                <div key={index}>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {option.title}
                  </label>
                  <div className="inline-flex rounded-lg border border-border px-4 py-2 text-sm">
                    {option.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-4">
            <AddToCartButton product={product} variant={variant} />
            <FavoriteButton productId={product.id} />
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              {t("description")}
            </h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* SKU */}
          {variant && (
            <div className="mt-6 text-sm text-muted-foreground">
              <p>
                {t("sku")}: {variant.sku}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            {t("relatedProducts")}
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}

      {/* JSON-LD Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: thumbnail?.url,
            sku: variant?.sku,
            offers: variant
              ? {
                  "@type": "Offer",
                  price: variant.price,
                  priceCurrency: "TRY",
                  availability:
                    variant.stock > 0
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                }
              : undefined,
          }),
        }}
      />
    </div>
  );
}
