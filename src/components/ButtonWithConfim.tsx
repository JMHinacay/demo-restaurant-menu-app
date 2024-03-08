import React, { useState } from "react";
import Button from "./Button";
import Modal from "./Modal";

function ButtonWithConfim(props: any) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button {...props} onClick={() => setVisible(true)} />
      {visible && (
        <Modal
          title={props?.title}
          content={props?.content}
          onConfirm={(e: any) => props.onClick(e)}
          onCancel={() => setVisible(false)}
        />
      )}
    </>
  );
}

export default ButtonWithConfim;
