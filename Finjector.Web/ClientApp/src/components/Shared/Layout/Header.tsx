import { Link } from "react-router-dom";

const CenteredBullet = () => (
  <span
    className="header-link"
    style={{
      marginLeft: "0.5em",
      marginRight: "0.5em",
      color: "white",
    }}
  >
    &bull;
  </span>
);

const Header = () => (
  <div className="header">
    <div className="container">
      <div className="row justify-content-between">
        <div className="col-6">
          <Link to="/">
            <h1 className="d-flex align-items-center">
              <img src="/media/ucdavis-white-logo.svg" alt="" /> Finjector
            </h1>
          </Link>
        </div>
        <div className="col-6 text-end">
          <Link className="header-link" to="/">
            Chart Strings
          </Link>
          <CenteredBullet />
          <Link className="header-link" to="/teams">
            Teams
          </Link>
          <CenteredBullet />
          <Link className="header-link" to="/bulk">
            Bulk Validate
          </Link>
          <CenteredBullet />
          <Link className="header-link" to="/help">
            Help
          </Link>
        </div>
      </div>
    </div>
  </div>
);
export default Header;
