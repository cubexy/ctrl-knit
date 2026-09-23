import NumberFlow from "@number-flow/react";
import { useState } from "react";
import type { CounterUIRepresentation } from "~/models/entities/counter/Counter";
import type { CounterPresentation } from "~/models/entities/counter/CounterPresentation";
import type { EditCounter } from "~/models/entities/counter/EditCounter";
import { clamp } from "~/utility/clamp";
import DragHandleIcon from "../icons/DragHandleIcon";
import SettingsIcon from "../icons/SettingsIcon";
import EditCounterPopover from "../popover/EditCounterPopover";
import type { CounterDragHandleProps } from "../SortableCounterItem";

type CounterDisplayProps = CounterPresentation & {
  onIncrement: () => void;
  onDecrement: () => void;
  onEdit: (update: EditCounter) => void;
  onDelete: () => void;
  ref?: React.Ref<HTMLDivElement>;
  dragHandleProps?: CounterDragHandleProps;
  onMoveEarlier?: () => void;
  onMoveLater?: () => void;
};

function CounterDisplay(props: CounterDisplayProps) {
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

  return (
    <div
      key={props.id}
      role="group"
      aria-label={`Zähler: ${props.name}`}
      className="group bg-base-200/60 w-full rounded-2xl p-4"
      ref={props.ref}
    >
      <div className="flex min-w-0 items-center gap-1">
        <h2 className="min-w-0 flex-1 text-sm wrap-anywhere">{props.name}</h2>
        {props.dragHandleProps && (
          <button
            type="button"
            className="btn btn-ghost text-base-content/60 size-11 cursor-grab touch-none p-0 transition-opacity active:cursor-grabbing [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100"
            ref={props.dragHandleProps.ref}
            {...props.dragHandleProps.listeners}
            {...props.dragHandleProps.attributes}
            aria-label={`${props.name} verschieben`}
            aria-roledescription="verschiebbarer Zähler"
            title="Zähler verschieben"
          >
            <DragHandleIcon className="size-4 stroke-current" strokeWidth={1.5} />
          </button>
        )}
        <EditCounterPopover
          onConfirm={(counter) => props.onEdit({ ...counter, id: props.id })}
          onDelete={props.onDelete}
          counter={passedCounter}
          open={settingsPopoverOpen}
          setOpen={setSettingsPopoverOpen}
          onMoveEarlier={props.onMoveEarlier}
          onMoveLater={props.onMoveLater}
        />
        <button
          type="button"
          className="btn btn-ghost text-base-content/60 size-11 p-0"
          onClick={() => setSettingsPopoverOpen(true)}
          aria-label={`${props.name} bearbeiten`}
          aria-haspopup="dialog"
          title="Zähler bearbeiten"
        >
          <SettingsIcon className="size-4 stroke-current" strokeWidth={1.5} />
        </button>
      </div>
      <div className="grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-2 py-4">
        <button
          type="button"
          className="btn btn-ghost size-12 rounded-full p-0 text-2xl font-normal"
          onClick={props.onDecrement}
          disabled={!canDecrement}
          aria-label={`${props.name}: eine Reihe zurück`}
        >
          −
        </button>

        <div
          className="flex min-h-28 min-w-0 flex-col items-center justify-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <NumberFlow
            value={props.count.current}
            className="[--number-flow-mask-height:0em]"
            style={{
              fontSize: props.count.current >= 10000 ? "32px" : "60px",
              fontWeight: "normal"
            }}
          />
          {!!props.count.target && <p className="text-base-content/65 text-xs">von {props.count.target}</p>}
          {props.stepOver && props.stepOver.target > 1 && props.count.target && (
            <div
              className="tooltip tooltip-bottom"
              data-tip={`${(props.stepOver.current - 1) * props.count.target + props.count.current} / ${props.stepOver.target * props.count.target} geschafft!`}
            >
              <div className="text-base-content/65 mt-2 flex flex-wrap justify-center gap-x-1 text-xs">
                Wiederholung
                <span className="whitespace-nowrap">
                  <NumberFlow value={props.stepOver.current} className="font-normal [--number-flow-mask-height:0em]" />
                  {` / ${props.stepOver.target}`}
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn bg-base-300/70 hover:bg-base-300 size-12 rounded-full border-0 p-0 text-2xl font-normal shadow-none"
          onClick={props.onIncrement}
          disabled={!canIncrement}
          aria-label={`${props.name}: eine Reihe weiter`}
        >
          +
        </button>
      </div>
      {!!props.count.target && (
        <div
          className="bg-base-content/5 h-1 overflow-hidden rounded-full"
          role="progressbar"
          aria-label={`${props.name}: Fortschritt`}
          aria-valuenow={props.count.current}
          aria-valuemin={0}
          aria-valuemax={props.count.target}
        >
          <div
            className="bg-base-content/35 h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default CounterDisplay;
