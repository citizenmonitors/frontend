"use client";

import AppSelect from "@/app/components/shared/Select";
import SettingsHeader from "@/app/components/portal/settings/SettingsHeader";
import useLocationData from "@/app/hooks/useLocationData";
import formatNumber from "@/app/utils/formatNumber";
import formatString from "@/app/utils/formatString";
import React from "react";

export default function PollingUnitLocator() {
  const { locationData, updateLocationField } = useLocationData();

  const hasSelection =
    locationData.states.current &&
    locationData.lgas.current &&
    locationData.wards.current &&
    locationData.pollingUnits.current;

  return (
    <>
      <SettingsHeader>Polling Unit Locator</SettingsHeader>
      <div className="py-6 bg-white md:py-8 px-3 md:px-8 ring-1 ring-gray-300 rounded-lg w-full max-w-[736px] mx-auto">
        <h3 className="font-league text-xl md:text-display-xs text-brand-500 text-center font-semibold mb-1 leading-tight">
          Locate your polling unit
        </h3>
        <p className="text-gray-500 text-sm text-center mb-8 max-w-screen-xs mx-auto">
          Search by state, LGA, ward, and polling unit to find the correct registration
          location.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-[6px]">
            <label htmlFor="locator-state" className="text-sm font-medium">
              State
            </label>
            <AppSelect
              id="locator-state"
              value={locationData.states.current}
              options={locationData.states.data.map((state, index) => ({
                value: state,
                label: `${formatNumber.prependZeroes(index + 1)} – ${formatString.kebabToNormalCase(state).toUpperCase()}`,
              }))}
              onChange={(e) => updateLocationField("states", e.target.value)}
              disabled={locationData.states.data.length === 0}
            />
          </div>

          <div className="grid gap-[6px]">
            <label htmlFor="locator-lga" className="text-sm font-medium">
              LGA
            </label>
            <AppSelect
              id="locator-lga"
              value={locationData.lgas.current}
              options={locationData.lgas.data.map((lga, index) => ({
                value: lga,
                label: `${formatNumber.prependZeroes(index + 1)} – ${formatString.kebabToNormalCase(lga).toUpperCase()}`,
              }))}
              onChange={(e) => updateLocationField("lgas", e.target.value)}
              disabled={locationData.lgas.data.length === 0}
            />
          </div>

          <div className="grid gap-[6px]">
            <label htmlFor="locator-ward" className="text-sm font-medium">
              Ward
            </label>
            <AppSelect
              id="locator-ward"
              value={locationData.wards.current}
              options={locationData.wards.data.map((ward, index) => ({
                value: ward,
                label: `${formatNumber.prependZeroes(index + 1)} – ${formatString.kebabToNormalCase(ward).toUpperCase()}`,
              }))}
              onChange={(e) => updateLocationField("wards", e.target.value)}
              disabled={locationData.wards.data.length === 0}
            />
          </div>

          <div className="grid gap-[6px]">
            <label htmlFor="locator-polling-unit" className="text-sm font-medium">
              Polling Unit
            </label>
            <AppSelect
              id="locator-polling-unit"
              value={locationData.pollingUnits.current}
              options={locationData.pollingUnits.data.map((pollingUnit, index) => ({
                value: pollingUnit,
                label: `${formatNumber.prependZeroes(index + 1)} – ${formatString.kebabToNormalCase(pollingUnit).toUpperCase()}`,
              }))}
              onChange={(e) => updateLocationField("pollingUnits", e.target.value)}
              disabled={locationData.pollingUnits.data.length === 0}
            />
          </div>
        </div>

        {hasSelection && (
          <div className="mt-8 rounded-lg bg-brand-25 border border-brand-200 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-brand-600 font-medium mb-1">
              Selected polling unit
            </p>
            <p className="text-sm md:text-base font-semibold text-gray-800">
              {formatString.kebabToNormalCase(locationData.pollingUnits.current!)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {formatString.kebabToNormalCase(locationData.wards.current!)},{" "}
              {formatString.kebabToNormalCase(locationData.lgas.current!)},{" "}
              {formatString.kebabToNormalCase(locationData.states.current!)}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
