import React from "react";
import { useQuery } from "@apollo/client";
import { QUERY_PROJECTS, QUERY_ME_BASIC } from "../utils/queries";
import ProjectList from "../components/ProjectList";
import Auth from "../utils/auth";
import SavedProjectsList from "../components/SavedProjectsList";
import ProjectForm from "../components/ProjectForm";

const Home = () => {
  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_PROJECTS);
  const projects = data?.projects || [];

  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC, {fetchPolicy: 'cache-and-network'});

  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className="flex-row justify-space-between">
        {loggedIn && (
          <div className="col-12 mb-3">
            <ProjectForm />
          </div>
        )}
        <div className={`col-12 mb-3 ${loggedIn && "col-lg-8"}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ProjectList projects={projects} title="Find a DIY Project" />
          )}
        </div>
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <SavedProjectsList savedProjects={userData.me.savedProjects} />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
