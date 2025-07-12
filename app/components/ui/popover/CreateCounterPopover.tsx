import { useState, type RefObject } from "react";
import type { CreateCounter } from "~/models/Counter";

interface CreateCounterPopoverProps {
  ref: RefObject<HTMLDialogElement | null>;
  onConfirm: (counter: CreateCounter) => void;
}

function CreateCounterPopover(props: CreateCounterPopoverProps) {
  const [counterName, setCounterName] = useState("");
  const [counterValue, setCounterValue] = useState<number | null>(null);
  const [counterStepOver, setCounterStepOver] = useState<number | null>(null);

  const resetFields = () => {
    setCounterName("");
    setCounterValue(null);
    setCounterStepOver(null);
  };

  const handleClose = () => {
    if (props.ref.current) {
      props.ref.current.close();
      resetFields();
    }
  };

  const handleConfirm = () => {
    if (!inputValid) return;

    const newCounter: CreateCounter = {
      name: counterName,
      count: { target: counterValue },
      stepOver: counterStepOver !== null ? { target: counterStepOver } : undefined
    };

    props.onConfirm(newCounter);
    handleClose();
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

  const dialogText = "Zähler erstellen";
  const dialogConfirmText = "Erstellen";

  const inputValid = counterName !== "" && counterValue !== null;

  return (
    <dialog ref={props.ref} className="modal">
      <div className="modal-box">
        <h3 className="pb-2 text-xl font-bold font-stretch-expanded">{dialogText}</h3>
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
          <legend className="fieldset-legend">Wiederholungen</legend>
          <input
            type="number"
            className="input w-full"
            value={counterStepOver ?? ""}
            onChange={(e) => setCounterStepOverTargetValue(e.target.value)}
          />
          <p className="label">Optional</p>
        </fieldset>
        <div className="modal-action">
          <button className="btn" onClick={handleClose}>
            Abbrechen
          </button>
          <div
            className={inputValid ? "" : "tooltip tooltip-left"}
            data-tip="Bitte fülle alle erforderlichen Felder aus!"
          >
            <button type="submit" className="btn btn-primary" onClick={handleConfirm} disabled={!inputValid}>
              {dialogConfirmText}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default CreateCounterPopover;
