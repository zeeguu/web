import * as s from "./NavOption.sc";

export default function NavOption({
  linkTo,
  icon,
  isOnStudentSide = true,
  isCollapsed = false,
  text,
  title,
  isButton = false,
  onClick,
  currentPath,
  className,
}) {
  const content = (
    <>
      <s.IconContainer isCollapsed={isCollapsed} title={title ? title : text}>
        {icon}
      </s.IconContainer>
      <s.Span visibility={isCollapsed}>{text}</s.Span>
    </>
  );

  return (
    <s.NavOption
      isActive={currentPath && currentPath.includes(linkTo)}
      isOnStudentSide={isOnStudentSide}
      className={className}
    >
      {!isButton ? (
        <s.RouterLink to={linkTo}>{content}</s.RouterLink>
      ) : (
        <s.OptionButton onClick={onClick}>{content}</s.OptionButton>
      )}
    </s.NavOption>
  );
}
