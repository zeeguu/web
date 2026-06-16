import * as s from "./CardPage.sc";

export default function CardPage({
  children,
  pageWidth,
  layoutVariant,
  isBackgroundFixed,
  isTransparent,
  reducedPadding,
}) {
  return (
    <s.PageBackdrop $layoutVariant={layoutVariant} $isBackgroundFixed={isBackgroundFixed}>
      <s.ContentCard
        $layoutVariant={layoutVariant}
        $pageWidth={pageWidth}
        $isTransparent={isTransparent}
        $reducedPadding={reducedPadding}
      >
        <s.ContentWrapper>{children}</s.ContentWrapper>
      </s.ContentCard>
    </s.PageBackdrop>
  );
}
