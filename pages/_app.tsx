import type { AppProps } from 'next/app';
import '../styles/globals.css';

/**
 * Main App component - wraps all pages
 * Imports global styles including Tailwind CSS
 */
function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
