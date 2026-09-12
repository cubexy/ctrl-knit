import { useRef, useState } from "react";
import type { CounterCategory } from "~/models/entities/counter/CounterCategory";
import type { CounterPresentation } from "~/models/entities/counter/CounterPresentation";
import AddIcon from "./icons/AddIcon";

type CounterOrganizerProps = {
  counters: CounterPresentation[];
  categories: CounterCategory[];
  onMove: (counterIds: string[], categoryId?: string) => Promise<void>;
  onCreateCategory: (name: string) => Promise<CounterCategory | undefined>;
};

function CounterOrganizer(props: CounterOrganizerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [moveMode, setMoveMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const close = () => {
    ref.current?.close();
    setSelectedIds(new Set());
    setMoveMode(false);
    setNewCategoryName("");
  };

  const toggleSelected = (counterId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(counterId)) next.delete(counterId);
      else next.add(counterId);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds((current) =>
      current.size === props.counters.length ? new Set() : new Set(props.counters.map((counter) => counter.id))
    );
  };

  const moveSelected = async (categoryId?: string) => {
    if (selectedIds.size === 0) return;
    await props.onMove([...selectedIds], categoryId);
    close();
  };

  const createCategoryAndMove = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    setCreatingCategory(true);
    const category = await props.onCreateCategory(name);
    setCreatingCategory(false);
    if (category) await moveSelected(category.id);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {props.categories.length > 0 && (
          <span className="text-warning text-xs font-medium">{props.counters.length} warten auf eine Kategorie</span>
        )}
        <button className="btn btn-primary btn-sm" onClick={() => ref.current?.showModal()}>
          Organisieren
        </button>
      </div>

      <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-h-[90dvh]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Zähler organisieren</h3>
              <p className="mt-1 text-sm opacity-70">Wähle Zähler aus und verschiebe sie gemeinsam.</p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={close}>
              Schließen
            </button>
          </div>

          {!moveMode ? (
            <>
              <label className="label border-base-300 mt-4 min-h-12 w-full cursor-pointer justify-start gap-3 border-b">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={selectedIds.size === props.counters.length}
                  onChange={toggleAll}
                />
                <span className="font-medium">Alle auswählen</span>
                <span className="ml-auto text-sm opacity-60">{selectedIds.size} ausgewählt</span>
              </label>
              <div className="mt-2 flex max-h-[45dvh] flex-col overflow-y-auto">
                {props.counters.map((counter) => (
                  <label
                    key={counter.id}
                    className="label border-base-300 min-h-14 w-full cursor-pointer justify-start gap-3 border-b last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={selectedIds.has(counter.id)}
                      onChange={() => toggleSelected(counter.id)}
                    />
                    <span className="min-w-0 flex-1 truncate">{counter.name}</span>
                    <span className="text-sm opacity-60">
                      {counter.count.current}
                      {counter.count.target ? ` / ${counter.count.target}` : ""}
                    </span>
                  </label>
                ))}
              </div>
              <div className="modal-action justify-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={selectedIds.size === 0}
                  onClick={() => setMoveMode(true)}
                >
                  Verschieben
                </button>
              </div>
            </>
          ) : (
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">{selectedIds.size} Zähler verschieben nach</p>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setMoveMode(false)}>
                  Zurück
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {props.categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className="btn btn-outline h-12 justify-start px-4"
                    onClick={() => void moveSelected(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
                <div className="join mt-2 w-full">
                  <input
                    type="text"
                    className="input join-item w-full"
                    placeholder="Neue Kategorie"
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void createCategoryAndMove();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn join-item"
                    disabled={!newCategoryName.trim() || creatingCategory}
                    onClick={() => void createCategoryAndMove()}
                  >
                    <AddIcon className="size-4 stroke-current" strokeWidth={1.5} />
                    Erstellen
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost mt-2 h-12 justify-start px-4"
                  onClick={() => void moveSelected()}
                >
                  Ohne Kategorie lassen
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}

export default CounterOrganizer;
