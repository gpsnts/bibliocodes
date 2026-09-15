import logoAsset from "@/assets/bibliocodes-logo.png";
import symbolAsset from "@/assets/bibliocodes-symbol.png";

type BrandMarkProps = {
  symbolOnly?: boolean;
  className?: string;
};

export function BrandMark({ symbolOnly = false, className }: BrandMarkProps) {
  return (
    <img
      src={symbolOnly ? symbolAsset : logoAsset}
      alt={symbolOnly ? "" : "Bibliocodes"}
      aria-hidden={symbolOnly ? true : undefined}
      className={className}
    />
  );
}
