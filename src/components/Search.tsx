import { useState, useEffect } from "react";
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
    e.preventDefault();
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

  console.log(repos);
  return (
    <>
      <input
        type="text"
        placeholder=" search github user"
        onChange={handleChange}
      />
      {repos.message ? repos.message : null}
      <ul>
        {repos.items?.map((item: any) => {
          return <li>{item.login}</li>;
        })}
      </ul>
    </>
  );
};

export default Search;
