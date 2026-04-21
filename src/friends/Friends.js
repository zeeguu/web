import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import { APIContext } from "../contexts/APIContext";
import FriendRow from "./FriendRow";
import { FriendRequestContext } from "../contexts/FriendRequestContext";

export default function Friends({ friendUsername, navigationHandler }) {
  const api = useContext(APIContext);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [friendsError, setFriendsError] = useState(null);

  const [friendRequests, setFriendRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState(null);

  const [pendingSearch, setPendingSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newFriendError, setNewFriendError] = useState(null);
  const [searchingNewFriends, setSearchingNewFriends] = useState(null);
  const [sendingRequestUsername, setSendingRequestUsername] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);

  // Friend-of-friend state (used when viewing someone else's profile)
  const [friendsFriends, setFriendsFriends] = useState([]);
  const [loadingFriendsFriends, setLoadingFriendsFriends] = useState(false);
  const [friendsFriendsError, setFriendsFriendsError] = useState(null);

  const { updateFriendRequestCounter } = useContext(FriendRequestContext);

  useEffect(() => {
    if (friendUsername) return;
    let mounted = true;
    api.getFriends({ onError: "dialog" }).then((data) => {
      if (!mounted) return;
      setFriends(data ?? []);
      setLoadingFriends(false);
    });
    return () => { mounted = false; };
  }, [api, friendUsername]);

  useEffect(() => {
    if (friendUsername) return;
    let mounted = true;
    api.getReceivedFriendRequests({ onError: "silent" }).then((data) => {
      if (!mounted) return;
      setFriendRequests(data ?? []);
      setLoadingRequests(false);
    });
    return () => { mounted = false; };
  }, [api, friendUsername]);

  useEffect(() => {
    if (!friendUsername) return;
    let mounted = true;
    setLoadingFriendsFriends(true);
    setFriendsFriendsError(null);
    api.getFriendsForUser(friendUsername, { onError: "dialog" }).then((data) => {
      if (!mounted) return;
      setFriendsFriends(data ?? []);
      setLoadingFriendsFriends(false);
    });
    return () => { mounted = false; };
  }, [api, friendUsername]);

  useEffect(() => {
    if (pendingSearch === "") {
      setSearchResults([]);
      setNewFriendError(null);
      setSearchingNewFriends(null);
    }
    const searchTimeout = handlePendingSearchChange(false);
    return () => clearTimeout(searchTimeout);
  }, [pendingSearch, api]);

  const handlePendingSearchChange = (isEnterSearch) => {
    const query = pendingSearch.trim();

    if (query.length < 2 && !isEnterSearch) {
      setSearchResults([]);
      setNewFriendError(null);
      setSearchingNewFriends(null);
      return;
    }

    return setTimeout(() => {
      setSearchingNewFriends(true);
      setNewFriendError(null);

      api.searchUsers(query, { onError: "silent" }).then((results) => {
        setSearchingNewFriends(false);
        setSearchResults(Array.isArray(results) ? results : []);
      });
    }, 300);
  };

  const handleSendFriendRequest = (event, receiverUsername) => {
    event.stopPropagation();
    setSendingRequestUsername(receiverUsername);
    api
      .sendFriendRequest(receiverUsername)
      .then(() => {
        setSendingRequestUsername(null);
        setSentRequests((prev) => [...prev, receiverUsername]);
      })
      .catch((error) => {
        setSendingRequestUsername(null);
        toast.error(error.response?.data?.error || "Failed to send friend request.");
      });
  };

  const handleCancelFriendRequest = (event, receiverUsername) => {
    event.stopPropagation();
    api
      .deleteFriendRequest(receiverUsername)
      .then(() => {
        setSentRequests((prev) => prev.filter((u) => u !== receiverUsername));
        setSearchResults((prev) =>
          prev.map((user) =>
            user.username === receiverUsername
              ? { ...user, friend_request: null, friendship: null }
              : user,
          ),
        );
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to cancel friend request.");
      });
  };

  const handleAcceptFriendRequest = (event, senderUsername) => {
    event.stopPropagation();
    api
      .acceptFriendRequest(senderUsername)
      .then(() => {
        setFriendRequests((prev) =>
          prev.map((req) =>
            req.sender.username === senderUsername ? { ...req, is_accepted: true } : req,
          ),
        );
        updateFriendRequestCounter();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to accept friend request.");
      });
  };

  const handleRejectFriendRequest = (event, senderUsername) => {
    event.stopPropagation();
    api
      .rejectFriendRequest(senderUsername)
      .then(() => {
        setFriendRequests((prev) => prev.filter((req) => req.sender.username !== senderUsername));
        updateFriendRequestCounter();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to reject friend request.");
      });
  };

  const handleViewFriendProfile = (friendUsername) => {
    if (!friendUsername || !navigationHandler) {
      return;
    }
    navigationHandler(friendUsername);
  };

  return (
    <div>
      {/* Friend-of-friend read-only view */}
      {friendUsername ? (
        <>
          <h3>Friends</h3>
          {loadingFriendsFriends && <p>Loading friends...</p>}
          {friendsFriendsError && <p style={{ color: "red" }}>{friendsFriendsError}</p>}
          {!loadingFriendsFriends && !friendsFriendsError && friendsFriends.length === 0 && (
            <p>This user has no friends yet.</p>
          )}
          {friendsFriends.length > 0 && (
            <ul style={{ padding: 0 }}>
              {friendsFriends.map((friend, index) => (
                <FriendRow
                  key={`friend-${index}`}
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
              placeholder="Search for users..."
              onSearch={() => handlePendingSearchChange(true)}
            />
          </div>

          {newFriendError && <p style={{ color: "red" }}>{newFriendError}</p>}

          {/* Only show Users section when searching */}
          {pendingSearch ? (
            <div>
              <h3>Users</h3>
              {searchResults.length === 0 && searchingNewFriends === null && (
                <p>Continue typing or press Enter to search...</p>
              )}
              {searchResults.length === 0 && searchingNewFriends === true && <p>Searching...</p>}
              {searchResults.length === 0 && searchingNewFriends === false && <p>No users...</p>}
              {searchResults.length > 0 && (
                <ul style={{ padding: 0 }}>
                  {searchResults.map((searchResult, index) => {
                    return (
                      <FriendRow
                        key={`friend-search-result-${index}`}
                        user={searchResult}
                        rowType="search"
                        isSending={sendingRequestUsername === searchResult.username}
                        isSent={sentRequests.includes(searchResult.username)}
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
                  <ul style={{ padding: 0, marginBottom: "2rem" }}>
                    {friendRequests.map((req, index) => (
                      <FriendRow
                        key={`friend-request-${index}`}
                        user={req.sender}
                        rowType="request"
                        friendRequestAccepted={req.is_accepted}
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
              {!loadingFriends && !friendsError && friends.length === 0 && <p>You have no friends yet.</p>}
              {!loadingFriends && friends.length > 0 && (
                <ul style={{ padding: 0 }}>
                  {friends.map((friend, index) => (
                    <FriendRow
                      key={`friend-${index}`}
                      user={friend}
                      rowType="friend"
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
