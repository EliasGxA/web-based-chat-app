// style imports
import { createGlobalStyle } from "styled-components";
import { GeistProvider, CssBaseline } from "@geist-ui/react";

// type imports
import type { AppProps } from "next/app";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    line-height: 1.6;
    font-size: 18px;
  }

  * {
    box-sizing: border-box;
  }

`;

const theme = {};

// Override App provide for nextjs
// App is used to initialize pages
// Custom app: control the page initialization

// Global style is provided

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <GeistProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </GeistProvider>
    </>
  );
}
