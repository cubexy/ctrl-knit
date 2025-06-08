import { createContext } from "react";

const context = {
  createContext: {
    isOpen: false,
    openModal: () => {},
    closeModal: () => {},
  },
};

const ProjectContext = createContext(context);

export default ProjectContext;
