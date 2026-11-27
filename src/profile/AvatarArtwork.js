import styled from "styled-components";
import { getAvatarOption, validatedAvatarCharacterColor } from "./avatarOptions";
import { AvatarImage } from "./UserProfile.sc";
import ZeeguuLogoAvatar from "./ZeeguuLogoAvatar";

const IllustratedAvatarImg = styled.img`
  width: 96%;
  height: 96%;
  border-radius: 50%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
`;

const ZeeguuAvatarWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export default function AvatarArtwork({ imageName, color, decorative = false }) {
  const option = getAvatarOption(imageName);
  const safeColor = validatedAvatarCharacterColor(color);

  if (option.kind === "image") {
    return <IllustratedAvatarImg src={option.src} alt={decorative ? "" : option.label} aria-hidden={decorative || undefined} />;
  }

  if (option.kind === "zeeguu") {
    return (
      <ZeeguuAvatarWrapper aria-hidden={decorative || undefined}>
        <ZeeguuLogoAvatar layers={option.layers} color={safeColor} label={decorative ? "" : option.label} decorative={decorative} />
      </ZeeguuAvatarWrapper>
    );
  }

  return <AvatarImage $imageSource={option.src} $color={safeColor} aria-hidden={decorative || undefined} />;
}
