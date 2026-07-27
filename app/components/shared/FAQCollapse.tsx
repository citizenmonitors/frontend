"use client";

import { faqContent } from "@/app/data/faqContent";
import { Collapse } from "antd";
import { AddSquare, MinusSquare } from "iconsax-react";
import React, { useMemo } from "react";
import { v4 } from "uuid";

function FAQCollapse() {
  const PanelHeader = ({ children }: { children: React.ReactNode }) => (
    <h3 className="faq-panel-header text-gray-700 md:text-xl font-semibold">{children}</h3>
  );
  const PanelContent = ({ children }: { children: React.ReactNode }) => (
    <p className="text-gray-600 whitespace-pre-line">{children}</p>
  );

  const FAQItems = useMemo(
    () =>
      faqContent.map((section) => ({
        key: v4(),
        label: <PanelHeader>{section.title}</PanelHeader>,
        children: <PanelContent>{section.body}</PanelContent>,
      })),
    []
  );

  return (
    <Collapse
      size="large"
      items={FAQItems}
      bordered={false}
      expandIcon={({ isActive }) => (
        <div className="expand-icon relative h-[24px] w-[24px]">
          <AddSquare
            size={24}
            variant="Linear"
            className={`absolute-center transition-all text-gray-700 ${
              isActive ? "rotate-90 opacity-0" : ""
            }`}
          />
          <MinusSquare
            size={24}
            variant="Linear"
            className={`absolute-center transition-all text-brand-500 ${
              isActive ? "" : "-rotate-90 opacity-0"
            }`}
          />
        </div>
      )}
    />
  );
}

export default FAQCollapse;
