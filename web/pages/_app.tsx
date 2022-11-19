import type { AppProps } from "next/app";

import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
	// Use the layout defined at the page level, if available
	// @ts-ignore => This is Next's suggestion to make reusable layouts:
	const getLayout = Component.getLayout || ((page: JSX.Element) => page);

	return getLayout(<Component {...pageProps} />);
}
