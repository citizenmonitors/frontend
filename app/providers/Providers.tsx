"use client";
import {
  ConfigProvider as AntDesignConfigProvider,
  ThemeConfig as AntDesignThemeConfig,
} from "antd";
import { Provider as ReduxProvider } from "react-redux";
import reduxStore from "../redux/store";
import React from "react";
import GlobalAlertProvider from "./GlobalAlertProvider";

export default function Providers({ children }: any) {
  const antDesignTheme: AntDesignThemeConfig = {
    token: {
      colorPrimary: "#05A39C",
    },
    components: {
      Button: {
        defaultBorderColor: "#07BBAF",
        defaultColor: "#07BBAF",
        defaultHoverBg: "#E6FFFF",
        primaryShadow: 'none',
      },
      Collapse: {
        contentBg: "white",
        headerBg: "white",
      },
      Alert: {
        defaultPadding: '16px'
      },
      Tabs: {
        horizontalItemPadding: '8px 0',
        colorText: '#98A2B3',
      }
    },
  };

  return (
    <ReduxProvider store={reduxStore}>
      <AntDesignConfigProvider theme={antDesignTheme}>
        <GlobalAlertProvider>{children}</GlobalAlertProvider>
      </AntDesignConfigProvider>
    </ReduxProvider>
  );
}
