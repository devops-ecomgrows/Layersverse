interface WrappedApp extends Omit<AppProps, "Component"> {
  Component: NextComponentType<NextPageContext, any, {}> &
    WithLayout & { Auth?: boolean; Sign?: boolean };
}
