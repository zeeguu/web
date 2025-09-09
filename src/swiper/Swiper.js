import React from "react";
import CustomizeFeed from "../articles/CustomizeFeed";
import { Container, Header } from "./Swiper.sc";
import ArticleSwipeBrowser from "../articles/ArticleSwipeBrowser";

export default function Swiper() {
  return (
    <Container>
      <Header>
        <CustomizeFeed currentMode="swiper" />
      </Header>

      <ArticleSwipeBrowser />
      
      {/* <PlaceholderCard>
        <Title>Swipe Mode</Title>
        <Description>
          Experience a new way to browse articles with our swipe interface. 
          Swipe right to save articles for later, swipe left to skip.
        </Description>
        <ComingSoon>Coming Soon</ComingSoon>
      </PlaceholderCard> */}
    </Container>
  );
}