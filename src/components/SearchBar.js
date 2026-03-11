import React from "react";

const SearchBar = ({ value, onChange, placeholder, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch && onSearch();
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5em", width: "100%", maxWidth: "400px", marginBottom: "1em" }}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Search..."}
        style={{
          padding: "0.5em 1em",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "100%",
          fontSize: "1em"
        }}
      />
      <button
        type="button"
        onClick={onSearch}
        style={{
          padding: "0.5em 1em",
          borderRadius: "4px",
          border: "1px solid #ccc",
          background: "#eee",
          cursor: "pointer"
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
