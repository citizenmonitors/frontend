import ElectionIcon from "@/app/components/shared/ElectionIcon";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { getPollingUnitResults } from "@/app/redux/features/electionSlice";
import { PollingUnitReport, PollingUnitResult } from "@/app/redux/types";
import { Button, Pagination, Spin } from "antd";
import { ArrowLeft, ArrowRight, Dislike, Flag, Like1, Notepad } from "iconsax-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import getElectionName from "@/app/utils/getElectionName";

export default function PollingUnitUploadsCards({
  togglePollingUnitUploadFlagModal,
  filteredPollingUnitUploads,
  togglePreviewModal,
}: {
  togglePollingUnitUploadFlagModal: (
    pollingUnitUpload?: PollingUnitReport | PollingUnitResult
  ) => void;
  filteredPollingUnitUploads: Array<PollingUnitReport | PollingUnitResult>;
  togglePreviewModal: (modalInfo?: PollingUnitReport | PollingUnitResult) => void;
}) {
  const electionState = useAppSelector((state) => state.election);
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedPollingUnitUploads = filteredPollingUnitUploads.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPollingUnitUploads]);

  return filteredPollingUnitUploads.length ? (
    <React.Fragment>
      <section className="grid gap-4 lg:hidden relative">
        {paginatedPollingUnitUploads.map((upload) => {
          const dataType = (upload as PollingUnitResult).partiesVotes ? "result" : "report";

          function handleFlag() {
            if (!upload.flagged) {
              togglePollingUnitUploadFlagModal(upload);
            }
          }

          return (
            <article key={v4()} className="p-4 ring-1 bg-white ring-gray-300 rounded-xl">
              <header className="flex gap-3 items-center justify-center text-gray-700">
                <ElectionIcon electionType={upload.electionType} />
                <h3 className="font-league font-semibold text-xl leading-tight">
                  {upload.electionYear} {getElectionName(upload.election)}{" "}
                  {dataType === "report" && "Incident Report"}
                </h3>
              </header>
              <div className="grid gap-[2px] place-items-center text-xs my-5">
                <p>
                  {moment(upload.uploadedAt || Date.now()).format("DD/MM/YYYY hh:mmA")}
                </p>
                <p className="font-medium">
                  {dataType === "report" ? "Incident Report" : "Election Result"}
                </p>
              </div>
              <div className="flex gap-[2px] items-center justify-center">
                <Button
                  type="text"
                  className="text-gray-500 font-semibold text-xs p-1"
                  onClick={() => {
                    togglePreviewModal(upload);
                  }}
                >
                  View
                </Button>
                {!upload.flagged && (
                  <React.Fragment>
                    <div className="w-[6px] h-[6px] bg-gray-200 rounded-full" />

                    <Button
                      type="text"
                      className="!text-brand-600 p-1 font-semibold text-xs flex gap-1 items-center"
                      onClick={() => {
                        dispatch(
                          getPollingUnitResults({
                            actionProps: {
                              action: "agree",
                              dataType: (upload as any).partiesVotes
                                ? "election"
                                : "incident",
                              electionId: upload.electionId,
                            },
                          })
                        );
                      }}
                    >
                      {upload.agreed ? "Agreed" : "Agree"}
                      <Like1 size={16} variant={upload.agreed ? "Bold" : "Linear"} />
                    </Button>
                  </React.Fragment>
                )}

                <div className="w-[6px] h-[6px] bg-gray-200 rounded-full " />

                <Button
                  type="text"
                  className="!text-error-500 p-1 font-semibold text-xs flex gap-1 items-center"
                  onClick={handleFlag}
                >
                  <Flag size={16} variant={upload.flagged ? "Bold" : "Linear"} />
                  {upload.flagged ? "Flagged" : "Flag"}
                </Button>
              </div>
            </article>
          );
        })}

        {/* Pagination */}
        {filteredPollingUnitUploads.length > PAGE_SIZE && (
          <div className="border-t border-gray-200 py-3 mt-3">
            <Pagination
              total={filteredPollingUnitUploads.length}
              pageSize={PAGE_SIZE}
              onChange={setCurrentPage}
              className="flex justify-center gap-2 flex-wrap"
              nextIcon={
                <Button
                  type="text"
                  className="text-gray-700 font-semibold flex gap-2 items-center ring-gray-300 ring-1"
                >
                  Next <ArrowRight size={16} />
                </Button>
              }
              prevIcon={
                <Button
                  type="text"
                  className="text-gray-700 font-semibold flex gap-2 items-center ring-gray-300 ring-1"
                >
                  <ArrowLeft size={16} /> Previous
                </Button>
              }
            />
          </div>
        )}

        {/* Loading Blocker */}
        <div
          className="absolute inset-0 grid place-content-center place-items-center bg-white/25 rounded-xl"
          style={{
            display:
              electionState.status.fetchPollingUnitResults === "pending"
                ? "grid"
                : "none",
          }}
        >
          <Spin size="large" />
        </div>
      </section>
    </React.Fragment>
  ) : (
    <div className="w-full grid place-items-center py-16 lg:hidden">
      <Notepad size={64} variant="TwoTone" className="text-brand-600" />
      <h3 className="font-league font-medium text-center text-gray-700 mt-1">
        Nothing Here.
      </h3>
      <p className="text-xs mx-auto max-w-sm text-center text-gray-500">
        No data is available for your polling unit as there’s currently no accredited
        observer for your polling unit. You can upgrade now to become the accredited
        observer for your polling unit.
      </p>
    </div>
  );
}
