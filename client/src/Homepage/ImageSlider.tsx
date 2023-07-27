import React, { useState } from "react";

import {ImageContainer, 
  SlideStyles,
  RightArrowStyles,
  LeftArrowStyles,
  DotsContainerStyles,
  DotStyle
  } from '../styles/ImageSliderComponents'

import Training1 from "../assets/Training1.jpg";
import Training2 from "../assets/Training2.jpg";
import Training3 from "../assets/Training3.jpg";
import Training4 from "../assets/Training4.jpg";
import Training5 from "../assets/Training5.jpg";

const ImageSlider = () => {
  const slides = [
    { image: Training1, title: "beach" },
    { image: Training2, title: "boat" },
    { image: Training3, title: "forest" },
    { image: Training4, title: "city" },
    { image: Training5, title: "italy" },
  ];

  const [currIndex, setCurrIndex] = useState(0);

  const currentSlide = slides[currIndex].image;

  const GoBack = () => {
    const newIndex = currIndex === 0 ? slides.length - 1 : currIndex - 1;
    setCurrIndex(newIndex);
  };

  const GoNext = () => {
    const newIndex = currIndex === slides.length - 1 ? 0 : currIndex + 1;
    setCurrIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrIndex(slideIndex);
  };

  return (
    <ImageContainer>
      <LeftArrowStyles onClick={GoBack}> ❰ </LeftArrowStyles>
      <RightArrowStyles onClick={GoNext}> ❱ </RightArrowStyles>
      <SlideStyles image={currentSlide} />

    <DotsContainerStyles>
        {slides.map((slide, slideIndex) => (
          <DotStyle key={slideIndex}  onClick={() => goToSlide(slideIndex)}>
            ●
          </DotStyle>
          ))}
    </DotsContainerStyles>



    </ImageContainer>
  );
};

export default ImageSlider;
