import { useState, type RefObject } from "react";
import { useNavigate } from "react-router";
import { useDatabase } from "~/contexts/DatabaseContext";

type CreateProjectPopoverProps = {
  ref: RefObject<HTMLDialogElement | null>;
};

function CreateProjectPopover(props: CreateProjectPopoverProps) {
  const [projectName, setProjectName] = useState("");
  const [projectReference, setProjectReference] = useState("");

  const { createProject } = useDatabase();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (props.ref.current && projectName.trim().length > 0) {
      const response = await createProject({
        name: projectName,
        url: projectReference
      });
      props.ref.current.close();
      setProjectName("");
      setProjectReference("");

      if (response.id) {
        navigate(`/projects/${response.id}`);
      }
    }
  };

  const handleClose = () => {
    if (props.ref.current) {
      props.ref.current.close();
      setProjectName("");
      setProjectReference("");
    }
  };

  const canBeSubmitted = projectName.trim().length > 0;

  return (
    <dialog ref={props.ref} className="modal font-mono">
      <div className="modal-box">
        <h3 className="pb-2 text-left text-xl font-bold">Projekt erstellen</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-left">Name</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="Mein Sophie Scarf 💅"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <legend className="fieldset-legend">Referenz</legend>
          <input
            type="url"
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
            <button type="submit" className="btn btn-primary" disabled={!canBeSubmitted} onClick={handleSubmit}>
              Projekt erstellen
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default CreateProjectPopover;
