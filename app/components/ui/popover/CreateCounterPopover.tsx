import { useState, type RefObject } from "react";
import type { CreateCounter } from "~/models/entities/counter/CreateCounter";

interface CreateCounterPopoverProps {
  ref: RefObject<HTMLDialogElement | null>;
  onConfirm: (counter: CreateCounter) => void;
}

function CreateCounterPopover(props: CreateCounterPopoverProps) {
  const [name, setName] = useState("");
  const [targetValue, setTargetValue] = useState<number | null>(null);
  const [stepOver, setStepOver] = useState<number | null>(null);

  const resetFields = () => {
    setName("");
    setTargetValue(null);
    setStepOver(null);
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
      name: name,
      count: targetValue !== null ? { target: targetValue } : undefined,
      stepOver: stepOver !== null ? { target: stepOver } : undefined
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

  const setCounterTargetValue = (value: string) => setTargetValue(parseInputValue(value, true));

  const setCounterStepOverTargetValue = (value: string) => setStepOver(parseInputValue(value, true));

  const dialogText = "Zähler erstellen";
  const dialogConfirmText = "Erstellen";

  const inputValid = name !== "" && !(stepOver !== null && targetValue === null);

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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <legend className="fieldset-legend">Zielwert (Zu strickende Reihen)</legend>
          <input
            type="number"
            className="input w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="12"
            value={targetValue ?? ""}
            onChange={(e) => setCounterTargetValue(e.target.value)}
          />
          <p className="label">Optional</p>
          <legend className="fieldset-legend">Wiederholungen</legend>
          <input
            type="number"
            placeholder="3"
            className="input w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            value={stepOver ?? ""}
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
