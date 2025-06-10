"use client";
import { Collapse } from "antd";
import React, { useMemo, useState } from "react";
import { v4 } from "uuid";

type PanelHeaderProps = {
  children: React.ReactNode;
  panelKey: string;
};

const introContent = [
  {
    title: "Data is equal power",
    body: `Data of the people, by the people and for the people.`,
  },
  {
    title: "Data quality, integrity and privacy",
    body: `This platform ensures global standard data management and governance for trusted results.`,
  },
  {
    title: "Trusted Structure to monitor and report on elections and governance",
    body: `The trust is in the fact that we can hold each other accountable on this platform.`,
  },
  {
    title: "⁠If elections fail, Governance will fail",
    body: `Active citizens must monitor the needful and apply unrelenting pressure against everything that fails them.`,
  },
];

function IntroCollapse() {
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);

  const PanelHeader = ({ children, panelKey }: PanelHeaderProps) => {
    return (
      <h3
        className={`group-[.collapse-item-active]/collapse-item:text-brand-500 intro-panel-header text-gray-600 font-league !font-light lg:text-lg transition-all mt-8 mb-1 group-first-of-type/collapse-item:mt-0`}
        // style={{
        //   marginTop: activeKey === panelKey ? 0 : 50,
        // }}
        onMouseEnter={() => {
          setActiveKey(panelKey);
        }}
      >
        {children}
      </h3>
    );
  };

  const PanelContent = ({ children }: any) => (
    <p className="group-[.collapse-item-active]/collapse-item:text-brand-500 intro-panel-content !text-sm text-gray-600 transition-colors font-light">
      {children}
    </p>
  );

  const introItems = useMemo(
    () =>
      introContent.map((section) => ({
        key: v4(),
        label: <h3 className="font-medium font-league">{section.title.toUpperCase()}</h3>,
        children: <PanelContent>{section.body}</PanelContent>,
      })),
    [introContent]
  );

  return (
    <div className="intro-collapse" onMouseLeave={() => setActiveKey(undefined)}>
      <Collapse
        className="group/intro-collapse"
        size="large"
        bordered={false}
        expandIcon={() => null}
        accordion
        activeKey={activeKey}
      >
        {introItems.map((item) => (
          <Collapse.Panel
            header={<PanelHeader panelKey={item.key}>{item.label}</PanelHeader>}
            key={item.key}
            style={{ padding: 0 }}
            className={`group/collapse-item ${
              item.key === activeKey ? "collapse-item-active" : ""
            }`}
          >
            {item.children}
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
}

export default IntroCollapse;
