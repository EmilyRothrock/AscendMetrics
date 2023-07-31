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
        <HeroDescription> 
          Welcome your all in one training, tracking destination. 
          This is the way to get strong, injury free.
          Scroll down to learn more, and sign up to get started!

        </HeroDescription>
      </LeftContainer>
      <RightContainer>
        <ImageSlider />
      </RightContainer>
    </HeroContainer>
  );
}
