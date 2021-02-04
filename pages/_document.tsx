import Document from "next/document";
import { ServerStyleSheet } from "styled-components";
import { CssBaseline } from "@geist-ui/react";

// enhance default document provide for Nextjs

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      const GeistStyles = CssBaseline.flush();

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
            {GeistStyles}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
