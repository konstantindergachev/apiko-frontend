import { RecoilRoot } from 'recoil';
import type { AppProps } from 'next/app';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
      <div id="modal" />
    </RecoilRoot>
  );
}

export default MyApp;
