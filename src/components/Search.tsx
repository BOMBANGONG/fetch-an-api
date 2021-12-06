import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

type User = {
  login: string;
};

type Response = {
  items?: User[];
  documentation_url?: string;
  message?: string;
};

const initialState: Response = {
  items: [],
  message: undefined,
};

const Search: React.FC = () => {
  const [users, setUsers] = useState("");
  const [repos, setRepos] = useState(initialState);

  const handleChange = (e: any) => {
    setUsers(e.target.value);
  };

  useEffect(() => {
    if (!users) {
      return;
    }
    fetch("https://api.github.com/search/users?q=" + users)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          setRepos({ ...initialState, message: data.message });
        } else {
          setRepos(data);
        }
      });
  }, [users]);

  const debouncedOnChange = debounce(handleChange, 500);

  console.log(repos);
  return (
    <>
      <input
        type="text"
        placeholder=" search github user"
        onChange={debouncedOnChange}
      />
      {repos.message ? (
        repos.message
      ) : (
        <ul>
          {repos.items?.map((item: any) => {
            return <li key={item.id}>{item.login}</li>;
          })}
        </ul>
      )}
    </>
  );
};

export default Search;
