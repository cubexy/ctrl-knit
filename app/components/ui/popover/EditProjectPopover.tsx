import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { CreateProject } from "~/models/Project";
import RemoveIcon from "../icons/RemoveIcon";

interface EditProjectPopoverProps {
  onConfirm: (project: CreateProject) => void;
  onDelete: () => void;
  project: CreateProject;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function EditProjectPopover(props: EditProjectPopoverProps) {
  const DEFAULTS = {
    name: props.project.name,
    url: props.project.url
  };

  const [name, setName] = useState(DEFAULTS.name);
  const [url, setUrl] = useState<string | undefined>(DEFAULTS.url);

  const navigate = useNavigate();

  const resetFields = () => {
    setName(DEFAULTS.name);
    setUrl(DEFAULTS.url);
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

    const newProject: CreateProject = {
      name: name,
      url: url
    };

    props.onConfirm(newProject);
    props.setOpen(false);
  };

  const handleDelete = () => {
    props.onDelete();
    props.setOpen(false);
    resetFields();
    navigate("/");
  };

  const inputValid = name !== "";

  const ref = useRef<HTMLDialogElement>(null);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <div className="flex flex-row items-start justify-between">
          <h3 className="pb-2 text-xl font-bold">Projekt bearbeiten</h3>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-xs btn-error btn-ghost mt-0 px-1 py-3">
              <RemoveIcon strokeWidth={1.5} className="size-4" />
            </div>
            <div
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box shadow-neutral/15 z-1 flex w-46 flex-col items-center gap-y-0.5 py-4 shadow-sm"
            >
              <p>Wirklich löschen?</p>
              <button className="btn btn-dash btn-error" onClick={handleDelete}>
                Projekt löschen
              </button>
            </div>
          </div>
        </div>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="Easy Knit Sweater"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <legend className="fieldset-legend">URL</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="https://pinterest.com/easysweater"
            value={url ?? ""}
            onChange={(e) => setUrl(e.target.value)}
          />
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

export default EditProjectPopover;
