import React from "react";
import {SearchBar} from "../../components/SearchBar";
import {useGetMyTeams} from "../../queries/teamQueries";
import TeamList from "../../components/Teams/TeamList";

const MyTeams: React.FC = () => {
    const [search, setSearch] = React.useState("");

    const myTeams = useGetMyTeams();

    return (
        <div>
            <SearchBar
                placeholderText="Search My Teams"
                search={search}
                setSearch={setSearch}
            />
            <TeamList teamsInfo={myTeams.data} filter={search}/>
            <button className="btn btn-outline-secondary flex-fill me-3" type="button">
                Create New Team
            </button>
        </div>
    );
};

export default MyTeams;
