import NumberFlow from "@number-flow/react";
import { useState } from "react";
import type { CounterUIRepresentation } from "~/models/entities/counter/Counter";
import type { CounterPresentation } from "~/models/entities/counter/CounterPresentation";
import type { EditCounter } from "~/models/entities/counter/EditCounter";
import { clamp } from "~/utility/clamp";
import InfoIcon from "../icons/InfoIcon";
import SettingsIcon from "../icons/SettingsIcon";
import CounterInfoPopover from "../popover/CounterInfoPopover";
import EditCounterPopover from "../popover/EditCounterPopover";

type CounterDisplayProps = CounterPresentation & {
  onIncrement: () => void;
  onDecrement: () => void;
  onEdit: (update: EditCounter) => void;
  onDelete: () => void;
  ref?: React.Ref<HTMLDivElement>;
};

function CounterDisplay(props: CounterDisplayProps) {
  const [infoPopoverOpen, setInfoPopoverOpen] = useState(false);
  const [settingsPopoverOpen, setSettingsPopoverOpen] = useState(false);
  const percentage = props.count.target ? clamp((props.count.current / props.count.target) * 100, 0, 100) : 0;

  const canDecrement = props.count.current > 0;
  const canIncrement =
    !props.count.target ||
    (props.stepOver
      ? props.stepOver.current < props.stepOver.target || props.count.current < props.count.target
      : props.count.current < props.count.target);

  const passedCounter: CounterUIRepresentation = {
    name: props.name,
    count: props.count.target ? { target: props.count.target } : undefined,
    stepOver: props.stepOver ? { target: props.stepOver.target } : undefined,
    createdAt: props.createdAt,
    editedAt: props.editedAt
  };

  const backgroundClass = props.count.target ? "bg-base-100" : "bg-linear-to-r from-base-300 to-base-100";

  return (
    <div
      key={props.id}
      className="card card-border shadow-neutral/30 bg-base-100 w-full rounded-3xl shadow-xs"
      ref={props.ref}
    >
      <div className="card-body w-full items-center p-2">
        <div className="flex w-full flex-row items-center justify-between gap-1 pl-1">
          <p className="break-all">{props.name}</p>
          <EditCounterPopover
            onConfirm={(counter) => props.onEdit({ ...counter, id: props.id })}
            onDelete={props.onDelete}
            counter={passedCounter}
            open={settingsPopoverOpen}
            setOpen={setSettingsPopoverOpen}
          />
          <CounterInfoPopover counter={passedCounter} open={infoPopoverOpen} setOpen={setInfoPopoverOpen} />
          <button className="btn btn-xs btn-ghost h-full px-0.5 py-0.5" onClick={() => setInfoPopoverOpen(true)}>
            <InfoIcon className="size-5 stroke-current" strokeWidth={1} />
          </button>
          <button
            className="btn btn-xs btn-ghost h-full rounded-tr-2xl px-0.5 py-0.5"
            onClick={() => setSettingsPopoverOpen(true)}
          >
            <SettingsIcon className="size-5 stroke-current" strokeWidth={1} />
          </button>
        </div>
        <div className="join w-full">
          <button className="btn h-full rounded-l-2xl text-xl" onClick={props.onDecrement} disabled={!canDecrement}>
            -
          </button>
          <div
            className={`input input-neutral ${backgroundClass} relative flex min-h-36 w-full flex-col items-center justify-center gap-0 overflow-hidden rounded-none border border-b-2`}
            style={{
              borderColor: "color-mix(in oklab, var(--color-base-200), #000 calc(var(--depth) * 5%))" // color not available through daisyUI, so we have to use inline styles
            }}
          >
            <div
              className="bg-base-300 absolute inset-y-0 left-0 transition-all duration-300 ease-in-out"
              style={{ width: `${percentage}%` }}
            />
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
              <NumberFlow
                value={props.count.current}
                /** @ts-ignore - NumberFlow is a third-party library that does not have types */
                style={{ fontSize: "60px", fontWeight: "normal", "--number-flow-mask-height": "0em" }}
              />
              {props.count.target && <p className="text-x grow-0">von {props.count.target}</p>}
              {props.stepOver && props.stepOver.target > 1 && props.count.target && (
                <div
                  className="tooltip tooltip-bottom"
                  data-tip={`${(props.stepOver.current - 1) * props.count.target + props.count.current} / ${props.stepOver.target * props.count.target} geschafft!`}
                >
                  <div className="badge badge-neutral">
                    <NumberFlow
                      value={props.stepOver.current}
                      /** @ts-ignore - NumberFlow is a third-party library that does not have types */
                      style={{ fontWeight: "normal", "--number-flow-mask-height": "0em" }}
                    />
                    {` / ${props.stepOver.target}`}
                  </div>
                </div>
              )}
            </div>
          </div>
          <button className="btn h-full rounded-r-2xl text-xl" onClick={props.onIncrement} disabled={!canIncrement}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default CounterDisplay;
