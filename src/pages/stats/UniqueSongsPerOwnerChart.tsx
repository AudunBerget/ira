import type { Track } from '../../types.ts';
import { FullGridHeader, FullGridWidthWrapper, TooltipBox } from './SongsByYearChart.tsx';
import { StyledBigStatsCardTitle } from '../page-components/BigStatsCard.tsx';
import { Bar, BarChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';
import { ownerColors } from '../../utils/OwnerColors.ts';
import styled from '@emotion/styled';

interface UniqueSongsPerOwnerChartProps {
  tracks: Track[];
}
export const TooltipTitle = styled.span`
    font-weight: 600;
    margin-right: 4px;
`;

interface TooltipProps {
  active?: boolean
  label?: string
  payload?: { value: number }[]
}


function ChartTooltip({ active, label, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <TooltipBox>
      <TooltipTitle>{label}</TooltipTitle>
      {payload[0].value.toLocaleString()} sanger
    </TooltipBox>
  );
}

function uniqueSongsPerOwner(tracks: Track[]): { owner: string; count: number }[] {
  const songsByOwner = new Map<string, Set<string>>();
  for (const track of tracks) {
    if (track.owner.includes('(gjest)') || track.owner.length === 0) continue;

    const key = `${track.artistRaw}\u0000${track.title}`;
    let songs = songsByOwner.get(track.owner);
    if (!songs) {
      songs = new Set();
      songsByOwner.set(track.owner, songs);
    }
    songs.add(key);
  }
  return [...songsByOwner]
    .map(([owner, songs]) => ({ owner, count: songs.size }))
    .sort((a, b) => b.count - a.count);
}

function UniqueSongsPerOwnerChart({ tracks }: UniqueSongsPerOwnerChartProps) {
  const stats = useMemo(() => uniqueSongsPerOwner(tracks), [tracks]);

  return (
    <FullGridWidthWrapper>
      <FullGridHeader>
        <StyledBigStatsCardTitle>Unike sanger per medlem</StyledBigStatsCardTitle>
      </FullGridHeader>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={stats} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
          <XAxis
            dataKey="owner"
            tick={{ fill: 'var(--muted-grey)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            height={40}
          />
          <YAxis
            tick={{ fill: 'var(--muted-grey)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: 'var(--ira-red-color-200)' }}
          />
          <Bar
            dataKey="count"
            radius={[3, 3, 0, 0]}
            shape={(props) => (
              <Rectangle
                {...props}
                fill={ownerColors[props.payload.owner] ?? "var(--ira-grey-color)"}
              />
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    </FullGridWidthWrapper>
  )
}

export default UniqueSongsPerOwnerChart;
