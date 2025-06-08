import { useState, type RefObject } from "react";

type CreateProjectModalContentProps = {
  ref: RefObject<HTMLDialogElement | null>;
};

function CreateProjectModalContent(props: CreateProjectModalContentProps) {
  const [projectName, setProjectName] = useState("");
  const [projectReference, setProjectReference] = useState("");

  const handleClose = () => {
    if (props.ref.current) {
      props.ref.current.close();
      setProjectName("");
      setProjectReference("");
    }
  };

  const canBeSubmitted = projectName.trim().length > 0;

  return (
    <dialog ref={props.ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg pb-2">Projekt erstellen</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="Mein Sophie Scarf 💅"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <legend className="fieldset-legend">Referenz</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="https://www.pinterest.com/meine-coole-inspo/"
            value={projectReference}
            onChange={(e) => setProjectReference(e.target.value)}
          />
          <p className="label">Optional</p>
        </fieldset>
        <div className="modal-action">
          <button className="btn" onClick={handleClose}>
            Abbrechen
          </button>
          <div
            className={canBeSubmitted ? "" : "tooltip"}
            data-tip={canBeSubmitted ? undefined : "Gib einen Namen an!"}
          >
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!canBeSubmitted}
            >
              Projekt erstellen
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default CreateProjectModalContent;
