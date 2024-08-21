import * as s from "./InfoPage.sc";

export default function InfoPage({ children, type, pageLocation }) {
  return (
    <s.PageBackground pageLocation={pageLocation}>
      <s.PageContainer type={type}>
        <s.ContentWrapper>{children}</s.ContentWrapper>
      </s.PageContainer>
    </s.PageBackground>
  );
}
