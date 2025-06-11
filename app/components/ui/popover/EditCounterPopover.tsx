import { useState, type RefObject } from "react";

type EditCounterPopoverProps = {
  ref: RefObject<HTMLDialogElement | null>;
  onEdit: (name: string, value: number, stepOver: number | null) => void;
};

function EditCounterPopover(props: EditCounterPopoverProps) {
  const [counterName, setCounterName] = useState("");
  const [counterValue, setCounterValue] = useState(0);
  const [counterStepOver, setCounterStepOver] = useState<number | null>(null);

  const handleClose = () => {
    if (props.ref.current) {
      props.ref.current.close();
      setCounterName("");
      setCounterValue(0);
      setCounterStepOver(null);
    }
  };

  return (
    <dialog ref={props.ref} className="modal">
      <div className="modal-box">
        <h3 className="pb-2 text-lg font-bold">Zähler bearbeiten</h3>
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
            className="input w-full"
            placeholder="0"
            value={counterValue}
            onChange={(e) => setCounterValue(Number(e.target.value))}
          />
          <legend className="fieldset-legend">Wiederholungen</legend>
          <input
            type="number"
            className="input w-full"
            value={counterStepOver ?? -1}
            onChange={(e) => setCounterStepOver(Number(e.target.value))}
          />
          <p className="label">Optional</p>
        </fieldset>
        <div className="modal-action">
          <button className="btn" onClick={handleClose}>
            Abbrechen
          </button>
          <button type="submit" className="btn btn-primary">
            Bearbeitung abschließen
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default EditCounterPopover;
