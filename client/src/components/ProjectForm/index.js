import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PROJECT } from "../../utils/mutations";
import { QUERY_PROJECTS, QUERY_ME } from "../../utils/queries";

const ProjectForm = () => {
  const [projectText, setText] = useState("");
  const [projectTitle, setTitle] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [addProject, { error }] = useMutation(ADD_PROJECT, {
    update(cache, { data: { addProject } }) {
      try {
        // update me array's cache
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, projects: [...me.projects, addProject] } },
        });
      } catch (e) {
        console.log(e);
      }

      // could potentially not exist yet, so wrap in a try/catch
      try {
        // update project array's cache
        const { projects } = cache.readQuery({ query: QUERY_PROJECTS });
        cache.writeQuery({
          query: QUERY_PROJECTS,
          data: { projects: [addProject, ...projects] },
        });
      } catch (e) {
        console.log(e);
      }
    },
  });

  const handleTitleChange = (event) => {
    if(event.target.value.length <= 280) {
      setTitle(event.target.value);
    }
  };

  const handleTextChange = (event) => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // add project to database
      await addProject({
        variables: { projectTitle, projectText },
      });

      // clear form value
      setTitle("");
      setText("");
      setCharacterCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <p
        className={`m-0 ${characterCount === 280 || error ? "text-error" : ""}`}
      >
        Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="Title..."
          value={projectTitle}
          className="form-input col-12 col-md-9"
          onChange={handleTitleChange}
        ></textarea>
        <textarea
          placeholder="Here's a new project..."
          value={projectText}
          className="form-input col-12 col-md-9"
          onChange={handleTextChange}
        ></textarea>
        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
