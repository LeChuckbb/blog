import "../styles/reset.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@emotion/react";
import theme from "../styles/theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { NextPage } from "next";
import { RecoilRoot } from "recoil";
import ModalSetter from "../common/Modal/ModalSetter";
import { APIErrorBoundary } from "../hooks/\berror/APIErrorBoundary";
import WithHeader from "../layout/WithHeader";

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
        refetchOnMount: false,
        refetchOnWindowFocus: false,
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
      <ReactQueryDevtools initialIsOpen position="bottom-left" />
      <ThemeProvider theme={theme}>
        <RecoilRoot>
          {/* <APIErrorBoundary> */}
          {getLayout(<Component {...pageProps} />)}
          <div className="modal-root">
            <ModalSetter selector=".modal-root" />
          </div>
          {/* </APIErrorBoundary> */}
        </RecoilRoot>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
