import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AvatarBackground, AvatarImage } from "./UserProfile.sc";
import { AVATAR_IMAGE_MAP, validatedAvatarBackgroundColor, validatedAvatarCharacterColor, validatedAvatarCharacterId } from "./avatarOptions";

const Avatar = styled(AvatarBackground)`
  width: 2.5rem;
  height: 2.5rem;
  padding: 3px;
`;

const Username = styled.span`
  font-weight: 600;
  margin-left: 0.5rem;
`;

const Name = styled.span`
  margin-left: 0.25rem;
  color: #777;
`;

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
      <Avatar $backgroundColor={selectedAvatarBackgroundColor}>
        <AvatarImage
          $imageSource={AVATAR_IMAGE_MAP[selectedAvatarCharacterId]}
          $color={selectedAvatarCharacterColor}
        />
      </Avatar>
      <Username>{user?.username}</Username>
      {user?.name && <Name>({user.name})</Name>}
    </>
  );
}