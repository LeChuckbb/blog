import { createPortal } from "react-dom";
import React from "react";

interface Props {
  selector?: string;
  children: React.ReactNode;
}

const Portal: React.FC<Props> = ({ children, selector }) => {
  if (typeof window !== "object") return <>{children}</>;
  const rootElement = selector && document.querySelector(selector);

  return <>{rootElement ? createPortal(children, rootElement) : children}</>;
};

export default Portal;
