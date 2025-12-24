"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils/cn";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-8 w-8 rounded-r-none"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-10 text-center text-sm font-medium">{value}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-8 w-8 rounded-l-none"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
