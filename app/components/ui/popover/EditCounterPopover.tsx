import { useEffect, useRef, useState } from "react";
import type { CreateCounter } from "~/models/entities/counter/CreateCounter";
import RemoveIcon from "../icons/RemoveIcon";

interface EditCounterPopoverProps {
  onConfirm: (counter: CreateCounter) => void;
  onDelete: () => void;
  counter: CreateCounter;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function EditCounterPopover(props: EditCounterPopoverProps) {
  const DEFAULTS = {
    name: props.counter.name,
    counterTarget: props.counter.count?.target ?? null,
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
      count: counterValue !== null ? { target: counterValue } : undefined,
      stepOver: counterStepOver !== null ? { target: counterStepOver } : undefined
    };

    props.onConfirm(newCounter);
    props.setOpen(false);
  };

  const handleDelete = () => {
    props.onDelete();
    props.setOpen(false);
    resetFields();
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

  const inputValid = counterName !== "" && !(counterStepOver !== null && counterValue === null);

  const ref = useRef<HTMLDialogElement>(null);

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <div className="flex flex-row items-start justify-between">
          <h3 className="pb-2 text-xl font-bold">Zähler bearbeiten</h3>

          <details className="dropdown dropdown-end">
            <summary className="btn btn-xs btn-error btn-ghost mt-0 px-1 py-3">
              <RemoveIcon strokeWidth={1.5} className="size-4 stroke-current" />
            </summary>
            <div className="dropdown-content menu bg-base-100 rounded-box shadow-neutral/15 z-1 flex w-46 flex-col items-center gap-y-0.5 py-4 shadow-sm">
              <p>Wirklich löschen?</p>
              <button className="btn btn-dash btn-error" onClick={handleDelete}>
                Zähler löschen
              </button>
            </div>
          </details>
        </div>

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
            type="number"
            className="input w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="12"
            value={counterValue ?? ""}
            onChange={(e) => setCounterTargetValue(e.target.value)}
          />
          <p className="label">Optional</p>
          <legend className="fieldset-legend">Wiederholungen</legend>
          <input
            type="number"
            className="input w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="3"
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
              Speichern
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default EditCounterPopover;
