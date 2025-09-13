import React from "react";
import CustomizeFeed from "../articles/CustomizeFeed";
import { Container, Header } from "./Swiper.sc";
import ArticleBrowser from "../articles/ArticleBrowser";
import ArticleSwipeBrowser from "../articles/ArticleSwipeBrowser";

export default function Swiper() {
  return (
    <Container>
      <Header>
        <CustomizeFeed currentMode="swiper" />
      </Header>

      <ArticleBrowser />
    </Container>
  );
}