import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import { APIContext } from "../contexts/APIContext";
import FriendRow from "./FriendRow";
import { FriendRequestContext } from "../contexts/FriendRequestContext";
import * as s from "./Friends.sc";

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
    api.getFriends((data) => {
      if (!data) {
        setFriendsError("Failed to fetch friends");
        setLoadingFriends(false);
        return;
      }
      setFriends(data);
      setLoadingFriends(false);
    });
  }, [api, friendUsername]);

  useEffect(() => {
    if (friendUsername) return;
    api.getReceivedFriendRequests((data) => {
      if (!data) {
        setRequestsError("Failed to fetch friend requests");
        setLoadingRequests(false);
        return;
      }
      setFriendRequests(data);
      setLoadingRequests(false);
    });
  }, [api, friendUsername]);

  useEffect(() => {
    if (!friendUsername) return;
    setLoadingFriendsFriends(true);
    setFriendsFriendsError(null);
    api.getFriendsForUser(friendUsername, (data) => {
      if (!data) {
        setFriendsFriendsError("Failed to fetch friends.");
        setLoadingFriendsFriends(false);
        return;
      }
      setFriendsFriends(data);
      setLoadingFriendsFriends(false);
    });
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

      api.searchUsers(query, (results) => {
        setSearchingNewFriends(false);

        if (!results) {
          setNewFriendError("Failed to search for users");
          setSearchResults([]);
          return;
        }

        setSearchResults(results);
      });
    }, 300);
  };

  const handleSendFriendRequest = (event, receiverUsername) => {
    event.stopPropagation();
    setSendingRequestUsername(receiverUsername);
    api
      .sendFriendRequest(receiverUsername)
      .then((response) => {
        setSendingRequestUsername(null);
        if (response.status === 200) {
          setSentRequests((prev) => [...prev, receiverUsername]);
        } else {
          response.json().then((json) => {
            toast.error(json.error || "Failed to send friend request.");
          });
        }
      })
      .catch(() => {
        setSendingRequestUsername(null);
        toast.error("Failed to send friend request.");
      });
  };

  const handleCancelFriendRequest = (event, receiverUsername) => {
    event.stopPropagation();
    api
      .deleteFriendRequest(receiverUsername)
      .then((response) => {
        if (response.status === 200) {
          setSentRequests((prev) => prev.filter((username) => username !== receiverUsername));
          setSearchResults((prev) =>
            prev.map((user) =>
              user.username === receiverUsername
                ? {
                    ...user,
                    friend_request: null,
                    friendship: null,
                  }
                : user,
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

  const handleAcceptFriendRequest = (event, senderUsername) => {
    event.stopPropagation();
    api
      .acceptFriendRequest(senderUsername)
      .then((response) => {
        if (response.status === 200) {
          setFriendRequests((prev) =>
            prev.map((req) =>
              req.sender.username === senderUsername ? { ...req, is_accepted: true } : req,
            ),
          );
          updateFriendRequestCounter();
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

  const handleRejectFriendRequest = (event, senderUsername) => {
    event.stopPropagation();
    api
      .rejectFriendRequest(senderUsername)
      .then((response) => {
        if (response.status === 200) {
          setFriendRequests((prev) => prev.filter((req) => req.sender.username !== senderUsername));
          updateFriendRequestCounter();
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
          {friendsFriendsError && <s.ErrorText>{friendsFriendsError}</s.ErrorText>}
          {!loadingFriendsFriends && !friendsFriendsError && friendsFriends.length === 0 && (
            <p>This user has no friends yet.</p>
          )}
          {friendsFriends.length > 0 && (
            <s.UnstyledList>
              {friendsFriends.map((friend, index) => (
                <FriendRow
                  key={`friend-${index}`}
                  user={friend}
                  rowType="view-only"
                  onViewProfile={handleViewFriendProfile}
                />
              ))}
            </s.UnstyledList>
          )}
        </>
      ) : (
        <div>
          <s.SearchBarRow>
            <SearchBar
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
              placeholder="Search for users..."
              onSearch={() => handlePendingSearchChange(true)}
            />
          </s.SearchBarRow>

          {newFriendError && <s.ErrorText>{newFriendError}</s.ErrorText>}

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
                <s.UnstyledList>
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
                </s.UnstyledList>
              )}
            </div>
          ) : (
            <>
              {/* Friend Requests section only if there are requests */}
              {!loadingRequests && friendRequests.length > 0 && (
                <div>
                  <h3>Friend Requests</h3>
                  {requestsError && <s.ErrorText>{requestsError}</s.ErrorText>}
                  <s.UnstyledList $mb="2rem">
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
                  </s.UnstyledList>
                </div>
              )}

              <h3>Friends</h3>
              {loadingFriends && <p>Loading friends...</p>}
              {friendsError && <s.ErrorText>{friendsError}</s.ErrorText>}
              {!loadingFriends && !friendsError && friends.length === 0 && <p>You have no friends yet.</p>}
              {!loadingFriends && friends.length > 0 && (
                <s.UnstyledList>
                  {friends.map((friend, index) => (
                    <FriendRow
                      key={`friend-${index}`}
                      user={friend}
                      rowType="friend"
                      onViewProfile={handleViewFriendProfile}
                    />
                  ))}
                </s.UnstyledList>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
