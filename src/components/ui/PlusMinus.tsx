/**
 * The open-and-close mark on a question (a <details> summary): a plus on a
 * little drawn marigold stone, whose upright folds flat into a minus when the
 * answer is open (.plus-minus in globals.css).
 */
export function PlusMinus() {
  return (
    <span aria-hidden="true" className="plus-minus drawn stone">
      <svg viewBox="0 0 16 16">
        <path d="M3 8h10" />
        <path d="M8 3v10" className="plus-minus-upright" />
      </svg>
    </span>
  );
}
