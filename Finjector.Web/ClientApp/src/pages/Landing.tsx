import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import ChartList from "../components/Landing/ChartList";
import { useGetSavedCharts } from "../queries/storedChartQueries";
import FinButton from "../components/Shared/FinButton";
import PageTitle from "../components/Shared/Layout/PageTitle";
import PageBody from "../components/Shared/Layout/PageBody";
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
          <FinButton to="/entry">
            <FontAwesomeIcon icon={faPlus} />
            New Chart String from Scratch
          </FinButton>

          <FinButton to="/paste">
            <FontAwesomeIcon icon={faPaperclip} />
            New Chart String from Paste
          </FinButton>
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
