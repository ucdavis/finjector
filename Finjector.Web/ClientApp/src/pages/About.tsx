import React from "react";
import { Link } from "react-router-dom";
import { useUserInfoQuery } from "../queries/userQueries";
import { HomeLinkBar } from "../components/Shared/HomeLinkBar";

const About = () => {
  const userInfoQuery = useUserInfoQuery();
  const user = useUserInfoQuery();

  // wait until we get user info to render
  if (userInfoQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <HomeLinkBar />
        <p>
          <b>Current user:</b>{" "}
          {user.isSuccess &&
            user.data[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ]}
        </p>
        <p>
          This application was developed by the CAES Dean's Office{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://computing.caes.ucdavis.edu"
          >
            Computer Resources Unit
          </a>
          . It&nbsp;uses the Aggie Enterprise Graph QL to build a Chart string
          from the campus data source.
        </p>
        <p>
          FAQ:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://computing.caes.ucdavis.edu/documentation/finjector"
          >
            https://computing.caes.ucdavis.edu/documentation/finjector
          </a>
        </p>
        You can submit a support ticket:{" "}
        <a href="https://caeshelp.ucdavis.edu/?appname=Finjector">here</a>
      </div>
    </div>
  );
};

export default About;
