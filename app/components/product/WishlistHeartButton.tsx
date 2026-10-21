interface WishlistHeartButtonProps {
  productId: number;
  className: string;
  ariaLabel: string;
  onClick: () => void;
  /** Outline colour variant (Twig passes `dark`, or `danger` once saved). */
  color?: 'light' | 'dark' | 'danger';
}

/** `SallaButton`'s icon markup, but keeping `data-id` like Twig's `<salla-button>`: wishlist apps find the heart by it. */
export function WishlistHeartButton({
  productId,
  className,
  ariaLabel,
  onClick,
  color = 'light',
}: WishlistHeartButtonProps) {
  return (
    <div className="s-button-wrap">
      <button
        type="button"
        className={`s-button-element s-button-icon s-button-outline s-button-${color}-outline s-button-loader-center ${className}`}
        data-id={productId}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        <span className="s-button-text">
          <i className="sicon-heart" />
        </span>
      </button>
    </div>
  );
}
