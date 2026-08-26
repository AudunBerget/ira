import type {Track} from "../utils/XslxParser.ts";
import {groupBy} from "../utils/ArrayUtils.ts";
import MeetCard from "./page-components/MeetCard.tsx";

type MeetsProps = {
  tracks: Track[],
}

const Meets = ({ tracks }: MeetsProps) => {

  const tracksSortedByDateAsc = tracks.sort((a, b) => a.date.getTime() - b.date.getTime());
  const groupedByDate = groupBy(tracksSortedByDateAsc, "date", 'YY-MM-DD')

  return (
    <div>
      <h2>{Object.entries(groupedByDate).length} møter</h2>
      {Object.entries(groupedByDate).map(([date, songs], index) =>
        <MeetCard key={`${date}-${index}`} meetingId={index + 1} date={date} songs={songs} />
      )}
    </div>
  )
}

export default Meets;
