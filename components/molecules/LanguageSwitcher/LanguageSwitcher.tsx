"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/atoms/Button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === "tr" ? "en" : "tr";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-1.5"
      aria-label={`Switch to ${locale === "tr" ? "English" : "Türkçe"}`}
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase">{locale === "tr" ? "EN" : "TR"}</span>
    </Button>
  );
}
