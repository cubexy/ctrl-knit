import { type ReactNode } from "react";
import { ProjectPopoverProvider } from "~/contexts/ProjectPopoverContext";

type UIProviderProps = {
  children: ReactNode;
};

function UIProvider({ children }: UIProviderProps) {
  return <ProjectPopoverProvider>{children}</ProjectPopoverProvider>;
}

export default UIProvider;
