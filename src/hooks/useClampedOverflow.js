import { useEffect, useState } from "react";

/**
 * Reports whether `ref`'s element has more content than its clamped box
 * can show — i.e. whether a "Show more" affordance is warranted.
 *
 * Measured with a ResizeObserver so the reading stays accurate across
 * async content swaps (e.g. plain text → tokenized), font swaps, and
 * viewport rotation. An inline ref callback or one-shot useEffect on mount
 * was where this lived inline in ArticlePreview before; it fired before
 * final layout in some cases and left the CSS `…` visible with no
 * Show-more behind it.
 *
 * @param {React.RefObject<HTMLElement>} ref - the clamped element
 * @param {object} [opts]
 * @param {boolean} [opts.enabled=true] - skip measurement (e.g. when the
 *   consumer has already expanded the box, so the clamp doesn't apply)
 * @param {unknown[]} [opts.deps=[]] - extra dependencies that should
 *   re-trigger measurement when they change (the ResizeObserver catches
 *   real layout shifts; deps catch content-identity changes that might
 *   not trip the observer, like swapping a plain string for a tokenized
 *   React tree of identical visible height).
 * @returns {boolean}
 */
export default function useClampedOverflow(ref, { enabled = true, deps = [] } = {}) {
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const overflowing = el.scrollHeight > el.clientHeight + 1;
      setOverflows((prev) => (prev === overflowing ? prev : overflowing));
    };
    measure();

    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return overflows;
}
