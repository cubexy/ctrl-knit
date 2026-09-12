import { useDroppable } from "@dnd-kit/core";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import SettingsIcon from "./icons/SettingsIcon";

type CategoryDropZoneProps = {
  categoryId?: string;
  name: string;
  count: number;
  addAction?: ReactNode;
  onRename?: (name: string) => void | Promise<void>;
  children: ReactNode;
};

function CategoryDropZone(props: CategoryDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `counter-category:${props.categoryId ?? "uncategorized"}`,
    data: { type: "counter-category", categoryId: props.categoryId }
  });
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(props.name);

  useEffect(() => setDraftName(props.name), [props.name]);

  const submitRename = (event: FormEvent) => {
    event.preventDefault();
    const name = draftName.trim();
    if (!name || !props.onRename) return;
    void props.onRename(name);
    setEditing(false);
  };

  return (
    <section
      ref={setNodeRef}
      className={`col-span-full rounded-3xl p-2 transition-colors ${isOver ? "bg-primary/10" : "bg-base-200/30"}`}
    >
      <header className="flex items-center justify-between gap-2 px-2 pb-2">
        {editing ? (
          <form className="flex min-w-0 flex-1 items-center gap-2" onSubmit={submitRename}>
            <input
              autoFocus
              className="input input-sm min-w-0 flex-1"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
            />
            <button type="submit" className="btn btn-sm btn-primary" disabled={!draftName.trim()}>
              Speichern
            </button>
            <button type="button" className="btn btn-sm" onClick={() => setEditing(false)}>
              Abbrechen
            </button>
          </form>
        ) : (
          <div className="flex min-w-0 items-center gap-1">
            {props.onRename ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm min-w-0 justify-start px-1"
                title="Kategorie umbenennen"
                onClick={() => setEditing(true)}
              >
                <span className="truncate text-sm font-bold uppercase">{props.name}</span>
                <SettingsIcon className="ml-1 size-4 shrink-0 stroke-current opacity-60" strokeWidth={1.5} />
              </button>
            ) : (
              <h3 className="truncate px-1 text-sm font-bold uppercase">{props.name}</h3>
            )}
            <span className="text-xs opacity-60">{props.count}</span>
          </div>
        )}
        {!editing && props.addAction}
      </header>
      <div className="grid min-h-16 grid-cols-1 gap-4 sm:grid-cols-2">{props.children}</div>
    </section>
  );
}

export default CategoryDropZone;
