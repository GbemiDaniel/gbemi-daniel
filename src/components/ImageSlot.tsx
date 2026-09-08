import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./ImageSlot.module.css";

type Shape = "rect" | "rounded" | "circle" | "pill";

function radiusFor(shape: Shape, radius?: number) {
  if (shape === "circle") return "50%";
  if (shape === "pill") return "9999px";
  if (shape === "rounded") return `${radius ?? 12}px`;
  return "0";
}

/**
 * Renders a real image when `src` is provided; otherwise renders an
 * on-brand placeholder (no external network dependency) labelled with
 * `placeholder`, ready to be swapped for a real asset later.
 */
export default function ImageSlot({
  src,
  alt,
  placeholder,
  shape = "rounded",
  radius,
  style,
  className,
  sizes = "100vw",
  priority,
}: {
  src?: string;
  alt: string;
  placeholder?: string;
  shape?: Shape;
  radius?: number;
  style?: CSSProperties;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: radiusFor(shape, radius),
        ...style,
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div className={styles.placeholder}>
          <svg
            className={styles.placeholderIcon}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M21 15l-5-5-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.placeholderLabel}>{placeholder ?? alt}</span>
        </div>
      )}
    </div>
  );
}
