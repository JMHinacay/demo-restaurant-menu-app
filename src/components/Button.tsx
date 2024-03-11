import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: "primary" | "danger";
  dashed?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

function Button({ type = "primary", ...props }: ButtonProps) {
  const colorsMap = {
    primary: "#70b3ff",
    danger: "#d14e45",
  };

  const buttonStyle = {
    backgroundColor: props?.disabled ? "#d6d6d6" : colorsMap[type] || "#70b3ff",
    ...(props?.dashed
      ? {
          border: "1px dashed black",
          backgroundColor: "white",
          color: "#757373",
        }
      : {}),
    ...(props?.fullWidth
      ? {
          width: "100%",
        }
      : {}),
  };

  return (
    <button
      style={buttonStyle}
      className={
        "hover:bg-blue-700 text-white font-bold py-1 px-2 rounded m-[2px] "
      }
      {...props}
    >
      <div className=" flex justify-center text-center items-center">
        {props?.children && <div className="mr-[4px]">{props?.children}</div>}
        {props?.icon}
      </div>
    </button>
  );
}

export default Button;
