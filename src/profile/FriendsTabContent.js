import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import { APIContext } from "../contexts/APIContext";
import FriendRow from "./FriendRow";

export default function FriendsTabContent({ friendUserId }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [friendsError, setFriendsError] = useState(null);

  const [friendRequests, setFriendRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState(null);

  const [pendingSearch, setPendingSearch] = useState("");
  const [newFriendResults, setNewFriendResults] = useState([]);
  const [newFriendError, setNewFriendError] = useState(null);
  const [searchingNewFriends, setSearchingNewFriends] = useState(null);
  const [sendingRequestId, setSendingRequestId] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);

  // Friend-of-friend state (used when viewing someone else's profile)
  const [friendsFriends, setFriendsFriends] = useState([]);
  const [loadingFriendsFriends, setLoadingFriendsFriends] = useState(false);
  const [friendsFriendsError, setFriendsFriendsError] = useState(null);

  // Reset search results when search bar is empty
  useEffect(() => {
    if (pendingSearch === "") {
      setNewFriendResults([]);
      setNewFriendError(null);
      setSearchingNewFriends(null)
    }
  }, [pendingSearch]);

  useEffect(() => {
    if (friendUserId) return;
    api.getFriends((data) => {
      if (!data) {
        setFriendsError("Failed to fetch friends");
        setLoadingFriends(false);
        return;
      }
      setFriends(data);
      setLoadingFriends(false);
    });
  }, [api, friendUserId]);

  useEffect(() => {
    if (friendUserId) return;
    api.getFriendRequests((data) => {
      if (!data) {
        setRequestsError("Failed to fetch friend requests");
        setLoadingRequests(false);
        return;
      }
      setFriendRequests(data);
      setLoadingRequests(false);
    });
  }, [api, friendUserId]);

  useEffect(() => {
    if (!friendUserId) return;
    setLoadingFriendsFriends(true);
    setFriendsFriendsError(null);
    api.getFriendsForUser(friendUserId, (data) => {
      if (!data) {
        setFriendsFriendsError("Failed to fetch friends.");
        setLoadingFriendsFriends(false);
        return;
      }
      setFriendsFriends(data);
      setLoadingFriendsFriends(false);
    });
  }, [api, friendUserId]);

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
                ? {
                    ...item,
                    friend_request: null,
                    user: {
                      ...item.user,
                      friendship: null,
                    },
                  }
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

  const handleViewFriendProfile = (friendId) => {
    if (!friendId) {
      return;
    }

    history.push(`/profile/${friendId}`);
  };

  const handleResetSearch = () => {
    setPendingSearch("");
    setNewFriendResults([]);
    setNewFriendError(null);
  };

  return (
    <div>
      {/* Friend-of-friend read-only view */}
      {friendUserId ? (
        <>
          <h3>Friends</h3>
          {loadingFriendsFriends && <p>Loading friends...</p>}
          {friendsFriendsError && <p style={{ color: "red" }}>{friendsFriendsError}</p>}
          {!loadingFriendsFriends && !friendsFriendsError && friendsFriends.length === 0 && (
            <p>This user has no friends yet.</p>
          )}
          {friendsFriends.length > 0 && (
            <ul>
              {friendsFriends.map((friend) => (
                <FriendRow
                  key={friend.id}
                  user={friend}
                  rowType="view-only"
                  onViewProfile={handleViewFriendProfile}
                />
              ))}
            </ul>
          )}
        </>
      ) : (
        <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
        <SearchBar
          value={pendingSearch}
          onChange={(e) => setPendingSearch(e.target.value)}
          placeholder="Search with name or username..."
          onSearch={handleNewFriendSearch}
        />
      </div>

      {newFriendError && <p style={{ color: "red" }}>{newFriendError}</p>}

      {/* Only show Users section when searching */}
      {pendingSearch ? (
        <div>
          <h3>Users</h3>
            {newFriendResults.length === 0 && searchingNewFriends === null && (
              <p>Press Enter to search...</p>
            )}
            {newFriendResults.length === 0 && searchingNewFriends === true && pendingSearch.trim().length >= 2 && (
              <p>Searching...</p>
            )}
            {newFriendResults.length === 0 && searchingNewFriends === false && pendingSearch.trim().length >= 2 && (
              <p>No users...</p>
            )}
          {newFriendResults.length > 0 && (
            <ul>
              {newFriendResults.map((result) => {
                const { user } = result;
                return (
                  <FriendRow
                    key={user.id}
                    user={user}
                    rowType="search"
                    isSending={sendingRequestId === user.id}
                    isSent={sentRequests.includes(user.id)}
                    onSendRequest={handleSendFriendRequest}
                    onCancelRequest={handleCancelFriendRequest}
                    onViewProfile={handleViewFriendProfile}
                  />
                );
              })}
            </ul>
          )}
        </div>
      ) : (
        <>
          {/* Friend Requests section only if there are requests */}
          {!loadingRequests && friendRequests.length > 0 && (
            <div>
              <h3>Friend Requests</h3>
              {requestsError && <p style={{ color: "red" }}>{requestsError}</p>}
              <ul>
                {friendRequests.map((req) => (
                  <FriendRow
                    key={req.id}
                    user={req.sender}
                    rowType="request"
                    requestAccepted={req.accepted}
                    onAcceptRequest={handleAcceptFriendRequest}
                    onRejectRequest={handleRejectFriendRequest}
                    onViewProfile={handleViewFriendProfile}
                  />
                ))}
              </ul>
            </div>
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
                <FriendRow
                  key={friend.id}
                  user={friend}
                  rowType="friend"
                  onUnfriend={handleUnfriend}
                  onViewProfile={handleViewFriendProfile}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
      )}
    </div>
  );
}
