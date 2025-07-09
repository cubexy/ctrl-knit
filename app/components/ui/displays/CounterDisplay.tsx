import NumberFlow from "@number-flow/react";
import { useState } from "react";
import type { EditCounter } from "~/models/Counter";
import type { CounterPresentation } from "~/models/presenter/CounterPresentation";
import SettingsIcon from "../icons/SettingsIcon";
import EditCounterPopover from "../popover/EditCounterPopover";

type CounterDisplayProps = CounterPresentation & {
  onIncrement: () => void;
  onDecrement: () => void;
  onEdit: (update: EditCounter) => void;
  onDelete: () => void;
};

function CounterDisplay(props: CounterDisplayProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // helper function because tailwindcss does not support dynamic classes
  const getGradientClasses = (percentage: number) => {
    const p = Math.floor(percentage * 20) * 5;

    const percentageMap = {
      0: "from-0% to-0%",
      5: "from-5% to-5%",
      10: "from-10% to-10%",
      15: "from-15% to-15%",
      20: "from-20% to-20%",
      25: "from-25% to-25%",
      30: "from-30% to-30%",
      35: "from-35% to-35%",
      40: "from-40% to-40%",
      45: "from-45% to-45%",
      50: "from-50% to-50%",
      55: "from-55% to-55%",
      60: "from-60% to-60%",
      65: "from-65% to-65%",
      70: "from-70% to-70%",
      75: "from-75% to-75%",
      80: "from-80% to-80%",
      85: "from-85% to-85%",
      90: "from-90% to-90%",
      95: "from-95% to-95%",
      100: "from-100% to-100%"
    };

    return percentageMap[p as keyof typeof percentageMap] || "from-50% to-50%";
  };

  const gradientClasses = getGradientClasses(props.count.current / props.count.target);

  const canDecrement = props.count.current > 0;
  const canIncrement = props.stepOver
    ? props.stepOver.current < props.stepOver.target || props.count.current < props.count.target
    : props.count.current < props.count.target;

  return (
    <div key={props.id} className="card card-border shadow-neutral/30 bg-base-100 w-full rounded-3xl shadow-xs">
      <div className="card-body w-full items-center p-2">
        <div className="flex w-full flex-row items-center justify-between pl-1">
          <p>{props.name}</p>
          <EditCounterPopover
            onConfirm={(counter) => props.onEdit({ ...counter, id: props.id })}
            onDelete={props.onDelete}
            counter={props}
            open={popoverOpen}
            setOpen={setPopoverOpen}
          />
          <button className="btn btn-xs btn-ghost rounded-tr-2xl px-1 py-3" onClick={() => setPopoverOpen(true)}>
            <SettingsIcon className="size-5" strokeWidth={1} />
          </button>
        </div>
        <div className="join w-full">
          <button className="btn h-full rounded-l-2xl text-xl" onClick={props.onDecrement} disabled={!canDecrement}>
            -
          </button>
          <div
            className={`input input-neutral from-base-300 to-base-100 flex min-h-36 w-full flex-col items-center justify-center gap-0 border-[1px] border-b-[2px] bg-gradient-to-r ${gradientClasses} rounded-none`}
            style={{
              borderColor: "color-mix(in oklab, var(--color-base-200), #000 calc(var(--depth) * 5%))" // color not available through daisyUI, so we have to use inline styles
            }}
          >
            <NumberFlow
              value={props.count.current}
              /** @ts-ignore - NumberFlow is a third-party library that does not have types */
              style={{ fontSize: "60px", fontWeight: "normal", "--number-flow-mask-height": "0em" }}
            />
            <p className="text-x grow-0">von {props.count.target}</p>
            {props.stepOver && props.stepOver.target > 1 && (
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
          <button className="btn h-full rounded-r-2xl text-xl" onClick={props.onIncrement} disabled={!canIncrement}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default CounterDisplay;
