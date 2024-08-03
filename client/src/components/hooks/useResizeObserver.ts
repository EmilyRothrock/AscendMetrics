import { MutableRefObject, useEffect, useState } from "react";

export const useResizeObserver = (targetRef: MutableRefObject<HTMLDivElement>, defaults: { height: number, width: number}) => {
    const [dimensions, setDimensions] = useState(defaults);
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