import React from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useParams } from "react-router-dom";
import { useGetFolder } from "../../queries/folderQueries";
import ChartList from "../../components/Shared/ChartList";
import { BackLinkBar } from "../../components/Shared/BackLinkBar";

// show folder info w/ charts
const Folder: React.FC = () => {
  const { id, folderId } = useParams<{ id: string; folderId: string }>();

  const [search, setSearch] = React.useState("");

  const folderModel = useGetFolder(folderId);

  return (
    <div>
      <BackLinkBar />
      <div className="page-title">
        <h1>{folderModel.data?.folder.name}</h1>
      </div>
      <div className="page-info mb-3">
        <p>Team - {folderModel.data?.folder.teamName}</p>
        <p>Admins: x y z</p>
      </div>
      <div className="mb-3">
        <SearchBar
          placeholderText="Search Within Folder"
          search={search}
          setSearch={setSearch}
        />
      </div>
      <ChartList charts={folderModel.data?.charts} filter={search} />
    </div>
  );
};

export default Folder;
