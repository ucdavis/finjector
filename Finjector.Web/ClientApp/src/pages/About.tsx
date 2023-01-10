import React from "react";
import { Link } from "react-router-dom";
import { useUserInfoQuery } from "../queries/userQueries";

const About = () => {
  const userInfoQuery = useUserInfoQuery();
  const user = useUserInfoQuery();

  // wait until we get user info to render
  if (userInfoQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>
        {user.isSuccess &&
          user.data[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ]}
      </p>
      <p>
        This application was developed by the CAES Dean's Offic Computer
        Resource Unit! <hr />
        It uses the Aggie Enterprise Graph QL to build a COA from the campus
        data source
      </p>
      <Link className="App-link" to="/">
        Back home
      </Link>
      <hr />
      <a href="https://caeshelp.ucdavis.edu/?appname=Finjector">Help</a>
    </div>
  );
};

export default About;
