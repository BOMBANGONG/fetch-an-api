import { useState } from "react";

const Search: React.FC = () => {
  const [searchItem, setSearchItem] = useState("");

  const handleChange = (e: any) => {
    setSearchItem(e.target.value);
  };

  return (
    <>
      <input
        type="text"
        placeholder="search..."
        value={searchItem}
        onChange={handleChange}
      />
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </>
  );
};

export default Search;
