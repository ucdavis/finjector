import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import ChartList from "../components/Shared/ChartList";
import { useGetSavedCharts } from "../queries/storedChartQueries";
import FinjectorButton from "../components/Shared/FinjectorButton";
import PageTitle from "../components/Shared/StyledComponents/PageTitle";
import PageBody from "../components/Shared/StyledComponents/PageBody";
import { SearchBar } from "../components/Shared/SearchBar";

// Main landing screen for popup

const Landing = () => {
  const [search, setSearch] = React.useState("");

  const savedCharts = useGetSavedCharts();

  return (
    <div>
      <PageTitle>
        <div className="col-12 col-md-4">
          <h1>My Chart Strings</h1>
        </div>
        <div className="col-12 col-md-8 text-end">
          <FinjectorButton to="/entry">
            <FontAwesomeIcon icon={faPlus} />
            New Chart String from Scratch
          </FinjectorButton>

          <FinjectorButton to="/paste">
            <FontAwesomeIcon icon={faPaperclip} />
            New Chart String from Paste
          </FinjectorButton>
        </div>
      </PageTitle>
      <PageBody>
        <SearchBar
          placeholderText="Search my chart strings, teams and folders"
          search={search}
          setSearch={setSearch}
        />
        <ChartList teamGroups={savedCharts.data} filter={search} />
      </PageBody>
    </div>
  );
};

export default Landing;
