import { Button, Tooltip } from "antd";
import { Export } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { CSVDownload, CSVLink } from "react-csv";

type AppExportProps = {
  headerKeyMap: Record<string, string>;
  data: Array<Record<string, string | boolean | number>>;
  filename?: string;
};

export default function AppExport({ headerKeyMap, data, filename }: AppExportProps) {
  const [csvData, setCSVData] = useState<string[][]>([]);

  function handleExport() {
    // { "tableHeader" : "dataKey" }
    const headers = Object.keys(headerKeyMap);
    const csvData = [headers];
    data.forEach((row) => {
      const rowData = headers.map((header) => String(row[headerKeyMap[header]] || "-"));
      csvData.push(rowData);
    });
    setCSVData(csvData);
  }

  useEffect(() => {
    handleExport();
  }, [data]);

  return (
    <Tooltip title="Export as .csv" mouseEnterDelay={0.75}>
      <CSVLink data={csvData} target="_blank" filename={filename ? `${filename}.csv` : "export.csv"}>
        <Button
          className="text-sm h-[45px]"
          size="large"
          type="primary"
          icon={<Export size={18} />}
        >
          Export
        </Button>
      </CSVLink>
    </Tooltip>
  );
}
