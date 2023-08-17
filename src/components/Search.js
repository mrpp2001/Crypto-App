import React, { useContext, useState } from "react";
import searchIcon from "../assets/search-icon.svg";
import { CryptoContext } from "../context/CryptoContext";
import debounce from "lodash.debounce";

// Component for search input and results
const SearchInput = ({ handleSearch }) => {
  // State to manage the input text and search results
  const [searchText, setSearchText] = useState("");

  // Accessing data and functions from the CryptoContext
  let { searchData, setCoinSearch, setSearchData } = useContext(CryptoContext);

  // Function to handle text input changes
  let handleInput = (e) => {
    e.preventDefault();
    let query = e.target.value;
    setSearchText(query);
    handleSearch(query); // Call the search function with the input text // Trigger the debounced search function.
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchText); // Call the search function with the current search text // Trigger the debounced search function.
  };

  // Function to select a coin result
  const selectCoin = (coin) => {
    setCoinSearch(coin);
    setSearchText("");
    setSearchData(); // Clear search data after selecting a coin
  };

  return (
    <>
      {/* Search form */}
      <form
        className="w-96 relative flex items-center ml-7 font-nunito"
        onSubmit={handleSubmit}
      >
        {/* Input field */}
        <input
          type="text"
          name="search"
          onChange={handleInput}
          value={searchText}
          className="w-full rounded bg-gray-200 placeholder:text-gray-100 pl-2 required outline-0 border border-transparent focus:border-cyan"
          placeholder="search here..."
        />

        {/* Search button */}
        <button type="submit" className="absolute right-1 cursor-pointer">
          <img src={searchIcon} className="w-full h-auto" alt="search" />
        </button>
      </form>

      {/* Display search results */}
      {searchText.length > 0 ? (
        <ul className="absolute top-11 right-0 w-96 h-96 rounded overflow-x-hidden py-2 bg-gray-200 bg-opacity-60 backdrop-blur-md scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-200">
          {searchData ? (
            // Loop through search results and display each coin
            searchData.map((coin) => {
              return (
                <li
                  className="flex items-center ml-4 my-2 cursor-pointer"
                  key={coin.id}
                  onClick={() => selectCoin(coin.id)}
                >
                  {/* Display coin image */}
                  <img
                    className="w-[1rem] h-[1rem] mx-1.5"
                    src={coin.thumb}
                    alt={coin.name}
                  />
                  {/* Display coin name */}
                  <span>{coin.name}</span>
                </li>
              );
            })
          ) : (
            // Show loading indicator if search data is not available
            <div className="w-full h-full flex justify-center items-center">
              <div
                className="w-8 h-8 border-4 border-cyan rounded-full border-b-gray-200 animate-spin"
                role="status"
              />
              <span className="ml-2">Searching...</span>
            </div>
          )}
        </ul>
      ) : null}
    </>
  );
};

// Component for the overall search functionality
const Search = () => {
  // Access the search function from the CryptoContext
  let { getSearchResult } = useContext(CryptoContext);

  // Create a debounced search function to avoid frequent requests
  const debounceFunc = debounce(function (val) {
    getSearchResult(val);
  }, 2000);

  return (
    <div className="relative">
      {/* Render the SearchInput component with the debounced search function */}
      <SearchInput handleSearch={debounceFunc} />
    </div>
  );
};

export default Search;
