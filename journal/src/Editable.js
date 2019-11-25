import React, { useState, useEffect } from "react";

function Editable({ onChange, value }) {
  const [isEdit, setIsEdit] = useState(false);
  const [val, setVal] = useState();

  function onSubmit(e) {
    e.preventDefault();
    setIsEdit(false);
    if (onChange) {
      onChange(val);
    }
  }

  function onCancel(e) {
    setIsEdit(false);
  }

  if (isEdit) {
    return (
      <div class="Editable Editable--edit">
        <form onSubmit={onSubmit}>
          <input defaultValue={value} onChange={e => setVal(e.target.value)} />
          <div className="controls">
            <button type="submit">Save</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  } else {
    return <button onClick={() => setIsEdit(true)}>{value}</button>;
  }
}

export default Editable;
