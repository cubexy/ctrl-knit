import { type ReactNode } from "react";
import { DatabaseProvider } from "~/contexts/DatabaseContext";
import { ProjectPopoverProvider } from "~/contexts/ProjectPopoverContext";

type ProviderProps = {
  children: ReactNode;
};

function Provider({ children }: ProviderProps) {
  return (
    <DatabaseProvider>
      <ProjectPopoverProvider>{children}</ProjectPopoverProvider>
    </DatabaseProvider>
  );
}

export default Provider;
