import styled from 'styled-components';

export const InfoContainer = styled.div`
    background-color: ${({ BackgroundColor }) => (BackgroundColor ? 'black' : 'wheat')};
    font-size: ${({ FontSize }) => (FontSize)};
    margin-top: ${({Margin}) => (Margin)};
    display: flex;
    flex-direction: ${({Reverse}) => (Reverse ? 'row-reverse' : 'row')};
    width: 100%;
    height: auto;
    align-items: center;
    justify-content: center;
    @media (max-width: 700px) {
        flex-direction: column;
        align-items: center;
  }
`;


export const TextDiv = styled.div`
  flex: 40%;
  text-align: center;
  height: auto;
  justify-content: center;
  margin: 10px;
`;

export const PhotoDiv = styled.div`
  flex: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 700px) {
        width: 90vw;

  }
`;

export const InfoHeading = styled.h2`
    color: ${({ BackgroundColor }) => (BackgroundColor ? 'wheat' : 'black')};
    font-size: 2.2rem;
    margin: 10px;
    font-weight: 500;
    @media (max-width: 700px) {
      font-size: 2rem;
  }
`;

export const Infotext = styled.h4`
    color: ${({ BackgroundColor }) => (BackgroundColor ? 'wheat' : 'black')};
    font-size: clamp(0.5rem, 1 rem, 1.5rem);
    font-weight: 300;
    @media (min-width: 700px) {
      font-size: 1.1rem;
  }
`;



export const InfoImageStyles = styled.div`
  height: auto;
  width: 100%;
  aspect-ratio: 16/9;
  margin: 10px;
  border-radius: 10px;
  background-position: center;
  background-size: cover;
  background-image: url(${props => props.Flic});
`;


