export const renderNameAndEmail = (
  name: string | null,
  email: string | null
) => {
  if (
    name !== ", " && // if first name, last name are empty, name returns this string
    email
  ) {
    if (!!name && name.trim() !== "" && !!email && email.trim() !== "") {
      return `${name} (${email})`;
    } else if (!!name && name.trim() !== "") {
      return name;
    } else if (!!email && email.trim() !== "") {
      return `(${email})`;
    }
  }
  return ""; // return an empty string if name is ", " or any other condition is not met
};
