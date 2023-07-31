import styled from 'styled-components';


export const HeroContainer = styled.div`
    background: wheat;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 30px;
    height: 500px;
    top: 80px;
    position: relative;
    
    @media (max-width: 700px) {
        flex-direction: column;
  }

`;


export const LeftContainer = styled.div`
    flex: 40%;
    display: flex;
    justify-content: left;
    background: transparent;
    align-items: left;
    flex-direction: column;
    @media (max-width: 700px) {
        width: 85vw;
  }
`

export const RightContainer = styled.div`
    flex: 60%;
    display: flex;
    justify-content:center;
    background:transparent;
    align-items: center;
    @media (max-width: 700px) {
        width: 85vw;
  }
`

export const HeroHeading = styled.h1`
    color: blue;
    font-size: clamp(1.5rem, 8vw, 3rem);
    font-weight: 800;
    margin: 10px;
`;

export const HeroDescription = styled.h3`
    color: lightsalmon;
    font-weight: 400;
    margin: 10px;
`;