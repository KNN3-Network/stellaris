import { useEffect } from "react";
import "../styles/globals.css";
import "../styles/custom.scss";
import { Web3ContextProvider } from "../context/Web3Context";
import { ToastContainer } from "react-toastify";
// import Coming from "../components/Coming";
import "react-toastify/dist/ReactToastify.css";
import "../styles/antd_reset.scss";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  // useEffect(() => {
  //   // Run within useEffect to execute this code on the frontend.
  //   Gleap.initialize("sg1UIYFMK3J926CjXOFNUTR26T1uF6yB");
  // }, []);

  return (
    <RecoilRoot>
      <Web3ContextProvider>
        {/* <Coming /> */}
        <Component {...pageProps} />
        <ToastContainer position="top-right" />ƒ
      </Web3ContextProvider>
    </RecoilRoot>
  );
}
