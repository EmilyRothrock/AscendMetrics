import { RefObject, useEffect, useState } from "react";

export const useResizeObserver = (
  targetRef: RefObject<HTMLDivElement>,
  defaults?: { height?: number; width?: number }
) => {
  const initializationValue = defaults
    ? {
        height: defaults.height ?? 100,
        width: defaults.width ?? 100,
      }
    : null;

  const [dimensions, setDimensions] = useState(initializationValue);

  useEffect(() => {
    const observeTarget = targetRef.current;
    if (!observeTarget) return; // Ensure the target is not null

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });
    });

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [targetRef]);

  return dimensions;
};
