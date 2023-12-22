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
            Chart strings are long combinations of accounting information that
            are used to track expenses and revenue on campus. Each segment
            contains a value that relates to a specific element of the Chart of
            Accounts such as Fund or Financial Department. Here is an example of
            a chart string:
            <br />
            <code>0000000000-000000-0000000-000000</code>
          </p>
          <p></p>
          <p>
            Chart strings can be either
            <b>
              <span className="gl-color"> GL </span>
            </b>
            (General Ledger) or
            <b>
              <span className="ppm-color"> PPM </span>
            </b>
            (Project Portfolio Manager) and they are placed within a folder.
            Folders are within teams, each with a list of users and permissions.
          </p>
          <p>
            Permissions include View (can view and use chart strings), Edit (can
            view and edit chart strings), and Admin (can view and edit chart
            strings, and can also edit permissions). They are placed within
            folders, folders are within teams, each with a list admin users and
            permissions associated with it.
          </p>
          <br />
          <br />
          <div className="card">
            <div className="card-body">
              <p>
                If you have questions about chart string validation errors you
                may submit a help ticket to Aggie Enterprise here:
                <p>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://ucdavisit.service-now.com/servicehub?id=ucd_cat_item&sys_id=69aaee7a1bf7291094087bff034bcb48"
                  >
                    Aggie Enterprise Help Form
                  </a>
                </p>
              </p>
              <p>
                <b>Note!</b> They do not run Finjector and will not know about
                other issues you may have with our application
              </p>
            </div>
          </div>
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
