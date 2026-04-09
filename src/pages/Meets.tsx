import type {Track} from "../utils/XslxParser.ts";
import {groupBy} from "../utils/ArrayUtils.ts";

type MeetsProps = {
  tracks: Track[],
}

const Meets = ({ tracks }: MeetsProps) => {


  const groupedByDate = groupBy(tracks, "date")
  console.log(groupedByDate);

  return (
    <div>
      <div>Heyababes</div>
      <div>{Object.entries(groupedByDate).length} møter</div>
    </div>
  )
}

export default Meets;
