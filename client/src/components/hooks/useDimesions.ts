import { MutableRefObject, useEffect, useLayoutEffect, useState } from "react";

export const useDimensions = (
  targetRef: MutableRefObject<HTMLDivElement>,
  defaults: { height: number; width: number }
) => {
  const getDimensions = () => {
    return {
      width: targetRef.current ? targetRef.current.offsetWidth : defaults.width,
      height: targetRef.current
        ? targetRef.current.offsetHeight
        : defaults.height,
    };
  };

  const [dimensions, setDimensions] = useState(getDimensions);
  console.log("Initial", dimensions);

  const handleResize = () => {
    setDimensions(getDimensions());
    console.log("Just resized!", dimensions);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    console.log("Resopnding to layout effect!");
    handleResize();
  }, []);

  return dimensions;
};
