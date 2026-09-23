import { useEffect, useState } from "react";
import type { CreateProject } from "~/models/entities/project/CreateProject";
import { isValidProjectUrl } from "~/utility/isValidProjectUrl";
import ClockIcon from "../icons/ClockIcon";
import LinkIcon from "../icons/LinkIcon";
import PauseIconFilled from "../icons/PauseIconFilled";
import SettingsIcon from "../icons/SettingsIcon";
import EditProjectPopover from "../popover/EditProjectPopover";

type ProjectHeaderDisplayProps = {
  onConfirmEdit: (project: CreateProject) => void;
  onDelete: () => void;
  onStartTimer: () => Promise<void>;
  onStopTimer: () => Promise<void>;
  project: CreateProject & {
    trackedTime: number;
    timeSpanStart?: Date;
  };
};

function ProjectHeaderDisplay(props: ProjectHeaderDisplayProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [timerUpdating, setTimerUpdating] = useState(false);

  const isRunning = props.project.timeSpanStart !== undefined;
  const activeDuration = props.project.timeSpanStart ? Math.max(0, now - props.project.timeSpanStart.getTime()) : 0;
  const time = props.project.trackedTime + activeDuration;

  useEffect(() => {
    if (!isRunning) return;

    const updateNow = () => setNow(Date.now());
    updateNow();
    const interval = setInterval(updateNow, 1000);
    return () => clearInterval(interval);
  }, [isRunning, props.project.timeSpanStart]);

  const toggleTimer = async () => {
    if (timerUpdating) return;

    setTimerUpdating(true);
    try {
      if (isRunning) {
        await props.onStopTimer();
      } else {
        await props.onStartTimer();
      }
    } catch (error) {
      console.error("Failed to update timer:", error);
    } finally {
      setTimerUpdating(false);
    }
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
      <section aria-label="Projektübersicht" className="w-full max-w-5xl shrink-0 py-4 sm:py-6">
        <div className="flex min-w-0 flex-col items-center gap-4">
          <h1
            className="m-0 max-w-full text-center text-6xl leading-none font-normal text-balance wrap-anywhere sm:text-7xl md:text-8xl"
            style={{ fontFamily: "Le Murmure_Regular" }}
          >
            {props.project.name}
          </h1>
          <div className="flex max-w-full flex-wrap items-center justify-center gap-1 text-sm max-[360px]:gap-0 sm:gap-2">
            {props.project.url && isValidProjectUrl(props.project.url) && (
              <a
                href={props.project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost text-base-content/75 h-11 gap-2 px-3 font-normal max-[360px]:px-1 max-[360px]:text-xs"
                title={props.project.url}
                aria-label={`Referenz öffnen: ${fetchShortenedUrl(props.project.url)} (neuer Tab)`}
              >
                <LinkIcon className="size-4 stroke-current" strokeWidth={1} />
                Referenz
              </a>
            )}
            <button
              type="button"
              className={`btn btn-ghost h-11 gap-2 px-3 font-normal tabular-nums max-[360px]:px-1 max-[360px]:text-xs ${isRunning ? "bg-primary/10 text-base-content" : "text-base-content/75"}`}
              onClick={() => void toggleTimer()}
              disabled={timerUpdating}
              aria-label={isRunning ? "Zeiterfassung pausieren" : "Zeiterfassung starten"}
              aria-pressed={isRunning}
              aria-busy={timerUpdating}
              title={`${isRunning ? "Zeiterfassung pausieren" : "Zeiterfassung starten"}${time > 0 ? ` · ${formatTime(time)}` : ""}`}
            >
              {isRunning ? (
                <PauseIconFilled className="text-primary size-4 fill-current" />
              ) : (
                <ClockIcon className="size-4 stroke-current" strokeWidth={1.5} />
              )}
              {formatTime(time)}
            </button>
            <button
              type="button"
              className="btn btn-ghost text-base-content/75 size-11 p-0"
              onClick={() => setPopoverOpen(true)}
              aria-label="Projekt verwalten"
              aria-haspopup="dialog"
              title="Projekt verwalten"
            >
              <SettingsIcon className="size-4 stroke-current" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProjectHeaderDisplay;
