import React, { useEffect, useState, useContext } from "react";
import MainNavWithComponent from "../MainNavWithComponent";
import { APIContext } from "../contexts/APIContext";

function Friends() {
  const api = useContext(APIContext);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  api.getFriends((data) => {
    setFriends(data);
    setLoading(false);
    }, (err) => {
      setError("Failed to fetch friends");
      setLoading(false);
    });
  } , [api]);

  return (
    <MainNavWithComponent>
      <h1>Friends</h1>
      {loading && <p>Loading friends...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && friends.length === 0 && <p>You have no friends yet.</p>}
      {!loading && friends.length > 0 && (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>{friend.name || friend.username || friend.email}</li>
          ))}
        </ul>
      )}
    </MainNavWithComponent>
  );
}

export default Friends;