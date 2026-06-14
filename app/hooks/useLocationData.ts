import axios from "axios";
import { useEffect, useState } from "react";
import { backendRoutes } from "../data/backend";
import backendAxiosConfig from "../data/axiosConfig";
import { FetchState } from "../redux/types";

type LocationFieldData = {
  data: string[];
  current: string | undefined;
  status: FetchState;
};

export type LocationData = {
  states: LocationFieldData;
  lgas: LocationFieldData;
  wards: LocationFieldData;
  pollingUnits: LocationFieldData;
};

const initialLocationData: LocationData = {
  states: {
    data: [],
    current: undefined,
    status: "not started",
  },
  lgas: {
    data: [],
    current: undefined,
    status: "not started",
  },
  wards: {
    data: [],
    current: undefined,
    status: "not started",
  },
  pollingUnits: {
    data: [],
    current: undefined,
    status: "not started",
  },
};

function useLocationData(data?: LocationData) {
  const [locationData, setLocationData] = useState(data || initialLocationData);
  const [initialLoad, setInitialLoad] = useState(false);

  function updateField(field: keyof LocationData, value: string | undefined) {
    setLocationData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        current: value,
      },
    }));
  }

  function updateFieldData(field: keyof LocationData, data: string[]) {
    setLocationData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        data,
      },
    }));
  }

  function updateFieldStatus(field: keyof LocationData, status: FetchState) {
    setLocationData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        status,
      },
    }));
  }

  async function fetchStates() {
    updateFieldStatus("states", "pending");
    const { data } = await axios.get(backendRoutes.locations.states, backendAxiosConfig());
    const states: string[] = data.map((state: { name: string }) => state.name);
    updateFieldData("states", states);
    updateFieldStatus("states", "fulfilled");
  }

  async function fetchLGAs(state: string) {
    updateFieldStatus("lgas", "pending");
    const { data } = await axios.get(
      backendRoutes.locations.localGovernments(state),
      backendAxiosConfig()
    );
    const lgas: string[] = data.map((lga: { name: string }) => lga.name);
    updateFieldData("lgas", lgas);
    updateFieldStatus("lgas", "fulfilled");
  }

  async function fetchWards(state: string, lga: string) {
    updateFieldStatus("wards", "pending");
    const { data } = await axios.get(
      backendRoutes.locations.wards(state, lga),
      backendAxiosConfig()
    );
    const wards: string[] = data.map((ward: { name: string }) => ward.name);
    updateFieldData("wards", wards);
    updateFieldStatus("wards", "fulfilled");
  }

  async function fetchPollingUnits(state: string, lga: string, ward: string) {
    updateFieldStatus("pollingUnits", "pending");
    const { data } = await axios.get(
      backendRoutes.locations.pollingUnits(state, lga, ward),
      backendAxiosConfig()
    );
    const pollingUnits: string[] = data.map((unit: { name: string }) => unit.name);
    updateFieldData("pollingUnits", pollingUnits);
    updateFieldStatus("pollingUnits", "fulfilled");
  }

  async function fetchAll(data: LocationData) {
    updateFieldStatus("states", "pending");
    updateFieldStatus("lgas", "pending");
    updateFieldStatus("wards", "pending");
    updateFieldStatus("pollingUnits", "pending");
    const { data: s } = await axios.get(backendRoutes.locations.states, backendAxiosConfig());
    const { data: l } = await axios.get(
      backendRoutes.locations.localGovernments(data.states.current!),
      backendAxiosConfig()
    );
    const { data: w } = await axios.get(
      backendRoutes.locations.wards(data.states.current!, data.lgas.current!),
      backendAxiosConfig()
    );
    const { data: p } = await axios.get(
      backendRoutes.locations.pollingUnits(
        data.states.current!,
        data.lgas.current!,
        data.wards.current!
      ),
      backendAxiosConfig()
    );
    updateFieldData("states", s.map((x: { name: string }) => x.name));
    updateFieldData("lgas", l.map((x: { name: string }) => x.name));
    updateFieldData("wards", w.map((x: { name: string }) => x.name));
    updateFieldData("pollingUnits", p.map((x: { name: string }) => x.name));
    updateFieldStatus("states", "fulfilled");
    updateFieldStatus("lgas", "fulfilled");
    updateFieldStatus("wards", "fulfilled");
    updateFieldStatus("pollingUnits", "fulfilled");
    setInitialLoad(true);
  }

  useEffect(() => {
    if (data) {
      fetchAll(data);
    } else {
      fetchStates();
      setInitialLoad(true);
    }
  }, []);

  useEffect(() => {
    if (initialLoad) {
      updateField("lgas", undefined);
      updateFieldData("lgas", []);
      if (locationData.states.current) {
        fetchLGAs(locationData.states.current);
      }
    }
  }, [locationData.states.current]);

  useEffect(() => {
    if (initialLoad) {
      updateField("wards", undefined);
      updateFieldData("wards", []);
      if (locationData.lgas.current) {
        fetchWards(locationData.states.current!, locationData.lgas.current);
      }
    }
  }, [locationData.lgas.current]);

  useEffect(() => {
    if (initialLoad) {
      updateField("pollingUnits", undefined);
      updateFieldData("pollingUnits", []);
      if (locationData.wards.current) {
        fetchPollingUnits(
          locationData.states.current!,
          locationData.lgas.current!,
          locationData.wards.current
        );
      }
    }
  }, [locationData.wards.current]);

  return {
    locationData,
    updateLocationField: updateField,
  };
}

export default useLocationData;
