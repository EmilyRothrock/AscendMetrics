import React, {useState} from 'react';
import { NavBackground, 
    LeftContainer, 
    MidContainer, 
    RightContainer, 
    NavInner, 
    NavExtended,
    NavLink,
    Logo,
    SignUpButton,
    OpenLinksButton,
    NavLinkExtend
    } from '../styles/Homecomponents.tsx'

import Logoimg from '../assets/react.svg';


 function Home(){

    const [extendNavBar, setExtendNavBar] = useState(false)

    return (
    <NavBackground extendNavBar = {extendNavBar}>
        <NavInner>
            <LeftContainer> 
                <OpenLinksButton onClick = 
                {() => {setExtendNavBar((curr) => !curr)}}> 
                 {extendNavBar ? <> &#10005; </> : <> &#8801; </>} 
                </OpenLinksButton>
                <Logo src = {Logoimg}/>
            </LeftContainer>
            <MidContainer>
                <NavLink to= "/"> Home </NavLink>
                <NavLink to= "about us"> About </NavLink>
                <NavLink to= "contact us"> Contact </NavLink>
            </MidContainer>
            <RightContainer>
            <SignUpButton>Sign Up</SignUpButton>
            </RightContainer>
        </NavInner>

        {extendNavBar && (

        <NavExtended>
            <NavLinkExtend to= "/"> Home </NavLinkExtend>
            <NavLinkExtend to= "about us"> About </NavLinkExtend>
            <NavLinkExtend to= "contact us"> Contact </NavLinkExtend>
        </NavExtended>
        )}

    </NavBackground>
    )
}
  
export default Home;