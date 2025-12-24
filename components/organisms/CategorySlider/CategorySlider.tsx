"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { CategoryCard } from "@/components/molecules/CategoryCard";
import { Button } from "@/components/atoms/Button";
import type { Category } from "@/types/product";
import { cn } from "@/lib/utils/cn";

interface CategorySliderProps {
  categories: Category[];
  title?: string;
  className?: string;
}

export function CategorySlider({
  categories,
  title,
  className,
}: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className={cn("relative", className)}>
      {title && (
        <h2 className="mb-4 text-xl font-bold text-foreground">{title}</h2>
      )}

      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full shadow-md lg:flex"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto pb-4"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full shadow-md lg:flex"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
