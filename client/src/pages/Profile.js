import React from "react";
import { useParams, Redirect } from "react-router-dom";
import FriendList from "../components/FriendList";
import ThoughtList from "../components/ThoughtList";
// import FriendList from "../components/FriendList";
import { useQuery } from "@apollo/react-hooks";
import Auth from "../utils/Auth";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};
  if (Auth.loggedIn && Auth.getProfile().data.username === userParam) {
    console.log("true");
    return <Redirect to="/profile" />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links
        above to sign up or log in!
      </h4>
    );
  }
  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {user.username}'s profile.
        </h2>
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>
        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            friends={user.friends}
            friendCount={user.friendCount}
            username={user.username}
          />
        </div>
      </div>
    </div>
  );
};
export default Profile;
