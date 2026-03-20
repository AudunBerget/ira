import BarChart from "./page-components/BarChart.tsx";
import type { Track } from "../utils/XslxParser.ts";

type StatsProps = {
  data: Track[];
  height?: number;
  topN?: number;
}

const Stats = ({
  data,
  topN,
  height = 1000,
}: StatsProps) => {


  return (
    <div className='stats-wrapper'>
      <BarChart
        data={data}
        topN={topN}
        height={height}
        title='Mest spilte artister'
      />
    </div>
  )
}

export default Stats;
