interface WrappedApp extends Omit<AppProps, "Component"> {
  Component: NextComponentType<NextPageContext, any, {}> &
    WithLayout & { Auth?: boolean; Sign?: boolean };
}

interface ImageLoaderProps {
  className?: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout?: "fixed" | "fill" | "intrinsic";
  quality: number;
}
