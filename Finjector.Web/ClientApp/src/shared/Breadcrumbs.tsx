import React from "react";
import { Link, useMatches } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

const Breadcrumbs = () => {
  // will return an array of matches objects.  we just want the last one with the `handle` object
  const matches = useMatches();

  const matchesWithHandle = matches.filter((m) => m.handle);

  const handleMatch = matchesWithHandle[matchesWithHandle.length - 1];

  const teamId = handleMatch?.params?.teamId;
  const folderId = handleMatch?.params?.folderId;
  const title = (handleMatch?.handle as { title: string })?.title;

  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Link to="/">Home</Link>
      </BreadcrumbItem>
      {teamId && (
        <BreadcrumbItem>
          <Link to={`/teams/${teamId}`}>Team</Link>
        </BreadcrumbItem>
      )}
      {folderId && (
        <BreadcrumbItem>
          <Link to={`/teams/${teamId}/folders/${folderId}`}>Folder</Link>
        </BreadcrumbItem>
      )}
      {title && <BreadcrumbItem active>{title}</BreadcrumbItem>}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
