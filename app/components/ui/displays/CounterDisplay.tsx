import { useCallback, useRef } from "react";
import EditCounterPopover from "../popover/EditCounterPopover";

type CounterDisplayProps = {
  identifier: string;
  name: string;
  count: {
    current: number;
    target: number;
  };
  stepOver?: {
    current: number;
    target: number;
  };
  onIncrement: () => void;
  onDecrement: () => void;
};

function CounterDisplay(props: CounterDisplayProps) {
  const editCounterPopoverRef = useRef<HTMLDialogElement>(null);

  const handleShow = useCallback(() => {
    editCounterPopoverRef.current?.showModal();
  }, [editCounterPopoverRef]);

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
      100: "from-100% to-100%",
    };

    return percentageMap[p as keyof typeof percentageMap] || "from-50% to-50%";
  };

  const gradientClasses = getGradientClasses(
    props.count.current / props.count.target
  );

  return (
    <div key={props.identifier} className="card card-border w-full rounded-3xl">
      <div className="card-body items-center p-2 w-full">
        <div className="flex flex-row items-center justify-between w-full pl-1">
          <p>{props.name}</p>
          <EditCounterPopover
            ref={editCounterPopoverRef}
            onEdit={(name, value, stepOver) => {}}
          />
          <button
            className="btn btn-xs btn-ghost px-1 py-3"
            onClick={handleShow}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
        </div>
        <div className="join w-full">
          <button className="btn h-full rounded-l-2xl font-mono text-xl">
            -
          </button>
          <div
            className={`input border-[#d0e2ed] gap-0 border-x-[1px] input-neutral min-h-36 flex flex-col items-center justify-center font-mono w-full bg-gradient-to-r from-base-300 to-base-100 ${gradientClasses} rounded-none`}
          >
            <p className="grow-0 text-6xl">{props.count.current}</p>
            <p className="text-x grow-0">von {props.count.target}</p>
            {props.stepOver && (
              <div
                className="tooltip tooltip-bottom"
                data-tip={`${props.stepOver.current * props.count.target + props.count.current} / ${props.stepOver.target * props.count.target} geschafft!`}
              >
                <div className="badge badge-neutral">{`${props.stepOver.current} / ${props.stepOver.target}`}</div>
              </div>
            )}
          </div>
          <button className="btn h-full rounded-r-2xl font-mono text-xl">
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default CounterDisplay;
