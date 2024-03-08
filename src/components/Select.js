import React from "react";

function Select({ isEditable, options, ...props }) {
  return (
    <select name="cars" id="cars" {...props}>
      {options?.map((item) => (
        <option value={item?.value}>{item?.label || item?.value}</option>
      ))}
    </select>
  );
}

export default Select;
