import { useEffect, useRef, useState } from "react";
import type { CreateProject } from "~/models/entities/project/CreateProject";
import ClockIcon from "../icons/ClockIcon";
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
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(props.project.trackedTime ?? 0);

  const timeRef = useRef(time);
  const projectRef = useRef(props.project);
  const onConfirmEditRef = useRef(props.onConfirmEdit);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    projectRef.current = props.project;
  }, [props.project]);

  useEffect(() => {
    onConfirmEditRef.current = props.onConfirmEdit;
  }, [props.onConfirmEdit]);

  useEffect(() => {
    if (!isRunning) {
      setTime(props.project.trackedTime ?? 0);
    }
  }, [props.project.trackedTime, isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    let saveInterval: NodeJS.Timeout;
    if (isRunning) {
      saveInterval = setInterval(() => {
        onConfirmEditRef.current({ ...projectRef.current, trackedTime: timeRef.current });
      }, 60000);
    }
    return () => clearInterval(saveInterval);
  }, [isRunning]);

  const toggleTimer = () => {
    if (isRunning) {
      props.onConfirmEdit({ ...props.project, trackedTime: time });
    }
    setIsRunning(!isRunning);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    if (hours > 0) return `${hours} h ${pad(minutes)} min`;
    if (minutes > 0) return `${pad(minutes)} min`;
    if (ms > 0) return `${pad(seconds)} s`;
    return "Zeit erfassen";
  };

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
      <div className="w-full bg-linear-to-tl">
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
            <button
              className={`btn btn-ghost px-1 py-3 font-medium ${isRunning ? "text-primary" : ""}`}
              onClick={toggleTimer}
            >
              <ClockIcon className="size-4 stroke-current" strokeWidth={1.5} />
              {formatTime(time)}
            </button>
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
