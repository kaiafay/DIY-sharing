import React from "react";
import { Navigate, useParams } from "react-router-dom";
import ProjectList from "../components/ProjectList";
import SavedProjectsList from "../components/SavedProjectsList";
import { useQuery } from "@apollo/client";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";
import ProjectForm from "../components/ProjectForm";

const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
    fetchPolicy: "cache-and-network"
  });

  const user = data?.me || data?.user || {};

  // navigate to personal profile page if username is the logged-in user's
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
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
          Viewing {userParam ? `${user.username}'s` : "your"} profile.
        </h2>
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ProjectList
            projects={user.projects}
            title={`${user.username}'s projects:`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <SavedProjectsList savedProjects={user.savedProjects} />
        </div>
      </div>
      <div className="mb-3">{!userParam && <ProjectForm />}</div>
    </div>
  );
};

export default Profile;
