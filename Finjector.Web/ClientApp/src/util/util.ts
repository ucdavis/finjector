export const renderNameAndEmail = (
  name: string | null,
  email: string | null
) => {
  if (
    !!name &&
    name.trim() !== "" &&
    name !== ", " && //if first name, last name are empty, name returns this string
    !!email &&
    email.trim() !== ""
  ) {
    return `${name} (${email})`;
  } else if (name && name.trim() !== "") {
    return name;
  } else if (email && email.trim() !== "") {
    return `(${email})`;
  } else {
    return "";
  }
};
