import { type ReactNode } from "react";
import { DatabaseProvider } from "~/contexts/DatabaseProvider";

type ProviderProps = {
  children: ReactNode;
};

function Provider({ children }: ProviderProps) {
  return <DatabaseProvider>{children}</DatabaseProvider>;
}

export default Provider;
