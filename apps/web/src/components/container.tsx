"use client";

import React from "react";

type Props = React.PropsWithChildren<{ className?: string }>;

export const Container: React.FC<Props> = ({ children, className = "" }) => (
  <div className={`container mx-auto p-4 max-w-7xl sm:px-6 ${className}`}>{children}</div>
);

export default Container;
