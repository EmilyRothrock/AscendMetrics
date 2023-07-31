import React from "react";

import {
  InfoContainer,
  TextDiv,
  PhotoDiv,
  InfoHeading,
  Infotext,
  InfoImageStyles,
} from "../../styles/Infocomponents";

import Training1 from "../../assets/Training1.jpg";
import Training2 from "../../assets/Training2.jpg";
import Training3 from "../../assets/Training3.jpg";
import Training4 from "../../assets/Training4.jpg";
import Training5 from "../../assets/Training5.jpg";

const InfoFlics = [Training1, Training2, Training3, Training4, Training5];

const InfoSection = ({ BackgroundColor, FontSize, Reverse, Margin, Flic, TextColor }) => {
  return (
    <InfoContainer
      BackgroundColor={BackgroundColor}
      FontSize={FontSize}
      Reverse={Reverse}
      Margin={Margin}
      
    >
      <TextDiv>
        <InfoHeading BackgroundColor={BackgroundColor} > This is an amazing feature </InfoHeading>
        <Infotext BackgroundColor={BackgroundColor}>
          This feature is so good. No other app on the market has it and it will completely
          revolutionarize your climbing and performace. Try it out now to get maximum gains. 
          Send it!
        </Infotext>
      </TextDiv>
      <PhotoDiv>
        <InfoImageStyles Flic={InfoFlics[Flic]} />
      </PhotoDiv>
    </InfoContainer>
  );
};

export default InfoSection;
