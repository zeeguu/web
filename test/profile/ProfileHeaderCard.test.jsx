import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileHeaderCard } from "../../src/profile/ProfileHeaderCard";

const BASE_PROFILE = {
  username: "happy_leopard0",
  name: "Mircea",
  created_at: null,
  user_avatar: {
    image_name: "giraffe",
    character_color: "#2563EB",
    background_color: "#DBEAFE",
  },
  friendship: null,
};

describe("ProfileHeaderCard inline username editing", () => {
  it("allows editing and saving username on own profile", async () => {
    const user = userEvent.setup();
    const onSaveUsername = vi.fn((_next, onSuccess) => onSuccess());

    render(
      <ProfileHeaderCard
        isOwnProfile={true}
        profileData={BASE_PROFILE}
        activeLanguages={[]}
        onOpenLanguagesModal={() => {}}
        onEditAvatar={() => {}}
        onSaveUsername={onSaveUsername}
        friendActionHandlers={{}}
        isPendingFriendAction={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Change username" }));
    const input = screen.getByRole("textbox", { name: "Username" });
    await user.clear(input);
    await user.type(input, "curious_giraffe{Enter}");

    expect(onSaveUsername).toHaveBeenCalledWith("curious_giraffe", expect.any(Function), expect.any(Function));
    expect(screen.queryByRole("textbox", { name: "Username" })).toBeNull();
  });

  it("shows server errors inline and cancels on Escape", async () => {
    const user = userEvent.setup();
    const onSaveUsername = vi.fn((_next, _onSuccess, onError) => onError("Username already in use"));

    render(
      <ProfileHeaderCard
        isOwnProfile={true}
        profileData={BASE_PROFILE}
        activeLanguages={[]}
        onOpenLanguagesModal={() => {}}
        onEditAvatar={() => {}}
        onSaveUsername={onSaveUsername}
        friendActionHandlers={{}}
        isPendingFriendAction={false}
      />,
    );

    await user.click(screen.getByText("happy_leopard0"));
    const input = screen.getByRole("textbox", { name: "Username" });
    await user.clear(input);
    await user.type(input, "taken_name{Enter}");

    expect(screen.getByText("Username already in use")).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("textbox", { name: "Username" })).toBeNull();
  });

  it("does not show inline username edit controls on another user's profile", () => {
    render(
      <ProfileHeaderCard
        isOwnProfile={false}
        profileData={BASE_PROFILE}
        activeLanguages={[]}
        onOpenLanguagesModal={() => {}}
        onEditAvatar={() => {}}
        onSaveUsername={vi.fn()}
        friendActionHandlers={{}}
        isPendingFriendAction={false}
      />,
    );

    expect(screen.queryByRole("button", { name: "Change username" })).toBeNull();
  });
});
