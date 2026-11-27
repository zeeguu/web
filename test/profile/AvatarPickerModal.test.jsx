import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { APIContext } from "../../src/contexts/APIContext";
import { UserContext } from "../../src/contexts/UserContext";
import AvatarPickerModal from "../../src/profile/AvatarPickerModal";

function renderModal({ userAvatar, saveUserDetailsImpl }) {
  const api = {
    saveUserDetails: vi.fn(saveUserDetailsImpl ?? ((_payload, _onErr, onSuccess) => onSuccess())),
  };
  const setUserDetails = vi.fn();
  const onClose = vi.fn();
  const userDetails = {
    username: "happy_leopard0",
    name: "Mircea",
    user_avatar: userAvatar,
  };

  render(
    <APIContext.Provider value={api}>
      <UserContext.Provider value={{ userDetails, setUserDetails }}>
        <AvatarPickerModal open={true} onClose={onClose} />
      </UserContext.Provider>
    </APIContext.Provider>,
  );

  return { api, setUserDetails, onClose };
}

describe("AvatarPickerModal", () => {
  it("opens on the tab matching the user's current avatar and switches tabs cleanly", async () => {
    const user = userEvent.setup();
    renderModal({
      userAvatar: {
        image_name: "watercolor-colibri",
        character_color: "#0D9488",
        background_color: "#CCFBF1",
      },
    });

    expect(screen.getByRole("tab", { name: "Watercolors" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Background")).toBeTruthy();

    await user.click(screen.getByRole("tab", { name: "Zeeguu" }));
    expect(screen.getByRole("tab", { name: "Zeeguu" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Color Theme")).toBeTruthy();
  });

  it("saves only avatar fields on pick and commits confirmed save to UserContext on close", async () => {
    const user = userEvent.setup();
    const { api, setUserDetails } = renderModal({
      userAvatar: {
        image_name: "giraffe",
        character_color: "#2563EB",
        background_color: "#DBEAFE",
      },
    });

    await user.click(screen.getByRole("button", { name: "Hippo" }));
    expect(api.saveUserDetails).toHaveBeenCalledWith(
      {
        avatar_image_name: "hippo",
        avatar_character_color: "#2563EB",
        avatar_background_color: "#DBEAFE",
      },
      expect.any(Function),
      expect.any(Function),
    );

    await user.click(screen.getByRole("button", { name: "Close Modal" }));
    expect(setUserDetails).toHaveBeenCalledTimes(1);
  });

  it("handles non-string Error objects from network failures without crashing or committing unsaved picks", async () => {
    const user = userEvent.setup();
    const { setUserDetails } = renderModal({
      userAvatar: {
        image_name: "giraffe",
        character_color: "#2563EB",
        background_color: "#DBEAFE",
      },
      saveUserDetailsImpl: (_payload, onError) => onError(new TypeError("Failed to fetch")),
    });

    await user.click(screen.getByRole("button", { name: "Colibri" }));
    expect(screen.getByRole("alert").textContent).toBe("Unable to save your avatar. Please try again.");

    await user.click(screen.getByRole("button", { name: "Close Modal" }));
    expect(setUserDetails).not.toHaveBeenCalled();
  });
});
