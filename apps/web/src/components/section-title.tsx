"use client";

import React from "react";
import { colors } from "@/lib/colors";

type Props = { kicker?: string; title: string; center?: boolean };

export const SectionTitle: React.FC<Props> = ({ kicker, title, center }) => (
  <div className={`${center ? "text-center" : ""} space-y-2 mb-8`}>
    {kicker && (
      <div className="text-sm font-semibold tracking-widest uppercase" style={{ color: colors.lightGreen }}>
        {kicker}
      </div>
    )}
    <h2 className="text-3xl md:text-[40px] leading-tight font-extrabold" style={{ color: colors.darkGreen }}>
      {title}
    </h2>
  </div>
);

export default SectionTitle;
