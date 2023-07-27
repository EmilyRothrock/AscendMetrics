import styled from 'styled-components'
import {Link} from 'react-router-dom'

export const NavBackground = styled.nav`
    width: 100%;
    height: ${(props) => (props.extendNavBar ? "100vh": "80px")};
    background-color: lightblue;
    display: flex;
    flex-direction: column;

    @media (min-width: 700px) {
        height: 80px;
    }
`;  

export const LeftContainer = styled.div`
    flex: 33%;
    display: flex;
    justify-content:center;
    border-right: 5px solid #ccc;
    align-items: center;

    
`;
//remove colors on the left, right 
//and middle containers once entire nav bar is done

export const MidContainer = styled.div`
    flex: 33%;
    display: flex;
    justify-content: center;
    align-items: center;
    //border-left: 5px solid #ccc;   Doesnt need a border because other 2 have one
    //border-right: 5px solid #ccc;  Doesnt need a border because other 2 have one
`;

export const RightContainer = styled.div`
    flex: 33%;
    display: flex;
    justify-content: center;
    border-left: 5px solid #ccc;
    align-items: center;
`;

export const NavInner = styled.div `
    width: 100%;
    height: 80px;
    display: flex;

`;

export const NavLink = styled(Link)`
    font-family: 'Courier New', Courier, monospace;
    color: black;
    
    text-decoration: none;
    font-size: x-large;
    margin: 10px;
    
    @media (max-width: 700px) {
        display: none;
    }
`;

export const Logo = styled.img `
    margin: 10px;
    max-width:180 px;
    height: auto;
`;

export const SignUpButton = styled.button`
  
  padding: 10px 20px;
  font-size: 16px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  height: 50px;
  cursor: pointer;
`;

export const OpenLinksButton = styled.button`
    width: 70;
    height: 50px;
    background: none;
    border: none;
    color: white;
    font-size: 45px;
    cursor: pointer;

    @media (min-width: 700px) {
        display: none;
    }
`;

export const NavExtended = styled.div`
    display: flex;
    flex-direction: column; 
    align-items: center;

    @media (min-width: 700px){
        display:none;
    }
`;


export const NavLinkExtend = styled(Link)`
    font-family: 'Courier New', Courier, monospace;
    color: black;
    
    text-decoration: none;
    font-size: x-large;
    margin: 10px;

`;