import styles from 'styled-components';


export const ImageContainer = styles.div`
    width: 500px;
    height: 280px;
    margin:0 auto;
    position: relative;
`;

export const SlideStyles = styles.div`
    width: 100%;
    height: 100%;
    margin:0 auto;
    border-radius: 10px;
    background-position: center;
    background-size: cover;
    background-image: url(${(props) => props.image});
`;
export const RightArrowStyles = styles.div`
    position: absolute;
    top: 50%;
    transform: translate(0,-50%);
    right: 32px;
    font-size: 45px;
    color: black;
    zIndex:1;
    cursor: pointer;

`;

export const LeftArrowStyles = styles.div`
    position: absolute;
    top: 50%;
    transform: translate(0,-50%);
    left: 32px;
    font-size: 45px;
    color: black;
    zIndex:1;
    cursor: pointer;
    
`;

export const DotsContainerStyles = styles.div `
    display: flex;
    justify-content: center;
`;

export const DotStyle = styles.div`
    margin: 0 3px;
    cursor: pointer;
    font-size: 20px;
    color: white;
`;