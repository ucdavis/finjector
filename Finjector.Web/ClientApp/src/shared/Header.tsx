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
            <img src="/media/coa-logo.svg" alt="" />
          </Link>
        </div>
        <div className="col-6 text-end">
          <Link className="header-link" to="/">
            Charts
          </Link>
          <CenteredBullet />
          <Link className="header-link" to="/teams">
           Teams
          </Link>
          <CenteredBullet />
          <Link className="header-link" to="/about">
            About
          </Link>
        </div>
      </div>
    </div>
  </div>
);
export default Header;
