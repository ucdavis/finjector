import React from "react";
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
    <div className="help-wrapper">
      <div className="page-title mb-3">
        <h1>Welcome to Finjector</h1>
      </div>
      <div className="row">
        <div className="col-md-8">
          <p>
            Finjector is a tool to help you build, share, and use the new Aggie
            Enterprise Chart strings.
          </p>
          <p>
            Chart strings are long pieces of code that can be used to charge
            accounts on campus. Each segment relates to a specific fund/entity.
            here is an example one:
            <br />
            <code>000-0000-0000</code>
          </p>
          <p></p>
          <p>
            Chart strings can be either
            <b>
              <span className="gl-color"> GL </span>
            </b>
            or
            <b>
              <span className="ppm-color"> PPM </span>
            </b>
            and they are placed within folders, folders are within teams, each
            with a list admin users and permissions associated with it.
          </p>
          <br />
          <br />
          <div className="card">
            <div className="card-body">
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
                . It&nbsp;uses the Aggie Enterprise Graph QL to build a Chart
                string from the campus data source.
              </p>
              <p>
                Welcome:{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://computing.caes.ucdavis.edu/documentation/finjector/welcome"
                >
                  https://computing.caes.ucdavis.edu/documentation/finjector/welcome
                </a>
              </p>
              <p>
                FAQ:{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://computing.caes.ucdavis.edu/documentation/finjector/faq"
                >
                  https://computing.caes.ucdavis.edu/documentation/finjector/faq
                </a>
              </p>
              <p>
                Documentation:{" "}
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
        </div>
        <div className="col-md-4"></div>
      </div>
    </div>
  );
};

export default About;
