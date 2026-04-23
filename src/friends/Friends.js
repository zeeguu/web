import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import { APIContext } from "../contexts/APIContext";
import strings from "../i18n/definitions";
import FriendRow from "./FriendRow";
import { FriendRequestContext } from "../contexts/FriendRequestContext";
import useFriendActions from "../hooks/useFriendActions";
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
  const [searchResultsError, setSearchResultsError] = useState(null);
  const [isSearching, setIsSearching] = useState(null);
  const [pendingFriendActions, setPendingFriendActions] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  // Friend-of-friend state (used when viewing someone else's profile)
  const [friendsFriends, setFriendsFriends] = useState([]);
  const [loadingFriendsFriends, setLoadingFriendsFriends] = useState(false);
  const [friendsFriendsError, setFriendsFriendsError] = useState(null);

  const { updateFriendRequestCounter } = useContext(FriendRequestContext);
  const { sendFriendRequest, cancelFriendRequest, acceptFriendRequest, rejectFriendRequest } = useFriendActions();

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
      setSearchResultsError(null);
      setIsSearching(null);
    }
    const searchTimeout = handlePendingSearchChange(false);
    return () => clearTimeout(searchTimeout);
  }, [pendingSearch, api]);

  const handlePendingSearchChange = (isEnterSearch) => {
    const query = pendingSearch.trim();

    if (query.length < 2 && !isEnterSearch) {
      setSearchResults([]);
      setSearchResultsError(null);
      setIsSearching(null);
      return;
    }

    return setTimeout(() => {
      setIsSearching(true);
      setSearchResultsError(null);

      api.searchUsers(query, (results) => {
        setIsSearching(false);

        if (!results) {
          setSearchResultsError("Failed to search for users");
          setSearchResults([]);
          return;
        }

        setSearchResults(results);
      });
    }, 300);
  };

  const handleSendFriendRequest = (event, receiverUsername) => {
    event.stopPropagation();
    doFriendAction(receiverUsername, sendFriendRequest, () => {
      setSentRequests((prev) => [...prev, receiverUsername]);
    });
  };

  const handleCancelFriendRequest = (event, receiverUsername) => {
    event.stopPropagation();
    doFriendAction(receiverUsername, cancelFriendRequest, () => {
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
    });
  };

  const handleAcceptFriendRequest = (event, senderUsername) => {
    event.stopPropagation();
    doFriendAction(senderUsername, acceptFriendRequest, () => {
      setFriendRequests((prev) =>
        prev.map((req) => (req.sender.username === senderUsername ? { ...req, is_accepted: true } : req)),
      );
      updateFriendRequestCounter();
    });
  };

  const handleRejectFriendRequest = (event, senderUsername) => {
    event.stopPropagation();
    doFriendAction(senderUsername, rejectFriendRequest, () => {
      setFriendRequests((prev) => prev.filter((req) => req.sender.username !== senderUsername));
      updateFriendRequestCounter();
    });
  };

  const doFriendAction = (username, actionFn, onSuccess) => {
    setPendingFriendActions((prev) => [...prev, username]);
    actionFn({
      username: username,
      onSuccess: onSuccess,
      onError: (message) => toast.error(message),
      onFinally: () => {
        setPendingFriendActions((prev) => prev.filter((u) => u !== username));
      },
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
          <h3>{strings.friends}</h3>
          {loadingFriendsFriends && <p>{strings.loadingFriends}</p>}
          {friendsFriendsError && <s.ErrorText>{friendsFriendsError}</s.ErrorText>}
          {!loadingFriendsFriends && !friendsFriendsError && friendsFriends.length === 0 && (
            <p>{strings.noFriendsForUser}</p>
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
              placeholder={strings.searchForUsersPlaceholder}
              onSearch={() => handlePendingSearchChange(true)}
            />
          </s.SearchBarRow>

          {searchResultsError && <s.ErrorText>{searchResultsError}</s.ErrorText>}

          {/* Only show Users section when searching */}
          {pendingSearch ? (
            <div>
              <h3>{strings.users}</h3>
              {searchResults.length === 0 && isSearching === null && <p>{strings.continueTypingToSearch}</p>}
              {searchResults.length === 0 && isSearching === true && <p>{strings.searching}</p>}
              {searchResults.length === 0 && isSearching === false && <p>{strings.noUsers}</p>}
              {searchResults.length > 0 && (
                <s.UnstyledList>
                  {searchResults.map((searchResult, index) => {
                    return (
                      <FriendRow
                        key={`friend-search-result-${index}`}
                        user={searchResult}
                        rowType="search"
                        isPendingFriendAction={pendingFriendActions.includes(searchResult.username)}
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
                  <h3>{strings.friendRequests}</h3>
                  {requestsError && <s.ErrorText>{requestsError}</s.ErrorText>}
                  <s.UnstyledList $mb="2rem">
                    {friendRequests.map((req, index) => (
                      <FriendRow
                        key={`friend-request-${index}`}
                        user={req.sender}
                        rowType="request"
                        isPendingFriendAction={pendingFriendActions.includes(req.sender.username)}
                        friendRequestAccepted={req.is_accepted}
                        onAcceptRequest={handleAcceptFriendRequest}
                        onRejectRequest={handleRejectFriendRequest}
                        onViewProfile={handleViewFriendProfile}
                      />
                    ))}
                  </s.UnstyledList>
                </div>
              )}

              <h3>{strings.friends}</h3>
              {loadingFriends && <p>{strings.loadingFriends}</p>}
              {friendsError && <s.ErrorText>{friendsError}</s.ErrorText>}
              {!loadingFriends && !friendsError && friends.length === 0 && <p>{strings.noFriendsYet}</p>}
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
