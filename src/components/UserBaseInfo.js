import React from "react";
import AvatarArtwork from "../profile/AvatarArtwork";
import {
  validatedAvatarBackgroundColor,
  validatedAvatarCharacterColor,
  validatedAvatarCharacterId,
} from "../profile/avatarOptions";
import * as s from "./UserBaseInfo.sc";

// `subtitle` is an optional metadata line rendered under the username — used by
// friend search, where the auto-generated username and the display name are on
// their own not enough to tell two people apart.
export default function UserBaseInfo({ user, subtitle }) {
  const selectedAvatarCharacterId = validatedAvatarCharacterId(user?.avatar?.image_name);
  const selectedAvatarCharacterColor = validatedAvatarCharacterColor(user?.avatar?.character_color);
  const selectedAvatarBackgroundColor = validatedAvatarBackgroundColor(user?.avatar?.background_color);

  return (
    <>
      <s.Avatar $backgroundColor={selectedAvatarBackgroundColor}>
        <AvatarArtwork imageName={selectedAvatarCharacterId} color={selectedAvatarCharacterColor} decorative />
      </s.Avatar>
      <s.UserIdentity>
        <s.UserNameWrapper>
          <s.Username>{user?.username}</s.Username>
          {user?.name && <s.Name>({user.name})</s.Name>}
        </s.UserNameWrapper>
        {subtitle}
      </s.UserIdentity>
    </>
  );
}
