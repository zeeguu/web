import { useContext } from "react";
import { APIContext } from "../contexts/APIContext";
import strings from "../i18n/definitions";

function handleFriendActionPromise(promise, onSuccess, onError, errorMessage, onFinally) {
  promise
    .then((response) => {
      if (response.status === 200) {
        onSuccess?.();
      } else {
        response
          .json()
          .then((json) => {
            onError?.(json?.error || errorMessage);
          })
          .catch(() => {
            onError?.(errorMessage);
          });
      }
    })
    .catch(() => {
      onError?.(errorMessage);
    })
    .finally(() => {
      onFinally?.();
    });
}

export default function useFriendActions() {
  const api = useContext(APIContext);

  const unfriend = ({
    username,
    onSuccess,
    onError,
    errorMessage = strings.failedToUnfriendUser,
    onFinally = () => {},
  }) => {
    handleFriendActionPromise(api.unfriend(username), onSuccess, onError, errorMessage, onFinally);
  };

  const sendFriendRequest = ({
    username,
    onSuccess,
    onError,
    errorMessage = strings.failedToSendFriendRequest,
    onFinally = () => {},
  }) => {
    handleFriendActionPromise(api.sendFriendRequest(username), onSuccess, onError, errorMessage, onFinally);
  };

  const cancelFriendRequest = ({
    username,
    onSuccess,
    onError,
    errorMessage = strings.failedToCancelFriendRequest,
    onFinally = () => {},
  }) => {
    handleFriendActionPromise(api.deleteFriendRequest(username), onSuccess, onError, errorMessage, onFinally);
  };

  const acceptFriendRequest = ({
    username,
    onSuccess,
    onError,
    errorMessage = strings.failedToAcceptFriendRequest,
    onFinally = () => {},
  }) => {
    handleFriendActionPromise(api.acceptFriendRequest(username), onSuccess, onError, errorMessage, onFinally);
  };

  const rejectFriendRequest = ({
    username,
    onSuccess,
    onError,
    errorMessage = strings.failedToRejectFriendRequest,
    onFinally = () => {},
  }) => {
    handleFriendActionPromise(api.rejectFriendRequest(username), onSuccess, onError, errorMessage, onFinally);
  };

  return {
    unfriend,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
  };
}
