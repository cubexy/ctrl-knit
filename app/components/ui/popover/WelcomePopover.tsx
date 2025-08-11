import { useEffect, type RefObject } from "react";
import { LocalStorageController } from "~/hooks/api/LocalStorageController";
import WoolIcon from "../icons/WoolIcon";

type WelcomePopoverProps = {
  ref: RefObject<HTMLDialogElement | null>;
};

function WelcomePopover(props: WelcomePopoverProps) {
  useEffect(() => {
    const hasCompletedIntro = LocalStorageController.getIntroCompleted();
    if (!hasCompletedIntro) {
      props.ref.current?.showModal();
    }
  });

  const handleClose = () => {
    if (props.ref.current) {
      props.ref.current.close();
      LocalStorageController.setIntroCompleted();
    }
  };

  return (
    <>
      <dialog ref={props.ref} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className="mb-3 flex w-full items-center justify-center gap-2">
            <WoolIcon className="fill-base-300 size-12" strokeWidth={2} />
          </div>
          <div className="flex w-full flex-col gap-3">
            <p className="text-lg">
              Willkommen bei <span className="font-semibold">ctrl+knit</span>!
            </p>

            <div className="collapse-plus bg-base-100 border-base-300 collapse border">
              <input type="radio" name="my-accordion-3" defaultChecked />
              <div className="collapse-title font-semibold">Was ist ctrl+knit?</div>
              <div className="collapse-content text-sm">
                ctrl+knit ist eine kleine Webapp, um deine Reihen beim Stricken zu zählen - ganz ohne Papierkram. Sie
                funktioniert offline und auch über mehrere Geräte hinweg!
              </div>
            </div>
            <div className="collapse-plus bg-base-100 border-base-300 collapse border">
              <input type="radio" name="my-accordion-3" />
              <div className="collapse-title font-semibold">Wo kann ich Fehler melden oder neue Ideen einbringen?</div>
              <div className="collapse-content text-sm">
                Alle Arten von Feedback kannst du gerne im{" "}
                <a href="https://github.com/cubexy/ctrl-knit/issues" target="_blank" className="link">
                  GitHub-Repository
                </a>{" "}
                des Projektes da lassen. Contributions sind sehr willkommen!
              </div>
            </div>
            <p className="text-xs">
              Noch mehr coole Projekte:{" "}
              <a href="https://github.com/cubexy" target="_blank" className="link">
                GitHub
              </a>
            </p>
            <form method="dialog" className="w-full" onSubmit={handleClose}>
              <button className="btn btn-primary w-full">Los gehts!</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default WelcomePopover;
