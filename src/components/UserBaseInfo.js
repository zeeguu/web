import React, { useEffect, useState } from "react";
import { AvatarImage } from "../profile/UserProfile.sc";
import {
  AVATAR_IMAGE_MAP,
  validatedAvatarBackgroundColor,
  validatedAvatarCharacterColor,
  validatedAvatarCharacterId,
} from "../profile/avatarOptions";
import * as s from "./UserBaseInfo.sc";

export default function UserBaseInfo({ user }) {
  const [selectedAvatarCharacterId, setSelectedAvatarCharacterId] = useState();
  const [selectedAvatarCharacterColor, setSelectedAvatarCharacterColor] = useState();
  const [selectedAvatarBackgroundColor, setSelectedAvatarBackgroundColor] = useState();

  useEffect(() => {
    if (user) {
      setSelectedAvatarCharacterId(validatedAvatarCharacterId(user.avatar?.image_name));
      setSelectedAvatarCharacterColor(validatedAvatarCharacterColor(user.avatar?.character_color));
      setSelectedAvatarBackgroundColor(validatedAvatarBackgroundColor(user.avatar?.background_color));
    }
  }, [user]);

  return (
    <>
      <s.Avatar $backgroundColor={selectedAvatarBackgroundColor}>
        <AvatarImage $imageSource={AVATAR_IMAGE_MAP[selectedAvatarCharacterId]} $color={selectedAvatarCharacterColor} />
      </s.Avatar>
      <s.UserNameWrapper>
        <s.Username>{user?.username}</s.Username>
        {user?.name && <s.Name>({user.name})</s.Name>}
      </s.UserNameWrapper>
    </>
  );
}
