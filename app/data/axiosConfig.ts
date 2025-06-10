import { AxiosRequestConfig } from "axios";
import backendURL from "./backend";
import Cookies from 'js-cookie';
import { cookieData } from "./cookieData";

type BackendAxiosConfigOptions = {
  type: 'application/json' | 'multipart/form-data'
};

const backendAxiosConfig = (options?: BackendAxiosConfigOptions) => {
  const userToken = Cookies.get(cookieData.login.name);

  const config: AxiosRequestConfig = {
    baseURL: backendURL,
    headers: {
      "Content-Type": options?.type ? options.type : "application/json",
    }
  };

  if (userToken) {
    const authorizedConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": options?.type ? options.type : "application/json",
        "Authorization": `Bearer ${userToken}`,
      }
    }
    Object.assign(config, authorizedConfig);
  }

  return config;
}

export default backendAxiosConfig;