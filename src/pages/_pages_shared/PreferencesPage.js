import * as s from "./PreferencesPage.sc";

export default function PreferencesPage({
  children,
  pageWidth,
  layoutVariant,
  isBackgroundFixed,
}) {
  return (
    <s.PageBackground layoutVariant={layoutVariant} $isBackgroundFixed={isBackgroundFixed}>
      <s.PageContainer layoutVariant={layoutVariant} pageWidth={pageWidth}>
        <s.ContentWrapper>{children}</s.ContentWrapper>
      </s.PageContainer>
    </s.PageBackground>
  );
}
