import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import { APIContext } from "../contexts/APIContext";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";


export default function FriendsTabContent() {
  const api = useContext(APIContext);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [friendsError, setFriendsError] = useState(null);

  const [friendRequests, setFriendRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState(null);

  const [pendingSearch, setPendingSearch] = useState("");
  const [newFriendResults, setNewFriendResults] = useState([]);
  const [newFriendError, setNewFriendError] = useState(null);
  const [searchingNewFriends, setSearchingNewFriends] = useState(false);
  const [sendingRequestId, setSendingRequestId] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    api.getFriends((data) => {
      if (!data) {
        setFriendsError("Failed to fetch friends");
        setLoadingFriends(false);
        return;
      }
      setFriends(data);
      setLoadingFriends(false);
    });
  }, [api]);

  useEffect(() => {
    api.getFriendRequests((data) => {
      if (!data) {
        setRequestsError("Failed to fetch friend requests");
        setLoadingRequests(false);
        return;
      }
      setFriendRequests(data);
      setLoadingRequests(false);
    });
  }, [api]);

  const handleNewFriendSearch = () => {
    if (pendingSearch.trim().length < 2) {
      setNewFriendError("Please enter at least 2 letters.");
      setNewFriendResults([]);
      return;
    }

    setSearchingNewFriends(true);
    setNewFriendError(null);

    api.searchUsers(pendingSearch, (results) => {
      setSearchingNewFriends(false);
      if (!results) {
        setNewFriendError("Failed to search for users");
        setNewFriendResults([]);
        return;
      }
      setNewFriendResults(results);
    });
  };

  const handleSendFriendRequest = (receiverId) => {
    setSendingRequestId(receiverId);
    api
      .sendFriendRequest(receiverId)
      .then((response) => {
        setSendingRequestId(null);
        if (response.status === 200) {
          setSentRequests((prev) => [...prev, receiverId]);
        } else {
          response.json().then((json) => {
            toast.error(json.error || "Failed to send friend request.");
          });
        }
      })
      .catch(() => {
        setSendingRequestId(null);
        toast.error("Failed to send friend request.");
      });
  };

  const handleCancelFriendRequest = (receiverId) => {
    api
      .deleteFriendRequest(receiverId)
      .then((response) => {
        if (response.status === 200) {
          setSentRequests((prev) => prev.filter((id) => id !== receiverId));
          setNewFriendResults((prev) =>
            prev.map((item) =>
              item.user.id === receiverId
                ? { ...item, friend_request: null }
                : item,
            ),
          );
        } else {
          response.json().then((json) => {
            toast.error(json.message || "Failed to cancel friend request.");
          });
        }
      })
      .catch(() => {
        toast.error("Failed to cancel friend request.");
      });
  };

  const handleAcceptFriendRequest = (senderId) => {
    api
      .acceptFriendRequest(senderId)
      .then((response) => {
        if (response.status === 200) {
          setFriendRequests((prev) =>
            prev.map((req) =>
              req.sender.id === senderId ? { ...req, accepted: true } : req,
            ),
          );
        } else {
          response.json().then((json) => {
            toast.error(json.message || "Failed to accept friend request.");
          });
        }
      })
      .catch(() => {
        toast.error("Failed to accept friend request.");
      });
  };

  const handleRejectFriendRequest = (senderId) => {
    api
      .rejectFriendRequest(senderId)
      .then((response) => {
        if (response.status === 200) {
          setFriendRequests((prev) =>
            prev.filter((req) => req.sender.id !== senderId),
          );
        } else {
          response.json().then((json) => {
            toast.error(json.message || "Failed to reject friend request.");
          });
        }
      })
      .catch(() => {
        toast.error("Failed to reject friend request.");
      });
  };

  const handleUnfriend = (friendId) => {
    api
      .unfriend(friendId)
      .then((response) => {
        if (response.status === 200) {
          setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
        } else {
          response.json().then((json) => {
            toast.error(json.message || "Failed to unfriend user.");
          });
        }
      })
      .catch(() => {
        toast.error("Failed to unfriend user.");
      });
  };

  const handleResetSearch = () => {
    setPendingSearch("");
    setNewFriendResults([]);
    setNewFriendError(null);
  };

  return (
    <div>
      {/* <h3>Friends</h3> */}
      <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
        <SearchBar
          value={pendingSearch}
          onChange={(e) => setPendingSearch(e.target.value)}
          placeholder="Search for new friends..."
          onSearch={handleNewFriendSearch}
        />
        <button
          style={{
            padding: "0.3em 0.8em",
            borderRadius: "4px",
            border: "1px solid #ccc",
            background: "#f5f5f5",
            cursor: "pointer",
          }}
          onClick={handleResetSearch}
          disabled={!pendingSearch && newFriendResults.length === 0 && !newFriendError}
        >
          Reset Search
        </button>
      </div>

      {searchingNewFriends && <p>Searching...</p>}
      {newFriendError && <p style={{ color: "red" }}>{newFriendError}</p>}
      {pendingSearch && !searchingNewFriends && newFriendResults.length === 0 && (
        <p>Press Enter to search...</p>
      )}
      {newFriendResults.length > 0 && (
        <ul>
          {newFriendResults.map((result) => {
            const { user, friendship, friend_request: friendRequest } = result;
            let statusLabel = null;
            let button = null;

            if (friendship || friendRequest?.status === "accepted") {
              statusLabel = (
                <span style={{ color: "green", marginLeft: "1em" }}>
                  Already friends
                </span>
              );
            } else if (friendRequest?.status === "pending") {
              if (friendRequest.sender_id === user.id) {
                statusLabel = (
                  <span style={{ color: "orange", marginLeft: "1em" }}>
                    They sent you a request
                  </span>
                );
              } else {
                button = (
                  <button
                    style={{
                      marginLeft: "1em",
                      padding: "0.3em 0.8em",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      background: "#ffe0e0",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCancelFriendRequest(user.id)}
                  >
                    Cancel Request
                  </button>
                );
              }
            } else {
              button = (
                <button
                  style={{
                    marginLeft: "1em",
                    padding: "0.3em 0.8em",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    background: "#e0f7fa",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSendFriendRequest(user.id)}
                  disabled={
                    sendingRequestId === user.id || sentRequests.includes(user.id)
                  }
                >
                  {sentRequests.includes(user.id)
                    ? "Sent"
                    : sendingRequestId === user.id
                      ? "Sending..."
                      : "Send Friend Request"}
                </button>
              );
            }

            return (
              <li
                key={user.id}
                style={{ display: "flex", alignItems: "center", gap: "0.5em" }}
              >
                <span>{user.name}</span>
                <span style={{ color: "gray" }}>@{user.username}</span>
                {statusLabel}
                {button}
              </li>
            );
          })}
        </ul>
      )}

      <h3>Friend Requests</h3>
      {loadingRequests && <p>Loading friend requests...</p>}
      {requestsError && <p style={{ color: "red" }}>{requestsError}</p>}
      {!loadingRequests && friendRequests.length > 0 && (
        <ul>
          {friendRequests.map((req) => (
            <li
              key={req.id}
              style={{ display: "flex", alignItems: "center", gap: "1em", padding: "0.5em 0" }}
            >
              {/* Avatar/icon: fallback to emoji if no image */}
              <span role="img" aria-label="friend" style={{ fontSize: "2em" }}>👤</span>
              <span style={{ fontWeight: 600 }}>{req.sender.name}</span>
              <span style={{ color: "gray" }}>@{req.sender.username}</span>
              {/* Friend streak: fallback to 0 if missing */}
              <span style={{ display: "flex", alignItems: "center", gap: "0.3em", color: "#ff9800", fontWeight: 500 }}>
                <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.4rem" }} />
                <span>{req.sender.friend_streak ?? 0}</span>
              </span>
              <button
                style={{
                  marginLeft: "auto",
                  padding: "0.3em 0.8em",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  background: req.accepted ? "#e0ffe0" : "#e0ffe0",
                  cursor: req.accepted ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4em"
                }}
                onClick={() => handleAcceptFriendRequest(req.sender.id)}
                disabled={req.accepted}
              >
                {req.accepted ? "Accepted" : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: "middle" }}><path d="M9 16.2l-4.2-4.2c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l3.5 3.5 7.5-7.5c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-8.2 8.2c-.4.4-1 .4-1.4 0z" fill="#2ecc40"/></svg>
                    <span>Accept</span>
                  </>
                )}
              </button>
              {!req.accepted && (
                <button
                  style={{
                    marginLeft: "0.5em",
                    padding: "0.3em 0.8em",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    background: "#ffe0e0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4em"
                  }}
                  onClick={() => handleRejectFriendRequest(req.sender.id)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: "middle" }}><path d="M18.3 5.7c.4.4.4 1 0 1.4L13.4 12l4.9 4.9c.4.4.4 1 0 1.4s-1 .4-1.4 0L12 13.4l-4.9 4.9c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l4.9-4.9-4.9-4.9c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l4.9 4.9 4.9-4.9c.4-.4 1-.4 1.4 0z" fill="#e74c3c"/></svg>
                  <span>Reject</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <h3>Friends</h3>
      {loadingFriends && <p>Loading friends...</p>}
      {friendsError && <p style={{ color: "red" }}>{friendsError}</p>}
      {!loadingFriends && !friendsError && friends.length === 0 && (
        <p>You have no friends yet.</p>
      )}
      {!loadingFriends && friends.length > 0 && (
        <ul>
          {friends.map((friend) => (
            <li
              key={friend.id}
              style={{ display: "flex", alignItems: "center", gap: "1em", padding: "0.5em 0" }}
            >
              {/* Avatar/icon: fallback to emoji if no image */}
              <span role="img" aria-label="friend" style={{ fontSize: "2em" }}>👤</span>
              <span style={{ fontWeight: 600 }}>{friend.name}</span>
              <span style={{ color: "gray" }}>@{friend.username}</span>
              {/* Friend streak: fallback to 0 if missing */}
              <span style={{ display: "flex", alignItems: "center", gap: "0.3em", color: "#ff9800", fontWeight: 500 }}>
                <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.4rem" }} />
                <span>{friend.friend_streak ?? 0}</span>
              </span>
              <button
                style={{
                  marginLeft: "auto",
                  padding: "0.3em 0.8em",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  background: "#ffe0e0",
                  cursor: "pointer",
                }}
                onClick={() => handleUnfriend(friend.id)}
              >
                Unfriend
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
