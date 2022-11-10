import { Link } from "react-router-dom";

const Header = () => (
  <div className="header">
    <div className="container">
      <div className="row">
        <Link to="/landing">
          <img src="/media/coa-logo.svg" alt="" />
        </Link>
      </div>
    </div>
  </div>
);
export default Header;
