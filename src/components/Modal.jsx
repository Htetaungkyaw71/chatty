import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children }) => {
  let ref = useRef(null);
  if (!ref.current) {
    ref.current = document.createElement("div");
  }
  useEffect(() => {
    let modal = document.getElementById("modal");
    modal.appendChild(ref.current);

    return () => modal.removeChild(ref.current);
  }, []);
  return createPortal(<div>{children}</div>, ref.current);
};

export default Modal;
