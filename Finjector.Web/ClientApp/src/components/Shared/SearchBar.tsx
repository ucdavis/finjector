import { useId } from "react";

export const SearchBar: React.FC<{
  placeholderText: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  ariaLabel?: string;
}> = ({ placeholderText, search, setSearch, ariaLabel }) => {
  const id = useId();
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>{ariaLabel ?? "Search"}</label>
      <input
        id={id}
        type="search"
        aria-label={ariaLabel ?? placeholderText}
        className="form-control searchbar"
        placeholder={placeholderText}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};
