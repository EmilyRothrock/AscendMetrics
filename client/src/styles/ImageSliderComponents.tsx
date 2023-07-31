import styled from 'styled-components';


export const ImageContainer = styled.div`
    width: clamp(100%, 100%, 100%);
    min-width: 50vh;
    margin:0 auto;
    position: relative;
    
`;

export const SlideStyles = styled.div`
    width: 100%;
    min-width: 50vh;
    aspect-ratio: 16/9;
    margin:0 auto;
    border-radius: 10px;
    background-position: center;
    background-size: cover;
    background-image: url(${(props) => props.image});
`;
export const RightArrowStyles = styled.div`
    position: absolute;
    top: 50%;
    transform: translate(0,-50%);
    right: 32px;
    font-size: 45px;
    color: black;
    z-index:1;
    cursor: pointer;

`;

export const LeftArrowStyles = styled.div`
    position: absolute;
    top: 50%;
    transform: translate(0,-50%);
    left: 32px;
    font-size: 45px;
    color: black;
    z-index:1;
    cursor: pointer;
    
`;

export const DotsContainerStyles = styled.div `
    display: flex;
    justify-content: center;
`;

export const DotStyle = styled.div`
    margin: 0 3px;
    cursor: pointer;
    font-size: 20px;
    color: white;
`;