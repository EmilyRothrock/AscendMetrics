import { interpolateRainbow } from "d3";

export function activityNameToColor(str: string) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i);
    }
    const normValue = sum % 1000 / 1000; // Normalize to 0-1
    return interpolateRainbow(normValue);
  }