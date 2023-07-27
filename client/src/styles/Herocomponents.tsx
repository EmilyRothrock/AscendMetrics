import styled from 'styled-components';


export const HeroContainer = styled.div`
    background: black;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 30px;
    height: 100vh;
    position: relative;
    z-index: 1;

`;


export const LeftContainer = styled.div`
    flex: 40%;
    display: flex;
    justify-content: left;
    background:#747474;
    align-items: left;
    flex-direction: column;
`

export const RightContainer = styled.div`
    flex: 60%;
    display: flex;
    justify-content:center;
    background:#747474;
    align-items: center;
`

export const HeroHeading = styled.h1`
    color: blue;
    font-family: 'Courier New', Courier, monospace;
    font-size: 60px;
`;

export const HeroDescription = styled.h3`
    color: lightsalmon;
    font-family: 'Courier New', Courier, monospace;
`;