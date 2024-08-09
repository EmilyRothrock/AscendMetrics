import { MutableRefObject, useEffect, useState } from "react";

export const useResizeObserver = (targetRef: MutableRefObject<HTMLDivElement>, defaults?: { height?: number, width?: number}) => {
    const initializationValue = defaults ? { height: defaults.height ? defaults.height : 100, width: defaults.width ? defaults.width : 100,} : null;
    const [dimensions, setDimensions] = useState(initializationValue);
    useEffect(() => {
        const observeTarget = targetRef.current;
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
            setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height});
            });
        });
        resizeObserver.observe(observeTarget);
        return () => {
            resizeObserver.unobserve(observeTarget);
        };
    }, [targetRef]);
    return dimensions;
};