import React, { useState } from "react";
import "./BookmarkForm.css";

const BookmarkForm = ({ onBookmarkAdded }) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    fetch("/api/create.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, link }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add bookmark");
        }
        setTitle("");
        setLink("");
        onBookmarkAdded();
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="bookmark-form">
      <h2 className="form-header">Add a New Bookmark</h2>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bookmark Title"
            className="form-input"
            required
          />
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Bookmark Link"
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="form-button">
          Add
        </button>
      </form>
    </div>
  );
};

export default BookmarkForm;
