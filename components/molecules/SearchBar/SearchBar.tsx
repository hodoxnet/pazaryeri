"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils/cn";

interface SearchBarProps {
  className?: string;
  defaultValue?: string;
}

export function SearchBar({ className, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();
  const t = useTranslations("common");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  const handleClear = useCallback(() => {
    setQuery("");
  }, []);

  return (
    <form
      onSubmit={handleSearch}
      className={cn("relative flex w-full max-w-xl", className)}
    >
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          rightIcon={
            query ? (
              <button
                type="button"
                onClick={handleClear}
                className="hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : undefined
          }
          className="rounded-r-none border-r-0"
        />
      </div>
      <Button
        type="submit"
        className="rounded-l-none"
        aria-label={t("search")}
      >
        <Search className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">{t("search")}</span>
      </Button>
    </form>
  );
}
