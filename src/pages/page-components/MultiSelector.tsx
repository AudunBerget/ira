import Select, {type StylesConfig} from "react-select";
import { useMemo } from "react";

type SelectorItem = { value: string; label: string; };

type MultiSelectorProps = {
  options: SelectorItem[];
  value: string[];
  onChange: (selectedValues: string[]) => void;
};

export default function MultiSelector({
                                        options,
                                        value,
                                        onChange,
                                      }: MultiSelectorProps) {
  const optionsWithAll = useMemo(
    () => [{ value: "alle", label: "Alle" }, ...options.filter((o) => o.value !== "alle")],
    [options]
  );

  // Map from value[] -> option objects for react-select
  const selectedOptions = useMemo(
    () => optionsWithAll.filter((opt) => value.includes(opt.value)),
    [optionsWithAll, value]
  );

  const handleChange = (newValue: readonly SelectorItem[] | null, actionMeta?: any) => {
    const next = Array.isArray(newValue) ? newValue : [];
    const nextValues = next.map((o) => o.value);

    const action = actionMeta?.action;
    const actionOption = actionMeta?.option;

    if (action === "clear") {
      onChange(["alle"]);
      return;
    }

    if (action === "select-option" && actionOption?.value === "alle") {
      onChange(["alle"]);
      return;
    }

    if (action === "select-option" && actionOption && actionOption.value !== "alle") {
      // user selected non-alle while alle was present -> remove 'alle'
      if (nextValues.includes("alle")) {
        const withoutAlle = nextValues.filter((v) => v !== "alle");
        onChange(withoutAlle.length ? withoutAlle : ["alle"]);
        return;
      }
      onChange(nextValues.filter((v) => v !== "alle"));
      return;
    }

    if (action === "remove-value") {
      const withoutAlle = nextValues.filter((v) => v !== "alle");
      onChange(withoutAlle.length ? withoutAlle : ["alle"]);
      return;
    }

    // generic fallback
    if (nextValues.length === 0) {
      onChange(["alle"]);
      return;
    }

    onChange(nextValues.filter((v) => v !== "alle"));
  };

  const customStyles: StylesConfig<SelectorItem, true> = {
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'var(--ira-red-color-500)',
      color: 'var(--ira-red-color)',
      outline: '2x solid var(--ira-red-color)',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'var(--ira-red-color)',
    }),
    multiValueRemove: (base) => ({
      ...base,
      ':hover': {
        backgroundColor: 'var(--ira-red-color)',
        color: 'var(--ira-red-color-500)',
      }
    })
  }


  return (
    <Select<SelectorItem, true>
      isMulti
      options={optionsWithAll}
      value={selectedOptions}
      onChange={handleChange}
      closeMenuOnSelect={false}
      getOptionValue={(o) => o.value}
      getOptionLabel={(o) => o.label}
      hideSelectedOptions
      styles={customStyles}
    />
  );
}
