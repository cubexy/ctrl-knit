import { useState } from "react";
import type { CreateProject } from "~/models/entities/project/CreateProject";
import LinkIcon from "../icons/LinkIcon";
import SettingsIcon from "../icons/SettingsIcon";
import EditProjectPopover from "../popover/EditProjectPopover";

type ProjectHeaderDisplayProps = {
  onConfirmEdit: (project: CreateProject) => void;
  onDelete: () => void;
  project: CreateProject;
};

function ProjectHeaderDisplay(props: ProjectHeaderDisplayProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const fetchShortenedUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (error) {
      return url;
    }
  };

  return (
    <>
      <EditProjectPopover
        open={popoverOpen}
        setOpen={setPopoverOpen}
        project={props.project}
        onConfirm={props.onConfirmEdit}
        onDelete={props.onDelete}
      />
      <div className="w-full bg-gradient-to-tl">
        <div className="card-body items-center justify-center gap-0.5 px-8 py-2">
          <h2
            className="card-title hover:to-base-300 pb-2 text-center text-6xl break-all transition-all duration-300 ease-in-out hover:scale-105 sm:text-7xl md:text-8xl"
            style={{ fontFamily: "Le Murmure_Regular" }}
          >
            {props.project.name}
          </h2>
          <div className="flex flex-col items-center justify-center gap-x-2 gap-y-0.5 md:flex-row">
            {props.project.url && (
              <a
                href={props.project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link wrap flex items-center gap-2"
              >
                <LinkIcon className="size-4 stroke-current" strokeWidth={1} />
                <p className="break-all">{fetchShortenedUrl(props.project.url)}</p>
              </a>
            )}
            <button className="btn btn-ghost px-1 py-3 font-medium" onClick={() => setPopoverOpen(true)}>
              <SettingsIcon className="size-4 stroke-current" strokeWidth={1.5} />
              Verwalten
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectHeaderDisplay;
