import "../styles/reset.css";
import type { AppProps } from "next/app";
import Layout from "../layout";
import { ThemeProvider } from "@emotion/react";
import theme from "../styles/theme";
import { QueryClient, QueryClientProvider } from "react-query";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
