import { useEffect, useRef, useState } from "react";
import type { CounterCategory } from "~/models/entities/counter/CounterCategory";
import AddIcon from "./icons/AddIcon";
import RemoveIcon from "./icons/RemoveIcon";
import SettingsIcon from "./icons/SettingsIcon";

type CategoryManagerProps = {
  categories: CounterCategory[];
  counterCounts: Record<string, number>;
  onCreate: (name: string) => void | Promise<unknown>;
  onUpdate: (id: string, name: string) => void | Promise<void>;
  onReorder: (orderedIds: string[]) => void | Promise<void>;
  onDelete: (id: string, targetCategoryId?: string) => void | Promise<void>;
};

function CategoryManager(props: CategoryManagerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [draftNames, setDraftNames] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [deleteTargetCategory, setDeleteTargetCategory] = useState("");

  const syncDraftNames = () => {
    setDraftNames(Object.fromEntries(props.categories.map((category) => [category.id, category.name])));
  };

  const open = () => {
    syncDraftNames();
    ref.current?.showModal();
  };

  const close = () => {
    ref.current?.close();
    setName("");
    setPendingDelete(null);
    setDeleteTargetCategory("");
  };

  useEffect(() => {
    if (ref.current?.open) syncDraftNames();
  }, [props.categories]);

  const createCategory = () => {
    const categoryName = name.trim();
    if (!categoryName) return;
    void props.onCreate(categoryName);
    setName("");
  };

  const updateCategory = (category: CounterCategory) => {
    const updatedName = draftNames[category.id]?.trim();
    if (!updatedName || updatedName === category.name) return;
    void props.onUpdate(category.id, updatedName);
  };

  const moveCategory = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= props.categories.length) return;
    const orderedIds = props.categories.map((category) => category.id);
    [orderedIds[index], orderedIds[targetIndex]] = [orderedIds[targetIndex], orderedIds[index]];
    void props.onReorder(orderedIds);
  };

  const requestDelete = (category: CounterCategory) => {
    if ((props.counterCounts[category.id] ?? 0) === 0) {
      void props.onDelete(category.id);
      return;
    }
    setPendingDelete(category.id);
    setDeleteTargetCategory("");
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    void props.onDelete(pendingDelete, deleteTargetCategory || undefined);
    setPendingDelete(null);
    setDeleteTargetCategory("");
  };

  const pendingCategory = props.categories.find((category) => category.id === pendingDelete);

  return (
    <>
      <div className="card card-dash border-base-300 w-full rounded-3xl">
        <div className="card-body w-full items-center p-2">
          <button
            className="btn btn-ghost flex w-full flex-row items-center justify-between rounded-full px-0.5"
            onClick={open}
          >
            <p className="grow-0 font-normal">Kategorien bearbeiten</p>
            <SettingsIcon className="size-5 stroke-current" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
        <form
          className="modal-box"
          onSubmit={(event) => {
            event.preventDefault();
            createCategory();
          }}
        >
          <h3 className="pb-2 text-xl font-bold">Kategorien bearbeiten</h3>
          <p className="mb-4 text-sm opacity-70">
            Lege Kategorien für neue Zähler an und passe bestehende Kategorien an.
          </p>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Neue Kategorie</legend>
            <div className="join w-full">
              <input
                type="text"
                className="input join-item w-full"
                placeholder="Zum Beispiel Ärmel"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <button type="submit" className="btn join-item" disabled={!name.trim()}>
                <AddIcon className="size-4 stroke-current" strokeWidth={1.5} />
                Hinzufügen
              </button>
            </div>
          </fieldset>

          <div className="mt-5 flex flex-col gap-2">
            {props.categories.map((category, index) => (
              <div key={category.id} className="border-base-300 rounded-2xl border p-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="input w-full"
                    value={draftNames[category.id] ?? category.name}
                    onChange={(event) =>
                      setDraftNames((current) => ({ ...current, [category.id]: event.target.value }))
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => updateCategory(category)}
                    disabled={!draftNames[category.id]?.trim() || draftNames[category.id] === category.name}
                  >
                    Speichern
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => requestDelete(category)}>
                    <RemoveIcon className="stroke-error size-4" strokeWidth={1.5} />
                  </button>
                </div>
                <p className="px-2 pt-1 text-xs opacity-60">{props.counterCounts[category.id] ?? 0} Zähler</p>
                <div className="mt-2 flex gap-2 px-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    disabled={index === 0}
                    aria-label={`${category.name} nach oben verschieben`}
                    onClick={() => moveCategory(index, -1)}
                  >
                    Nach oben
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    disabled={index === props.categories.length - 1}
                    aria-label={`${category.name} nach unten verschieben`}
                    onClick={() => moveCategory(index, 1)}
                  >
                    Nach unten
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pendingCategory && (
            <div className="alert alert-warning mt-4 block">
              <p className="font-medium">
                {props.counterCounts[pendingCategory.id]} Zähler aus „{pendingCategory.name}“ verschieben?
              </p>
              <p className="mt-1 text-sm">Die Zähler bleiben erhalten.</p>
              <select
                className="select mt-3 w-full"
                value={deleteTargetCategory}
                onChange={(event) => setDeleteTargetCategory(event.target.value)}
              >
                <option value="">Ohne Kategorie</option>
                {props.categories
                  .filter((category) => category.id !== pendingCategory.id)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" className="btn btn-sm" onClick={() => setPendingDelete(null)}>
                  Abbrechen
                </button>
                <button type="button" className="btn btn-error btn-sm" onClick={confirmDelete}>
                  Kategorie löschen
                </button>
              </div>
            </div>
          )}

          <div className="modal-action">
            <button type="button" className="btn" onClick={close}>
              Schließen
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default CategoryManager;
