import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "./contexts/APIContext";

// const Badges = () => {
//   const api = useContext(APIContext);
//   const [badges, setBadges] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBadges = async () => {
//       const userId = 1; // replace with real logged-in user id

//       try {
//         const result = await api.getBadgesForUser(userId);
//         setBadges(result);
//       } catch (error) {
//         console.error("Error fetching badges:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBadges();
//   }, []);

//   if (loading) return <div>Loading badges...</div>;

//   return (
//     <div>
//       <h1>My Badges</h1>
//       {badges.length === 0 ? (
//         <p>No badges yet.</p>
//       ) : (
//         <ul>
//           {badges.map((badge) => (
//             <li key={badge.id}>
//               <h3>{badge.name}</h3>
//               <p>{badge.description}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Badges;

const Badges = () => {
  const api = useContext(APIContext);
  api.getBadgesForUser(1).then((badges) => {
    console.log("Badges for user:", badges);
  });
  return (
    <div>
      <h1>My Badges</h1>
    </div>
  );
};

export default Badges;