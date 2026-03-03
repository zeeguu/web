import React, { useEffect, useState, useContext } from "react";
import MainNavWithComponent from "../MainNavWithComponent";
import CenteredContainer from "../components/CenteredContainer";
import { APIContext } from "../contexts/APIContext";
import SearchBar from "../components/SearchBar";

function Friends() {
  const api = useContext(APIContext);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFriendSearch, setNewFriendSearch] = useState("");
  const [newFriendResults, setNewFriendResults] = useState([]);
  const [searchingNewFriends, setSearchingNewFriends] = useState(false);
  const [newFriendError, setNewFriendError] = useState(null);
  const [pendingSearch, setPendingSearch] = useState("");
  const [sendingRequestId, setSendingRequestId] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorRequests, setErrorRequests] = useState(null);

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
    api.searchNewFriends(pendingSearch,
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
    api.sendFriendRequest(receiver_id, (response) => {
      setSendingRequestId(null);
      setSentRequests((prev) => [...prev, receiver_id]);
    });
  };

  const handleAcceptFriendRequest = (sender_id) => {
    api.acceptFriendRequest(sender_id, (response) => {
      // Remove the accepted request from the list
      setFriendRequests((prev) => prev.filter((req) => req.sender_id !== sender_id));
      // Fetch updated friends list
      api.getFriends((data) => {
        setFriends(data);
      });
    });
  };

  return (
    <MainNavWithComponent>
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
              </li>
            ))}
          </ul>
        )}
        <hr style={{ margin: "2em 0", width: "100%" }} />
        <h2>Find New Friends</h2>
        <SearchBar
          value={pendingSearch}
          onChange={e => setPendingSearch(e.target.value)}
          placeholder="Search for new friends..."
          onSearch={handleNewFriendSearch}
        />
        {searchingNewFriends && <p>Searching...</p>}
        {newFriendError && <p style={{ color: "red" }}>{newFriendError}</p>}
        {pendingSearch && !searchingNewFriends && newFriendResults.length === 0 && <p>No users found.</p>}
        {newFriendResults.length > 0 && (
          <ul>
            {newFriendResults.map((user) => (
              <li key={user.id} style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                <span role="img" aria-label="user" style={{ fontSize: "1.5em" }}>🧑</span>
                <span>{user.name}</span>
                <span style={{ color: "gray", marginLeft: "0.5em" }}>@{user.username}</span>
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
              </li>
            ))}
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
                  style={{ marginLeft: "1em", padding: "0.3em 0.8em", borderRadius: "4px", border: "1px solid #ccc", background: "#e0ffe0", cursor: "pointer" }}
                  onClick={() => handleAcceptFriendRequest(req.sender.id)}
                >
                  Accept
                </button>
              </li>
            ))}
          </ul>
        )}
      </CenteredContainer>
    </MainNavWithComponent>
  );
}

export default Friends;