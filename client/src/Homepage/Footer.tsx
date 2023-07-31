import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #333;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterLogo = styled.img`
  width: 100px;
  height: auto;
  margin-bottom: 10px;
`;

const SocialLinks = styled.div`
  display: flex;
`;

const SocialLink = styled.a`
  color: white;
  margin: 0 10px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;



const Footer = () => {
    return (
      <FooterContainer>
        <FooterLogo src="/path/to/your/logo.png" alt="Logo" />
        <SocialLinks>
          <SocialLink href="https://www.instagram.com/your_instagram" target="_blank">
            Instagram
          </SocialLink>
          <SocialLink href="https://www.youtube.com/your_youtube" target="_blank">
            YouTube
          </SocialLink>
          {/* Add more social links here */}
        </SocialLinks>
        <a href="/contact">Contact</a> {/* Replace with the link to your contact page */}
      </FooterContainer>
    );
  };
  
  export default Footer;