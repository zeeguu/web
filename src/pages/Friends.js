import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import CenteredContainer from "../components/CenteredContainer";
import { APIContext } from "../contexts/APIContext";
import SearchBar from "../components/SearchBar";

// TODO remove this file if not needed anymore

function Friends() {
  const api = useContext(APIContext);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFriendResults, setNewFriendResults] = useState([]);
  const [searchingNewFriends, setSearchingNewFriends] = useState(false);
  const [newFriendError, setNewFriendError] = useState(null);
  const [pendingSearch, setPendingSearch] = useState("");
  const [sendingRequestId, setSendingRequestId] = useState([null]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorRequests, setErrorRequests] = useState(null);
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  useEffect(() => {
    api.getFriends((data) => {
      setFriends(data);
      setLoading(false);
    }, (err) => {
      setError("Failed to fetch friends");
      setLoading(false);
    });
  }, [api]);

  useEffect(() => {
    api.getFriendRequests(
      (data) => {
        setFriendRequests(data);
        setLoadingRequests(false);
      },
      (err) => {
        setErrorRequests("Failed to fetch friend requests");
        setLoadingRequests(false);
      }
    );
  }, [api]);

  const handleNewFriendSearch = () => {
    if (pendingSearch.trim().length < 2) {
      setNewFriendError("Please enter at least 2 letters.");
      setNewFriendResults([]);
      return;
    }
    setSearchingNewFriends(true);
    setNewFriendError(null);
    api.searchUsers(pendingSearch,
      (results) => {
        setNewFriendResults(results);
        setSearchingNewFriends(false);
      },
      (err) => {
        setNewFriendError("Failed to search for users");
        setSearchingNewFriends(false);
      }
    );
  };

  const handleSendFriendRequest = (receiver_id) => {
    setSendingRequestId(receiver_id);
    api.sendFriendRequest(receiver_id)
      .then((response) => {
        // setSendingRequestId(null);
        if (response.status === 200) {
          console.log("Friend request sent successfully");
          setSentRequests((prev) => [...prev, receiver_id]);
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

  const handleAcceptFriendRequest = (sender_id) => {
    api.acceptFriendRequest(sender_id)
      .then((response) => {
        if (response.status === 200) {
          setAcceptedRequests((prev) => [...prev, sender_id]);
          setFriendRequests((prev) => prev.map((req) =>
            req.sender.id === sender_id ? { ...req, accepted: true } : req
          ));
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

  const handleRejectFriendRequest = (sender_id) => {
    api.rejectFriendRequest(sender_id)
      .then((response) => {
        if (response.status === 200) {
          setFriendRequests((prev) => prev.filter((req) => req.sender.id !== sender_id));
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

  const handleUnfriend = (friend_id) => {
    api.unfriend(friend_id)
      .then((response) => {
        if (response.status === 200) {
          setFriends((prev) => prev.filter((friend) => friend.id !== friend_id));
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

  const handleCancelFriendRequest = (receiver_id) => {
    api.deleteFriendRequest(receiver_id)
      .then((response) => {
        if (response.status === 200) {
          setPendingRequests((prev) => prev.filter((req) => req.receiver.id !== receiver_id));
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

  const handleResetSearch = () => {
    setPendingSearch("");
    setNewFriendResults([]);
    setNewFriendError(null);
  };

  return (
    <CenteredContainer>
      <h1>Friends</h1>
      {loading && <p>Loading friends...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && friends.length === 0 && <p>You have no friends yet.</p>}
      {!loading && friends.length > 0 && (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id} style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
              <span role="img" aria-label="friend" style={{ fontSize: "1.5em" }}>👤</span>
              <span>{friend.name}</span>
              <span style={{ color: "gray", marginLeft: "0.5em" }}>@{friend.username}</span>
              <button
                style={{ marginLeft: "1em", padding: "0.3em 0.8em", borderRadius: "4px", border: "1px solid #ccc", background: "#ffe0e0", cursor: "pointer" }}
                onClick={() => handleUnfriend(friend.id)}
              >
                Unfriend
              </button>
            </li>
          ))}
        </ul>
      )}
      <hr style={{ margin: "2em 0", width: "100%" }} />
      <h2>Find New Friends</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
        <SearchBar
          value={pendingSearch}
          onChange={e => setPendingSearch(e.target.value)}
          placeholder="Search for new friends..."
          onSearch={handleNewFriendSearch}
        />
        <button
          style={{ padding: "0.3em 0.8em", borderRadius: "4px", border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}
          onClick={handleResetSearch}
          disabled={!pendingSearch && newFriendResults.length === 0 && !newFriendError}
        >
          Reset Search
        </button>
      </div>
          {searchingNewFriends && <p>Searching...</p>}
          {newFriendError && <p style={{ color: "red" }}>{newFriendError}</p>}
          {pendingSearch && !searchingNewFriends && newFriendResults.length === 0 && <p>Press Enter to search...</p>}
          {newFriendResults.length > 0 && (
            <ul>
              {newFriendResults.map((result) => {
                  const { user, friendship, friend_request } = result;
                  let statusLabel = null;
                  let button = null;
                  if (friendship) {
                    statusLabel = <span style={{ color: 'green', marginLeft: '1em' }}>Already friends</span>;
                  } else if (friend_request) {
                    if (friend_request.status === 'pending') {
                      if (friend_request.sender_id === user.id) {
                        statusLabel = <span style={{ color: 'orange', marginLeft: '1em' }}>They sent you a request</span>;
                      } else {
                        button = (
                          <button
                            style={{ marginLeft: "1em", padding: "0.3em 0.8em", borderRadius: "4px", border: "1px solid #ccc", background: "#ffe0e0", cursor: "pointer" }}
                            onClick={() => handleCancelFriendRequest(user.id)}
                          >
                            Cancel Request
                          </button>
                        );
                      }
                    } else if (friend_request.status === 'accepted') {
                      statusLabel = <span style={{ color: 'green', marginLeft: '1em' }}>Already friends</span>;
                    }
                  } else {
                    button = (
                      <button
                        style={{ marginLeft: "1em", padding: "0.3em 0.8em", borderRadius: "4px", border: "1px solid #ccc", background: "#e0f7fa", cursor: "pointer" }}
                        onClick={() => handleSendFriendRequest(user.id)}
                        disabled={sendingRequestId === user.id || sentRequests.includes(user.id)}
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
                    <li key={user.id} style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                      <span role="img" aria-label="user" style={{ fontSize: "1.5em" }}>🧑</span>
                      <span>{user.name}</span>
                      <span style={{ color: "gray", marginLeft: "0.5em" }}>@{user.username}</span>
                      {statusLabel}
                      {button}
                    </li>
                  );
                })}
            </ul>
          )}
          <hr style={{ margin: "2em 0", width: "100%" }} />
          <h2>Incoming Friend Requests</h2>
          {loadingRequests && <p>Loading friend requests...</p>}
          {errorRequests && <p style={{ color: "red" }}>{errorRequests}</p>}
          {!loadingRequests && friendRequests.length === 0 && <p>No incoming friend requests.</p>}
          {!loadingRequests && friendRequests.length > 0 && (
            <ul>
              {friendRequests.map((req) => (
                <li key={req.id} style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                  <span role="img" aria-label="request" style={{ fontSize: "1.5em" }}>📨</span>
                  <span>{req.sender.name}</span>
                  <span style={{ color: "gray", marginLeft: "0.5em" }}>@{req.sender.username}</span>
                  <button
                    style={{ marginLeft: "1em", padding: "0.3em 0.8em", borderRadius: "4px", border: "1px solid #ccc", background: req.accepted ? "#e0ffe0" : "#e0ffe0", cursor: req.accepted ? "default" : "pointer" }}
                    onClick={() => handleAcceptFriendRequest(req.sender.id)}
                    disabled={req.accepted || acceptedRequests.includes(req.sender.id)}
                  >
                    {req.accepted || acceptedRequests.includes(req.sender.id) ? "Accepted" : "Accept"}
                  </button>
                  {!req.accepted && !acceptedRequests.includes(req.sender.id) && (
                    <button
                      style={{ marginLeft: "0.5em", padding: "0.3em 0.8em", borderRadius: "4px", border: "1px solid #ccc", background: "#ffe0e0", cursor: "pointer" }}
                      onClick={() => handleRejectFriendRequest(req.sender.id)}
                    >
                      Reject
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CenteredContainer>
      );
}

export default Friends;