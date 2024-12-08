import React, { useEffect, useState } from "react";
import "./BookmarkList.css";

const BookmarkList = ({ refresh }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch("/api/readAll.php");
        if (!response.ok) throw new Error("Failed to fetch bookmarks");
        const data = await response.json();
        setBookmarks(data);
        setFilteredBookmarks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [refresh]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = bookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        bookmark.link.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredBookmarks(filtered);
  }, [searchTerm, bookmarks]);

  const startEditing = (bookmark) => {
    setEditing(bookmark.id);
    setTitle(bookmark.title);
    setLink(bookmark.link);
  };

  const cancelEditing = () => {
    setEditing(null);
    setTitle("");
    setLink("");
  };

  const saveChanges = async (id) => {
    try {
      const response = await fetch("/api/update.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, link }),
      });
      if (!response.ok) throw new Error("Failed to update bookmark");
      setBookmarks((prev) =>
        prev.map((bookmark) =>
          bookmark.id === id ? { ...bookmark, title, link } : bookmark
        )
      );
      cancelEditing();
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      const response = await fetch("/api/delete.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete bookmark");
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1 className="heading">My Bookmarks</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
        placeholder="Search bookmarks..."
      />
      {filteredBookmarks.length === 0 ? (
        <p>No bookmarks found.</p>
      ) : (
        <ul className="list">
          {filteredBookmarks.map((bookmark) => (
            <li key={bookmark.id} className="item">
              {editing === bookmark.id ? (
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="edit-input"
                  />
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="edit-input"
                  />
                  <button
                    className="save-button"
                    onClick={() => saveChanges(bookmark.id)}
                  >
                    Save
                  </button>
                  <button className="cancel-button" onClick={cancelEditing}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <a
                    href={
                      bookmark.link.startsWith("http")
                        ? bookmark.link
                        : `https://${bookmark.link}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3>{bookmark.title}</h3>
                  </a>
                  <p>{bookmark.link}</p>
                  <p>Added/Updated On: {new Date(bookmark.date_added).toLocaleString()}</p>
                  <button
                    className="edit-button"
                    onClick={() => startEditing(bookmark)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteBookmark(bookmark.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookmarkList;
