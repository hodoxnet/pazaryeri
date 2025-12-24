"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/molecules/ProductCard";
import type { Product, Category } from "@/types/product";
import { cn } from "@/lib/utils/cn";

interface Tab {
  id: number | "all";
  name: string;
}

interface CategoryProductTabsProps {
  products: Product[];
  categories: Category[];
  title: string;
  productsPerTab?: number;
}

export function CategoryProductTabs({
  products,
  categories,
  title,
  productsPerTab = 5,
}: CategoryProductTabsProps) {
  const [activeTab, setActiveTab] = useState<number | "all">("all");

  // "Tümü" + kategori tab'ları oluştur
  const tabs: Tab[] = [
    { id: "all", name: "Tümü" },
    ...categories.slice(0, 7).map((cat) => ({
      id: cat.id,
      name: cat.name,
    })),
  ];

  // Aktif tab'a göre ürünleri filtrele
  const filteredProducts =
    activeTab === "all"
      ? products.slice(0, productsPerTab)
      : products
          .filter((p) => p.parentCategoryId === activeTab)
          .slice(0, productsPerTab);

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-foreground">{title}</h2>

      {/* Tab Bar - Yatay scroll */}
      <div className="relative mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200",
                "border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:border-muted-foreground/30"
              )}
              aria-pressed={activeTab === tab.id}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Ürün Grid - Animasyonlu */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.05,
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Boş durum */}
      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center"
        >
          <p className="text-muted-foreground">Bu kategoride ürün bulunamadı</p>
        </motion.div>
      )}
    </section>
  );
}
