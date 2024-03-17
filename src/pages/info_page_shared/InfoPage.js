import * as s from "./InfoPage.sc";

export default function InfoPage({ children }) {
  return (
    <s.PageBackground>
      <s.PageContainer>
        <s.ContentWrapper>{children}</s.ContentWrapper>
      </s.PageContainer>
    </s.PageBackground>
  );
}
