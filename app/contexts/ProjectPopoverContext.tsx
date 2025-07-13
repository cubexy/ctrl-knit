import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";
import CreateProjectPopover from "~/components/ui/popover/CreateProjectPopover";

interface ProjectPopoverType {
  createProjectModalRef: React.RefObject<HTMLDialogElement | null>;
  handleShow: () => void;
}

const ProjectPopoverContext = createContext<ProjectPopoverType | null>(null);

interface ProjectPopoverProviderProps {
  children: ReactNode;
}

export function ProjectPopoverProvider({ children }: ProjectPopoverProviderProps) {
  const createProjectModalRef = useRef<HTMLDialogElement>(null);

  const handleShow = useCallback(() => {
    createProjectModalRef.current?.showModal();
  }, [createProjectModalRef]);

  const value: ProjectPopoverType = {
    createProjectModalRef,
    handleShow
  };

  return (
    <ProjectPopoverContext.Provider value={value}>
      <CreateProjectPopover ref={createProjectModalRef} />
      {children}
    </ProjectPopoverContext.Provider>
  );
}

export function useProjectPopover(): ProjectPopoverType {
  const context = useContext(ProjectPopoverContext);
  if (!context) {
    throw new Error("useProjectPopover must be used within a ProjectPopoverProvider");
  }
  return context;
}
