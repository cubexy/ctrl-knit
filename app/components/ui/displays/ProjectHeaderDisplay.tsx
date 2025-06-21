import { useState } from "react";
import type { CreateProject } from "~/models/Project";
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
          <h2 className="card-title text-center text-4xl text-pretty font-stretch-ultra-expanded">
            {props.project.name}
          </h2>
          <div className="flex flex-col items-center justify-center gap-x-2 gap-y-0.5 font-mono md:flex-row">
            {props.project.url && (
              <a
                href={props.project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link wrap flex items-center gap-2"
              >
                <LinkIcon className="size-4" strokeWidth={1} />
                {props.project.url}
              </a>
            )}
            <button className="btn btn-ghost px-1 py-3 font-medium" onClick={() => setPopoverOpen(true)}>
              <SettingsIcon className="size-4" strokeWidth={1} />
              Verwalten
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectHeaderDisplay;
