import { useEffect, useRef, useState } from "react";

const usePopupStatus = (): boolean => {
  const [isWindowOpenerPopulated, setIsWindowOpenerPopulated] = useState(false);

  useEffect(() => {
    setIsWindowOpenerPopulated(!!window.opener);
  }, []);

  return isWindowOpenerPopulated;
};

export const useIsVisible = <T extends Element>() => {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element || isVisible) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "150px",
        threshold: 0.01,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible]);

  return { ref, isVisible };
};

export default usePopupStatus;
