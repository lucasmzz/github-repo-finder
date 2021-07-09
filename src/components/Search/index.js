import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import ReactModal from "react-modal";
import GitHubIcon from "@material-ui/icons/GitHub";

import RepoCard from "../RepoCard";
import SearchResults from "../SearchResults";
const Search = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [selectedRepo, setSelectedRepo] = useState({});
  const [showSelectedRepo, setShowSelectedRepo] = useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      fontFamily: "sans-serif",
      textAlign: "center",
      minWidth: "50vw",
      maxWidth: "75vw"
    }
  };

  //load resultset stored in localStorage if there is anything.
  useEffect(() => {
    const data = localStorage.getItem("repo-results");
    if (data) {
      setResults(JSON.parse(localStorage.getItem("repo-results")));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("repo-results", JSON.stringify(results));
  });

  const handleSearchTermChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  const handleSearchTermSubmit = async (e) => {
    e.preventDefault();

    setResults([]);
    const regex = /\W+/gi;
    if (regex.test(searchTerm)) {
      setError(`Invalid search term ${searchTerm}.`);
      return;
    }
    if (error) {
      setError("");
    }
    try {
      setLoading(true);
      const result = await axios.get(
        `https://api.github.com/search/repositories?q=${searchTerm}`
      );
      if (result.data.items.length > 0) {
        //sorting results by popularity based on watchers count
        const sorted = result.data.items.sort((a, b) =>
          a.watchers_count < b.watchers_count
            ? 1
            : b.watchers_count < a.watchers_count
            ? -1
            : 0
        );
        setResults(sorted);
        setLoading(false);
      } else {
        setError("No repositories found. Please try something else.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRepo = (repo) => {
    const consent = window.confirm(
      `Do you want to remove ${repo.name} from the list?`
    );
    if (consent) setResults(results.filter((item) => item.id !== repo.id));
  };

  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
    setShowSelectedRepo(true);
  };

  const handleClearResults = (e) => {
    e.preventDefault();
    setSearchTerm("");
    setError("");
    setResults([]);
  };

  const Loading = () => {
    return <div id="loading">Loading...</div>;
  };

  const ErrorPanel = () => {
    return <div id="error-panel">{error}</div>;
  };

  const ResultsCounter = () => {
    return (
      <div id="results-counter">
        <small>
          <strong>{results.length}</strong> results matched your search
          criteria.
        </small>
      </div>
    );
  };

  return (
    <div id="search-container">
      <div id="search-bar">
        <p id="search-bar-logo">
          <GitHubIcon style={{ fontSize: 70 }} />
        </p>
        <h1 id="search-bar-title">Github Public Repo Finder</h1>
        <form onSubmit={handleSearchTermSubmit} id="search-form">
          <input
            onChange={handleSearchTermChange}
            id="search-term"
            type="text"
            value={searchTerm}
            placeholder="Enter a search term"
            name="search-term"
            required
          />
          <button className="btn" id="btn-search" type="submit">
            Search
          </button>
          <button className="btn" onClick={handleClearResults} id="btn-clear">
            Clear
          </button>
        </form>
      </div>
      {error && <ErrorPanel />}
      {results.length > 0 && <ResultsCounter />}
      {loading && <Loading />}
      <div id="results-container">
        {results.length > 0 && (
          <SearchResults
            onRepoDelete={handleDeleteRepo}
            onRepoSelect={handleSelectRepo}
            results={results}
          />
        )}
      </div>

      <ReactModal
        isOpen={showSelectedRepo}
        style={customStyles}
        onRequestClose={() => setShowSelectedRepo(false)}
      >
        <RepoCard
          repo={selectedRepo}
          onCloseModal={() => setShowSelectedRepo(false)}
        />
      </ReactModal>
    </div>
  );
};

export default Search;
