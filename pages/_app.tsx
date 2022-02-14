import { useEffect, useState } from "react";
import "../styles/globals.css";
import "../styles/component/message.css";
import "../styles/button.css";
import "../styles/component/index.css";

const defaultRender = (
  page: React.ReactElement<any, string | React.JSXElementConstructor<any>>
) => page;

function MyApp({ Component, pageProps }: WrappedApp) {
  const [initReady, setInitReady] = useState(false);

  const getLayout = Component.getLayout ? Component.getLayout : defaultRender;

  useEffect(() => {
    setInitReady(true);
  }, []);

  const renderComponent = () => {
    if (Component.Sign) {
      return getLayout(<Component {...pageProps} />);
    }

    return getLayout(<Component {...pageProps} />);
  };

  return <div>{renderComponent()}</div>;
}

export default MyApp;
