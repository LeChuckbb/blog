import "../styles/reset.css";
import type { AppProps } from "next/app";
import Layout from "../layout";
import { ThemeProvider } from "@emotion/react";
import theme from "../styles/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
