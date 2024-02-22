interface Props {
  title?: string;
  errorText?: string;
  children?: React.ReactNode;
}
export const FinError = (props: Props) => {
  const { title = "Unable to load content", errorText, children } = props;
  return (
    <div className="p-2 col-6">
      <h1>{title}</h1>
      <p>
        {errorText ??
          "You have encountered an error. Please try refreshing the page. If the problem persists, contact support."}
      </p>
      {children}
    </div>
  );
};
