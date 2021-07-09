import React from "react";
import StarIcon from "@material-ui/icons/Star";
import "./styles.css";

const RepoCard = ({ repo, onCloseModal }) => {
  return (
    <div className="repo-card">
      <div className="repo-card-header">
        <img
          className="repo-card-avatar"
          src={repo.owner.avatar_url}
          width="70px"
          alt="user-avatar"
        />
        <p className="repo-card-watchers">
          <StarIcon />
          {repo.watchers_count}
        </p>
      </div>
      <div className="repo-card-content">
        <h3>{repo.name}</h3>
        <p>{repo.description}</p>
      </div>
      <div className="repo-card-actions">
        <button className="btn-close-modal" onClick={onCloseModal}>
          Go back
        </button>
        <a
          className="btn-visit-repo"
          href={repo.html_url}
          rel="noreferrer"
          target="_blank"
        >
          Go to Github
        </a>
      </div>
    </div>
  );
};

export default RepoCard;
