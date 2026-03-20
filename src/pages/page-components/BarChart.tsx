import {useMemo} from "react";
import {normalizeTheArtist} from "../../utils/StringUtils.ts";
import {ResponsiveBar} from "@nivo/bar";
import {color as d3Color} from "d3-color";
import type {Track} from "../../utils/XslxParser.ts";


type BarChartProps = {
    data: Track[];
    height?: number;
    topN?: number;
    title?: string;
}

const BarChart = ({
                    data,
                    height = 1000,
                    topN = 20,
                    title,
}: BarChartProps) => {

  const chartData = useMemo(() => {
    const map = new Map<
      string,
      {
        artist: string;
        count: number;
        tracks: Track[];
      }
    >();
    data.forEach((row) => {
      const raw = row.artist ?? row["artist"] ?? "Unknown";
      const artist = normalizeTheArtist(String(raw).trim());
      const entry = map.get(artist);
      if (!entry) {
        map.set(artist, { artist, count: 1, tracks: [row] });
      } else {
        entry.count += 1;
        entry.tracks.push(row);
      }
    });

    const arr = Array.from(map.values()).sort((a, b) => b.count - a.count); // largest first
    return topN ? arr.slice(0, topN).reverse() : arr.reverse();
  }, [data, topN])

  const uniqueArtists = useMemo(() => {
    return new Set(data.map((track: Track) => track.artist)).size
  }, [data])

  const dynamicHeight = Math.max(height, (topN ? topN : uniqueArtists * 32) + 80)
  const baseColor = "#3B82F6";

  type BarDatum = {
    artist: string;
    count: number;
  }

  const nivoData: BarDatum[] = chartData.map((d) => ({
    artist: d.artist,
    count: d.count,
  }));

  return (
    <div style={{ height: dynamicHeight }}>
      {title &&
        <h2 style={{ textAlign: "center" }}>
          {title}
        </h2>
      }
      <ResponsiveBar<BarDatum>
        data={nivoData as BarDatum[]}
        keys={['count']}
        indexBy={'artist'}
        layout={'horizontal'}
        margin={{ top: 20, right: 30, bottom: 50, left: 150 }}
        padding={0.15}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={(bar) => {
          const total = chartData.length;
          const t = bar.index / (total - 1); // 0 → 1
          const c = d3Color(baseColor);
          if (!c) return baseColor;

          // brighten between 0 and ~2.5 levels
          return c.darker(t * 2.5).formatHex();
        }}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        borderRadius={4}
        enableLabel={false}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 8,
          tickRotation: 0,
          legend: "Count",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 8,
          tickRotation: 0,
          legend: "",
          format: (value) => String(value)
        }}
        animate={true}
        motionConfig="gentle"
        // add value marker at the end of each bar
        layers={[
          "grid",
          "axes",
          "bars",
          "markers",
          "legends",
          // custom layer to draw the count text at the end of the bar
          (props) => {
            // props has svg context and bars data
            const { bars } = props;
            return (
              <g>
                {bars.map((bar) => {
                  const x = bar.x + bar.width + 6;
                  const y = bar.y + bar.height / 2;
                  return (
                    <text
                      key={bar.key}
                      x={x}
                      y={y}
                      dy="0.35em"
                      style={{
                        fontSize: 12,
                        fill: "#111",
                        alignmentBaseline: "middle",
                      }}
                    >
                      {bar.data.value}
                    </text>
                  );
                })}
              </g>
            );
          },
        ]}
        // small accessibility props
        role="img"
        ariaLabel="Horizontal bar chart showing counts per artist"
      />
    </div>
  )
}

export default BarChart;
