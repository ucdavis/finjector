import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

const Breadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((path) => path !== "");

  if (paths.length === 0 || paths[0] === "locator") {
    return null; // Don't render anything if we are on the homepage or the base /locator path
  }

  // TODO: remove we just want to hide the crumbs
  return null;

  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Link to="/">Home</Link>
      </BreadcrumbItem>
      {paths.map((path, index) => (
        <BreadcrumbItem key={index}>
          {index === paths.length - 1 ? (
            <span>{path.charAt(0).toUpperCase() + path.slice(1)}</span>
          ) : (
            <Link to={`/${paths.slice(0, index + 1).join("/")}`}>
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </Link>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
