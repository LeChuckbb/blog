import "../styles/reset.css";
import type { AppProps } from "next/app";
import WithHeader from "../layout/WithHeader";
import Headerless from "../layout/Headerless";
import { ThemeProvider } from "@emotion/react";
import theme from "../styles/theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { NextPage } from "next";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
}; // 기존 AppProps타입에 Layout을 추가한 것.

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });

  // const layouts = {
  //   WithHeader: WithHeader: ,
  //   Headerless: Headerless,
  // };

  // const NestedLayout = layouts[Component.layout] || WithHeader;
  const getLayout = Component.getLayout ?? ((page) => page);
  // const getLayout = Component.getLayout || WithHeader;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
