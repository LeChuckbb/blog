import "react-toastify/dist/ReactToastify.css";
import "../styles/reset.css";
import type { AppProps } from "next/app";
import { ThemeProvider, Global } from "@emotion/react";
import { lightTheme, darkTheme } from "design/src/styles/theme";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { NextPage } from "next";
import { RecoilRoot } from "recoil";
import ModalSetter from "../common/Modal/ModalSetter";
import GlobalErrorBoundary from "../hooks/\berror/GlobalErrorBoundary";
import GlobalStyles from "../styles/glabals";
import useDarkMode from "../hooks/useDarkMode";
import { useRef } from "react";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps: any;
}; // 기존 AppProps타입에 Layout을 추가한 것.

const Wrapper = ({ Component, pageProps }: any) => {
  const getLayout = Component.getLayout ?? ((page: any) => page);
  const { isDarkMode } = useDarkMode();

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Global styles={GlobalStyles(isDarkMode ? darkTheme : lightTheme)} />
      <GlobalErrorBoundary>
        <div className="modal-root">
          <ModalSetter selector=".modal-root" />
        </div>
        {getLayout(<Component {...pageProps} />)}
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const queryClientRef = useRef<QueryClient>();

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          suspense: true,
          useErrorBoundary: true,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
        },
        mutations: {
          useErrorBoundary: true,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        {/* <ReactQueryDevtools initialIsOpen position="bottom-left" /> */}
        <RecoilRoot>
          <Wrapper Component={Component} pageProps={pageProps} />
        </RecoilRoot>
      </Hydrate>
    </QueryClientProvider>
  );
}
