import axios from "axios";
import { useEffect, useState } from "react";
import { backendRoutes } from "../data/backend";
import backendAxiosConfig from "../data/axiosConfig";
import { FetchState } from "../redux/types";

function useBankData() {
  type FetchedBank = {
    code: string;
    name: string;
  };

  type BankOption = {
    value: string;
    label: string;
  };

  const [bankData, setBankData] = useState({
    data: [] as Array<BankOption>,
    current: undefined as string | undefined,
    status: 'not started' as FetchState,
  });

  function updateCurrent(value: string) {
    setBankData((prev) => ({
      ...prev,
      current: value,
    }));
  }

  function updateData(data: Array<BankOption>) {
    setBankData((prev) => ({
      ...prev,
      data
    }));
  }

  function updateStatus(status: FetchState) {
    setBankData((prev) => ({
      ...prev,
      status,
    }));
  }

  async function fetchBanks() {
    updateStatus('pending');
    const { data } = await axios.get(backendRoutes.data.banks, backendAxiosConfig());
    updateData(data.banks.map((bank: FetchedBank) => ({
      value: bank.name,
      label: bank.name,
    })));
    updateStatus('fulfilled');
  }

  useEffect(() => {
    fetchBanks();
  }, []);

  return {
    bankData,
    updateCurrentBank: updateCurrent,
  };
};

export default useBankData;