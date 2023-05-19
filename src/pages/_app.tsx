import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import styled, { createGlobalStyle } from "styled-components";

import Header from "components/Header";

import { store } from "store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Header />
      <WrapperSite>
        <Component {...pageProps} />
      </WrapperSite>
    </Provider>
  );
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: "Gilroy";
  }

  body {
    margin: 0;
  }
  #__next {
    display: flex;
    flex-direction: column;
  }
`;

const WrapperSite = styled("div")`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 100%;
  max-width: 1000px;
  padding: 0 10px;
`;
