import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import "./styles.css";

const SearchResults = ({ onRepoSelect, onRepoDelete, results }) => {
  //displays the results of the search in a list format.
  const renderResults = (arr) => {
    return arr.map((repo) => (
      <div key={repo.id} className="repo-row">
        <h3>{repo.name}</h3>
        <button className="repo-btn-details" onClick={() => onRepoSelect(repo)}>
          Details
        </button>
        <p className="repo-btn-delete" onClick={() => onRepoDelete(repo)}>
          <DeleteIcon />
        </p>
      </div>
    ));
  };

  return <div id="results-container">{renderResults(results)}</div>;
};

export default SearchResults;
