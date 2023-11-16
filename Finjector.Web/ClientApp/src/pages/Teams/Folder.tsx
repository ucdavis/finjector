import React from "react";
import { SearchBar } from "../../components/SearchBar";
import { useParams } from "react-router-dom";
import { useGetFolder } from "../../queries/folderQueries";
import ChartList from "../../components/ChartList";

// show folder info w/ charts
const Folder: React.FC = () => {
  const { id, folderId } = useParams<{ id: string; folderId: string }>();

  const [search, setSearch] = React.useState("");

  const folderModel = useGetFolder(folderId);

  return (
    <div>
      <SearchBar
        placeholderText="Search Within Group"
        search={search}
        setSearch={setSearch}
      />

      <h3>Folder name: {folderModel.data?.folder.name}</h3>
      <h3>Team name: {folderModel.data?.folder.teamName}</h3>
      <ChartList charts={folderModel.data?.charts} filter={search} />
    </div>
  );
};

export default Folder;
