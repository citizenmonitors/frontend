import { useAppSelector } from "@/app/hooks/redux";
import copyObject from "@/app/utils/copyObject";
import { Button } from "antd";
import { ArrowLeft2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import AppFilter from "../../shared/AppFilter";
import { initialPollingUnitUploadsFilterData } from "./data";
import PollingUnitUploadsTable from "./PollingUnitUploadsTable";
import { PollingUnitReport, PollingUnitResult } from "@/app/redux/types";
import PollingUnitUploadPreviewModal from "./PollingUnitUploadPreviewModal";
import PollingUnitUploadsCards from "./PollingUnitUploadsCards";
import PollingUnitUploadFlagConfirmModal from "./PollingUnitUploadFlagConfirmModal";
import SuggestionPopup from "../../shared/SuggestionPopup";
import { resourceVideos } from "../../landing/resources/data";
import sortByCreatedAtAsc from "@/app/utils/sortByCreatedAtAsc";

export default function PollingUnitUploadsDisplay() {
  const router = useRouter();
  const electionState = useAppSelector((state) => state.election);

  function handleRouterBack() {
    router.replace("/portal/dashboard");
  }

  // Flag Modal States
  const [activePollingUnitUploadFlag, setActivePollingUnitUploadFlag] = useState<
    PollingUnitReport | PollingUnitResult | null
  >(null);
  const [pollingUnitUploadFlagModalOpen, setPollingUnitUploadFlagModalOpen] =
    useState(false);
  function togglePollingUnitUploadFlagModal(
    pollingUnitUpload?: PollingUnitReport | PollingUnitResult
  ) {
    if (pollingUnitUploadFlagModalOpen) {
      setPollingUnitUploadFlagModalOpen(false);
      setActivePollingUnitUploadFlag(null);
    } else if (pollingUnitUpload) {
      setPollingUnitUploadFlagModalOpen(true);
      setActivePollingUnitUploadFlag(pollingUnitUpload);
    }
  }

  const pollingUnitUploads = electionState.pollingUnitResults;
  const [filterData, setFilterData] = useState(
    copyObject(initialPollingUnitUploadsFilterData)
  );
  useEffect(() => {
    const filters = copyObject(initialPollingUnitUploadsFilterData);
    const allUploads = [...pollingUnitUploads.reports, ...pollingUnitUploads.results];
    // popupulating the filters
    allUploads.forEach((upload) => {
      if (!filters.electionYear.options.includes(upload.electionYear)) {
        filters.electionYear.options.push(upload.electionYear);
      }
    });
    setFilterData(filters);
  }, [pollingUnitUploads]);
  
  const filteredPollingUnitUploads = useMemo(() => {
    const { reports, results } = pollingUnitUploads;
    const allUploads = [...reports, ...results];

    return sortByCreatedAtAsc(
      allUploads.filter((upload: any) => {
        if (filterData.uploadType.selected === "reports" && upload.partiesVotes) {
          return false;
        }
        if (filterData.uploadType.selected === "results" && !upload.partiesVotes) {
          return false;
        }
        if (
          filterData.electionYear.selected !== "all years" &&
          upload.electionYear.toLowerCase() !==
            filterData.electionYear.selected.toLowerCase()
        ) {
          return false;
        }

        return true;
      })
    );
  }, [pollingUnitUploads, filterData]);

  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [previewModalInfo, setPreviewModalInfo] = useState<
    PollingUnitReport | PollingUnitResult | null
  >(null);
  function togglePreviewModal(modalInfo?: PollingUnitReport | PollingUnitResult) {
    if (modalInfo) {
      setPreviewModalOpen(true);
      setPreviewModalInfo(modalInfo);
    } else {
      setPreviewModalOpen(false);
      setPreviewModalInfo(null);
    }
  }

  return (
    <>
      <PollingUnitUploadFlagConfirmModal
        pollingUnitUpload={activePollingUnitUploadFlag!}
        closeModal={togglePollingUnitUploadFlagModal}
      />
      <section className="grid gap-7">
        <Button
          type="text"
          className="flex text-brand-500 hover:!text-brand-600 items-center gap-1 px-1 w-fit"
          onClick={handleRouterBack}
        >
          <ArrowLeft2 size={20} />{" "}
          <span className="font-medium text-sm">Back to Home</span>
        </Button>

        <section>
          <header className="flex gap-3 md:items-center mb-1 md:mb-2">
            <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
              My Polling Unit Results
            </h2>
          </header>
          <p className="text-sm text-gray-500 lg:text-base">
            The result below is a platform approved result for your polling unit. You can
            view and appraise the approved result for your polling unit, and your feedback
            will be received.
          </p>
        </section>

        <div className="grid gap-4">
          <AppFilter
            filterData={filterData}
            setFilterData={setFilterData}
          />
          <PollingUnitUploadsCards
            togglePollingUnitUploadFlagModal={togglePollingUnitUploadFlagModal}
            filteredPollingUnitUploads={filteredPollingUnitUploads}
            togglePreviewModal={togglePreviewModal}
          />
          <PollingUnitUploadsTable
            togglePollingUnitUploadFlagModal={togglePollingUnitUploadFlagModal}
            filteredPollingUnitUploads={filteredPollingUnitUploads}
            togglePreviewModal={togglePreviewModal}
          />
          {previewModalInfo && (
            <PollingUnitUploadPreviewModal
              togglePollingUnitUploadFlagModal={togglePollingUnitUploadFlagModal}
              open={previewModalOpen}
              setOpen={setPreviewModalOpen}
              upload={previewModalInfo}
            />
          )}
        </div>

        <SuggestionPopup
          id="polling-unit-uploads"
          suggestion="Watch Tutorial Video"
          title="Holding Your Polling Unit Accountable"
          video={resourceVideos[4]}
        />
      </section>
    </>
  );
}
