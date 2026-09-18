export const SearchBar: React.FC<{
  placeholderText: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  ariaLabel?: string;
}> = ({ placeholderText, search, setSearch, ariaLabel }) => {
  return (
    <div className="mb-3">
      <input
        type="search"
        aria-label={ariaLabel}
        className="form-control searchbar"
        placeholder={placeholderText}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};
