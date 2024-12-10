import React, { useState } from "react";
import BookmarkList from "./BookmarkList";
import BookmarkForm from "./AddingForm";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleBookmarkAdded = () => {
    setRefresh(!refresh); // To reload the list
  };

  return (
    <div>
      <BookmarkForm onBookmarkAdded={handleBookmarkAdded} />
      <BookmarkList refresh={refresh} />
    </div>
  );
}

export default App;
