const Paste = () => {
  const onChange = (e: any) => {
    console.log("Pasted!", e.target.value);
  };
  return (
    <div className="p-3">
      <form>
        <div className="mb-3">
          <label htmlFor="coa-input" className="form-label">
            Paste in a copied account number
          </label>
          <textarea
            className="form-control"
            id="coa-input"
            onChange={onChange}
            placeholder="ex: 1311-63031-9300531-508210-44-G29-CM00000039-510139-0000-000000-000000"
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default Paste;
