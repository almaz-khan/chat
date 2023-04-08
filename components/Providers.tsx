"use client";

import { FC } from "react";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children?: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default Providers;
