"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types/product";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <motion.div
      className={cn("group", className)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/categories/${category.slug}`}
        className="block text-center"
      >
        <div className="relative mx-auto aspect-square w-20 overflow-hidden rounded-full border-2 border-border bg-muted transition-colors group-hover:border-primary sm:w-24">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl">
              📦
            </div>
          )}
        </div>
        <p className="mt-2 text-xs font-medium text-foreground group-hover:text-primary sm:text-sm">
          {category.name}
        </p>
      </Link>
    </motion.div>
  );
}
