import { Link, NavLink } from "react-router-dom";

const Header = () => (
  <header className="header">
    <div className="container d-flex flex-wrap align-items-center justify-content-between gap-2">
      <Link className="brand" to="/">
        <img src="/media/ucdavis-white-logo.svg" alt="UC Davis" /> Finjector
      </Link>
      <nav aria-label="Primary">
        <NavLink className="header-link" to="/" end>
          Chart Strings
        </NavLink>
        <NavLink className="header-link" to="/teams">
          Teams
        </NavLink>
        <NavLink className="header-link" to="/bulk">
          Bulk Validate
        </NavLink>
        <NavLink className="header-link" to="/help">
          Help
        </NavLink>
      </nav>
    </div>
  </header>
);
export default Header;
