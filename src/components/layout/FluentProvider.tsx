'use client';

import { FluentProvider as FluentUIProvider, webLightTheme } from '@fluentui/react-components';

export function FluentProvider({ children }: { children: React.ReactNode }) {
  return (
    <FluentUIProvider theme={webLightTheme}>
      {children}
    </FluentUIProvider>
  );
}
