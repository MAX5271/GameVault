import { useCallback, useEffect, useRef, useState } from "react";

const useHorizontalScroll = (deps = []) => {
  const ref = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    updateScrollState();
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateScrollState, ...deps]);

  const scrollLeft = useCallback(() => {
    ref.current?.scrollBy({ left: -ref.current.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    ref.current?.scrollBy({ left: ref.current.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  return { ref, canScrollLeft, canScrollRight, scrollLeft, scrollRight };
};

export default useHorizontalScroll;
