import { useEffect, useRef, useState } from "react";
import type { CreateCounter } from "~/models/Counter";

interface EditCounterPopoverProps {
  onConfirm: (counter: CreateCounter) => void;
  counter: CreateCounter;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function EditCounterPopover(props: EditCounterPopoverProps) {
  const DEFAULTS = {
    name: props.counter.name,
    counterTarget: props.counter.count.target,
    counterStepOver: props.counter.stepOver?.target ?? null
  };

  const [counterName, setCounterName] = useState(DEFAULTS.name);
  const [counterValue, setCounterValue] = useState<number | null>(DEFAULTS.counterTarget);
  const [counterStepOver, setCounterStepOver] = useState<number | null>(DEFAULTS.counterStepOver);

  const resetFields = () => {
    setCounterName(DEFAULTS.name);
    setCounterValue(DEFAULTS.counterTarget);
    setCounterStepOver(DEFAULTS.counterStepOver);
  };

  useEffect(() => {
    if (props.open) {
      if (ref.current) {
        ref.current.showModal();
      }
      resetFields();
    } else {
      if (ref.current) {
        ref.current.close();
      }
    }
  }, [props.open]);

  const handleConfirm = () => {
    if (!inputValid) return;

    const newCounter: CreateCounter = {
      name: counterName,
      count: { target: counterValue },
      stepOver: counterStepOver !== null ? { target: counterStepOver } : undefined
    };

    props.onConfirm(newCounter);
    props.setOpen(false);
  };

  const parseInputValue = (value: string, allowZero: boolean = false): number | null => {
    const trimmedValue = value.trim();
    if (trimmedValue === "") return null;

    const parsedValue = parseInt(trimmedValue, 10);
    if (!isNaN(parsedValue) && (allowZero ? parsedValue >= 0 : parsedValue > 0)) {
      return parsedValue;
    }

    return null;
  };

  const setCounterTargetValue = (value: string) => setCounterValue(parseInputValue(value));

  const setCounterStepOverTargetValue = (value: string) => setCounterStepOver(parseInputValue(value, true));

  const inputValid = counterName !== "" && counterValue !== null;

  const ref = useRef<HTMLDialogElement>(null);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="pb-2 text-xl font-bold font-stretch-expanded">Zähler bearbeiten</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="Hauptreihe"
            value={counterName}
            onChange={(e) => setCounterName(e.target.value)}
          />
          <legend className="fieldset-legend">Zielwert (Zu strickende Reihen)</legend>
          <input
            type="text"
            className="input w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="12"
            value={counterValue ?? ""}
            onChange={(e) => setCounterTargetValue(e.target.value)}
          />
          <legend className="fieldset-legend">Wiederholungen</legend>
          <input
            type="text"
            className="input w-full"
            value={counterStepOver ?? ""}
            onChange={(e) => setCounterStepOverTargetValue(e.target.value)}
          />
          <p className="label">Optional</p>
        </fieldset>
        <div className="modal-action">
          <button className="btn" onClick={() => props.setOpen(false)}>
            Abbrechen
          </button>
          <div
            className={inputValid ? "" : "tooltip tooltip-left"}
            data-tip="Bitte fülle alle erforderlichen Felder aus!"
          >
            <button type="submit" className="btn btn-primary" onClick={handleConfirm} disabled={!inputValid}>
              Bearbeitung abschließen
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default EditCounterPopover;
