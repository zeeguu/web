import { useCallback, useContext } from "react";
import { APIContext } from "../contexts/APIContext";

async function extractFriendActionError(response, fallbackMessage) {
  try {
    const payload = await response.json();
    return payload?.error || payload?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export default function useFriendActions() {
  const api = useContext(APIContext);

  const executeFriendAction = useCallback(
    async ({ username, action, fallbackMessage, onSuccess, onError, onSettled }) => {
      if (!api || !username) {
        const message = fallbackMessage || "Friend action failed.";
        onError?.(message);
        onSettled?.();
        return { ok: false, error: message };
      }

      try {
        const response = await action(username);

        if (response.status === 200) {
          onSuccess?.(response);
          return { ok: true, response };
        }

        const errorMessage = await extractFriendActionError(response, fallbackMessage);
        onError?.(errorMessage);
        return { ok: false, response, error: errorMessage };
      } catch {
        const errorMessage = fallbackMessage || "Friend action failed.";
        onError?.(errorMessage);
        return { ok: false, error: errorMessage };
      } finally {
        onSettled?.();
      }
    },
    [api],
  );

  const sendFriendRequest = useCallback(
    ({ username, onSuccess, onError, onSettled, fallbackMessage = "Failed to send friend request." }) =>
      executeFriendAction({
        username,
        action: (friendUsername) => api.sendFriendRequest(friendUsername),
        fallbackMessage,
        onSuccess,
        onError,
        onSettled,
      }),
    [api, executeFriendAction],
  );

  const cancelFriendRequest = useCallback(
    ({ username, onSuccess, onError, onSettled, fallbackMessage = "Failed to cancel friend request." }) =>
      executeFriendAction({
        username,
        action: (friendUsername) => api.deleteFriendRequest(friendUsername),
        fallbackMessage,
        onSuccess,
        onError,
        onSettled,
      }),
    [api, executeFriendAction],
  );

  const acceptFriendRequest = useCallback(
    ({ username, onSuccess, onError, onSettled, fallbackMessage = "Failed to accept friend request." }) =>
      executeFriendAction({
        username,
        action: (friendUsername) => api.acceptFriendRequest(friendUsername),
        fallbackMessage,
        onSuccess,
        onError,
        onSettled,
      }),
    [api, executeFriendAction],
  );

  const rejectFriendRequest = useCallback(
    ({ username, onSuccess, onError, onSettled, fallbackMessage = "Failed to reject friend request." }) =>
      executeFriendAction({
        username,
        action: (friendUsername) => api.rejectFriendRequest(friendUsername),
        fallbackMessage,
        onSuccess,
        onError,
        onSettled,
      }),
    [api, executeFriendAction],
  );

  const unfriend = useCallback(
    ({ username, onSuccess, onError, onSettled, fallbackMessage = "Failed to unfriend user." }) =>
      executeFriendAction({
        username,
        action: (friendUsername) => api.unfriend(friendUsername),
        fallbackMessage,
        onSuccess,
        onError,
        onSettled,
      }),
    [api, executeFriendAction],
  );

  return {
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    unfriend,
  };
}
