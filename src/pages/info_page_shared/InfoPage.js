import * as s from "./InfoPage.sc";

export default function InfoPage({ children, type }) {
  return (
    <s.PageBackground>
      <s.PageContainer type={type}>
        <s.ContentWrapper>{children}</s.ContentWrapper>
      </s.PageContainer>
    </s.PageBackground>
  );
}
