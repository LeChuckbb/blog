import "../styles/reset.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@emotion/react";
import theme from "../styles/theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { NextPage } from "next";
import { RecoilRoot } from "recoil";
import ModalSetter from "../common/Modal/ModalSetter";
import GlobalErrorBoundary from "../hooks/\berror/GlobalErrorBoundary";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
}; // 기존 AppProps타입에 Layout을 추가한 것.

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  console.log(error);

  return (
    <div role="alert">
      <pre>서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.</pre>
      <button onClick={resetErrorBoundary}>재시도</button>
    </div>
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
          <GlobalErrorBoundary>
            {getLayout(<Component {...pageProps} />)}
            <div className="modal-root">
              <ModalSetter selector=".modal-root" />
            </div>
          </GlobalErrorBoundary>
        </RecoilRoot>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
