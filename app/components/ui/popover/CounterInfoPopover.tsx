import { useEffect, useRef } from "react";
import type { CounterUIRepresentation } from "~/models/entities/counter/Counter";

interface CounterInfoPopoverProps {
  counter: CounterUIRepresentation;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function CounterInfoPopover(props: CounterInfoPopoverProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (props.open) {
      if (ref.current) {
        ref.current.showModal();
      }
    } else {
      if (ref.current) {
        ref.current.close();
      }
    }
  }, [props.open]);

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <div className="flex flex-row items-start justify-between">
          <h3 className="pb-2 text-xl font-bold">Zählerinformationen</h3>
        </div>

        <ul className="list bg-base-200 rounded-box">
          <li className="list-row">
            <div className="flex flex-col">
              <span className="text-base-content/60 text-xs tracking-wide uppercase">Name</span>
              <span className="text-base font-medium">{props.counter.name}</span>
            </div>
          </li>

          {props.counter.count?.target !== undefined && (
            <li className="list-row">
              <div className="flex flex-col">
                <span className="text-base-content/60 text-xs tracking-wide uppercase">Zielwert</span>
                <span className="text-base font-medium">{props.counter.count.target}</span>
              </div>
            </li>
          )}

          {props.counter.stepOver?.target !== undefined && (
            <li className="list-row">
              <div className="flex flex-col">
                <span className="text-base-content/60 text-xs tracking-wide uppercase">Wiederholungen</span>
                <span className="text-base font-medium">{props.counter.stepOver.target}</span>
              </div>
            </li>
          )}

          {props.counter.editedAt && (
            <li className="list-row">
              <div className="flex flex-col">
                <span className="text-base-content/60 text-xs tracking-wide uppercase">Zuletzt bearbeitet</span>
                <span className="text-base font-medium">{props.counter.editedAt}</span>
              </div>
            </li>
          )}
        </ul>

        <div className="modal-action">
          <button className="btn" onClick={() => props.setOpen(false)}>
            Schließen
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default CounterInfoPopover;
