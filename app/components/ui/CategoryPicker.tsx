import { useEffect, useState } from "react";
import type { CounterCategory } from "~/models/entities/counter/CounterCategory";
import AddIcon from "./icons/AddIcon";

const CREATE_CATEGORY_VALUE = "__create_category__";

type CategoryPickerProps = {
  categories: CounterCategory[];
  value?: string;
  onChange: (categoryId?: string) => void;
  onCreateCategory?: (name: string) => Promise<CounterCategory | undefined>;
};

function CategoryPicker(props: CategoryPickerProps) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [createdCategories, setCreatedCategories] = useState<CounterCategory[]>([]);
  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    setCreatedCategories((current) =>
      current.filter((createdCategory) => !props.categories.some((category) => category.id === createdCategory.id))
    );
  }, [props.categories]);

  const categories = [...props.categories, ...createdCategories];

  const handleChange = (value: string) => {
    if (value === CREATE_CATEGORY_VALUE) {
      setCreating(true);
      return;
    }

    setCreating(false);
    props.onChange(value || undefined);
  };

  const createCategory = async () => {
    const categoryName = name.trim();
    if (!categoryName || !props.onCreateCategory) return;

    setCreatingCategory(true);
    const category = await props.onCreateCategory(categoryName);
    setCreatingCategory(false);
    if (!category) return;

    setCreatedCategories((current) => [...current, category]);
    setName("");
    setCreating(false);
    props.onChange(category.id);
  };

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Kategorie</legend>
      <select
        className="select w-full"
        value={creating ? CREATE_CATEGORY_VALUE : (props.value ?? "")}
        onChange={(event) => handleChange(event.target.value)}
      >
        <option value="">Ohne Kategorie</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
        {props.onCreateCategory && <option value={CREATE_CATEGORY_VALUE}>Neue Kategorie...</option>}
      </select>
      {creating && props.onCreateCategory && (
        <div className="join mt-1 w-full">
          <input
            autoFocus
            type="text"
            className="input join-item w-full"
            placeholder="Zum Beispiel Ärmel"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void createCategory();
              }
            }}
          />
          <button
            type="button"
            className="btn join-item"
            disabled={!name.trim() || creatingCategory}
            onClick={() => void createCategory()}
          >
            <AddIcon className="size-4 stroke-current" strokeWidth={1.5} />
            Erstellen
          </button>
        </div>
      )}
    </fieldset>
  );
}

export default CategoryPicker;
