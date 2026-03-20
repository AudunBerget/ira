import {CaretUpDownFilledDownIcon, CaretUpDownFilledUpIcon, CaretUpDownIcon} from "@navikt/aksel-icons";
import {SortOrder} from "../../types/Sort.ts";


type SortCaretProps = {
  order: SortOrder;
  toggleSort: () => void;
  className?: string;
  active: boolean;
  label?: string;
  labelClassName?: string;
}

const SortCaret = ({active, order, toggleSort, className, label, labelClassName}: SortCaretProps) => {

  const aria = (order: SortOrder) => {
    switch (order) {
      case "ASC":
        return "Sorter synkende";
      case "DESC":
        return "Sorter stigende";
      case "NONE":
        return "Ingen sortering";
    }
  }

  const icon = () => {
    if (active) {
      if (order === SortOrder.ASC) {
        return <CaretUpDownFilledUpIcon aria-label="Sortert stigende"/>
      } else if (order === SortOrder.DESC) {
        return <CaretUpDownFilledDownIcon aria-label="Sortert synkende"/>
      }
    }
    return <CaretUpDownIcon aria-label="Ikke sortert" />
  }

  return (
    <button
      type="button"
      aria-label={aria(order)}
      onClick={toggleSort}
      className={'sort-caret-button' + (className ? ` ${className}` : '')}>
      {label ? <span className={'sort-caret-label' + (labelClassName ? ` ${labelClassName}` : '')}>{label}</span> : null}
      {icon()}
    </button>
  )
}


export default SortCaret;
