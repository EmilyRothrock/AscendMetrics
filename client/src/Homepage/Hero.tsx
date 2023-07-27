import React from "react";
import ImageSlider from "./ImageSlider";
import {
  LeftContainer,
  RightContainer,
  HeroHeading,
  HeroContainer,
  HeroDescription,
} from "../styles/Herocomponents";

export default function Hero() {
  return (
    <HeroContainer>
      <LeftContainer>
        <HeroHeading> AscendMetrics </HeroHeading>
        <HeroDescription> Use this website to get strong</HeroDescription>
      </LeftContainer>
      <RightContainer>
        <ImageSlider />
      </RightContainer>
    </HeroContainer>
  );
}
