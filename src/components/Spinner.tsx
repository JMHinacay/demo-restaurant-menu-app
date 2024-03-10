import React from "react";
const Spinner = ({ loading, children }: SpinnerT) => {
  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div className="absolute w-full h-full bg-[rgba(255,255,255,0.7)] flex justify-center items-center z-[9999] left-0 top-0">
          <div className="w-10 h-10 animate-spin rounded-[50%] border-t-[#3498db] border-4 border-solid border-[#f3f3f3]"></div>
        </div>
      )}
      {children}
    </div>
  );
};
type SpinnerT = {
  loading?: boolean;
  children?: any;
};
export default Spinner;
