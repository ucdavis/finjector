import React from "react";
import { SearchBar } from "../../components/SearchBar";

const MyTeams: React.FC = () => {
  const [search, setSearch] = React.useState("");

  // TODO: query for teams

  return (
    <div>
      <SearchBar
        placeholderText="Search My Teams"
        search={search}
        setSearch={setSearch}
      />
      <button className="btn btn-outline-secondary flex-fill me-3" type="button">
        Create New Team
      </button>
    </div>
  );
};

export default MyTeams;
