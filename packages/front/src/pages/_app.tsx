import "../styles/reset.css";
import type { AppProps } from "next/app";
import { ThemeProvider, Global } from "@emotion/react";
import { lightTheme, darkTheme } from "../styles/theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { NextPage } from "next";
import { RecoilRoot, useRecoilState } from "recoil";
import ModalSetter from "../common/Modal/ModalSetter";
import GlobalErrorBoundary from "../hooks/\berror/GlobalErrorBoundary";
import GlobalStyles from "../styles/glabals";
import useDarkMode from "../hooks/useDarkMode";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
}; // 기존 AppProps타입에 Layout을 추가한 것.

const Wrapper = ({ Component, pageProps }: any) => {
  const getLayout = Component.getLayout ?? ((page: any) => page);
  const { isDarkMode } = useDarkMode();

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Global styles={GlobalStyles(isDarkMode ? darkTheme : lightTheme)} />
      <GlobalErrorBoundary>
        {getLayout(<Component {...pageProps} />)}
        <div className="modal-root">
          <ModalSetter selector=".modal-root" />
        </div>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
};

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

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen position="bottom-left" /> */}
      <RecoilRoot>
        <Wrapper Component={Component} pageProps={pageProps} />
      </RecoilRoot>
    </QueryClientProvider>
  );
}
