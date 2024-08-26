import * as s from "./InfoPage.sc";

export default function InfoPage({ children, pageWidth, layoutVariant }) {
  return (
    <s.PageBackground layoutVariant={layoutVariant}>
      <s.PageContainer layoutVariant={layoutVariant} pageWidth={pageWidth}>
        <s.ContentWrapper>{children}</s.ContentWrapper>
      </s.PageContainer>
    </s.PageBackground>
  );
}
