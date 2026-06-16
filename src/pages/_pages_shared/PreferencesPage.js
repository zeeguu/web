import * as s from "./PreferencesPage.sc";

export default function PreferencesPage({
  children,
  pageWidth,
  layoutVariant,
  isBackgroundFixed,
  hideBackground,
  reducedPadding,
}) {
  return (
    <s.PageBackground
      $layoutVariant={layoutVariant}
      $isBackgroundFixed={isBackgroundFixed}
      $hideBackground={hideBackground}
    >
      <s.PageContainer
        $layoutVariant={layoutVariant}
        $pageWidth={pageWidth}
        $hideBackground={hideBackground}
        $reducedPadding={reducedPadding}
      >
        <s.ContentWrapper>{children}</s.ContentWrapper>
      </s.PageContainer>
    </s.PageBackground>
  );
}
