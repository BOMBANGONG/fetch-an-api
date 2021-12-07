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
  const [rateLimit, setRateLimit] = useState(Number.MAX_SAFE_INTEGER);

  const isOffLimit = rateLimit < 1;

  const handleChange = (e: any) => {
    setUsers(e.target.value);
  };

  useEffect(() => {
    let timeoutId: unknown;
    if (isOffLimit) {
      timeoutId = setTimeout(() => {
        setRateLimit(Number.MAX_SAFE_INTEGER);
      }, 5000);
    }
    return () => clearTimeout(timeoutId as NodeJS.Timeout);
  }, [isOffLimit]);

  useEffect(() => {
    if (!users) {
      return;
    }
    fetch("https://api.github.com/search/users?q=" + users)
      .then((response) => {
        let apiCallsRemaining = parseInt(
          response.headers.get("x-ratelimit-remaining") || ""
        );

        if (Number.isNaN(apiCallsRemaining))
          apiCallsRemaining = Number.MAX_SAFE_INTEGER;
        setRateLimit(apiCallsRemaining);
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
        disabled={isOffLimit}
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
