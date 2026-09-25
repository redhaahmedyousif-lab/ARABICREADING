"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
  label: string;
}

export function StarRating({ value, onChange, readOnly, size = "md", label }: StarRatingProps) {
  const iconSize = size === "sm" ? "size-3.5" : "size-5";

  if (readOnly) {
    return (
      <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${label}: ${value} من 5`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={cn(iconSize, value >= star ? "fill-warning text-warning" : "text-border-strong")} aria-hidden />
        ))}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-0.5" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} من 5`}
          onClick={() => onChange?.(star)}
          className="cursor-pointer rounded p-0.5 transition-transform duration-150 hover:scale-125"
        >
          <Star className={cn(iconSize, value >= star ? "fill-warning text-warning" : "text-border-strong")} aria-hidden />
        </button>
      ))}
    </div>
  );
}
