export const shouldDisplayAsString = (children: React.ReactNode) => {
  // this is for the case that we pass in something like: View Admins {forTeamName}, which gives [View Admins, {forTeamName}]
  return (
    typeof children === "string" ||
    typeof children === "number" ||
    (Array.isArray(children) &&
      children.every((c) => typeof c === "string" || typeof c === "number"))
  );
};
