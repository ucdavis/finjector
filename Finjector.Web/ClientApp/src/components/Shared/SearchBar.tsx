export const SearchBar: React.FC<{
  placeholderText: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}> = ({ placeholderText, search, setSearch }) => {
  return (
    <div className="mb-3">
      <input
        type="search"
        className="form-control"
        placeholder={placeholderText}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};
