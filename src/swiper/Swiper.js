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
    </Container>
  );
}