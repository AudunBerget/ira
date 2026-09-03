import { useMemo } from 'react';
import styled from '@emotion/styled';
import type { Track } from '../../types.ts';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StyledBigStatsCardTitle } from '../page-components/BigStatsCard.tsx';

// ─── Data transform ──────────────────────────────────────────────────────────

function songsByYear(tracks: Track[]): { year: string; count: number }[] {
  const counts = new Map<number, number>();
  for (const track of tracks) {
    const year = track.date.getFullYear();
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, count]) => ({ year: String(year), count }));
}

// ─── Styled wrapper ───────────────────────────────────────────────────────────

const Wrapper = styled.div`
    background: var(--surface-white);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px 28px 16px;
    font-family: 'Inter', system-ui, sans-serif;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
`;

// ─── Custom tooltip ───────────────────────────────────────────────────────────

const TooltipBox = styled.div`
    background: var(--surface-white);
    border: 1px solid var(--muted-grey);
    border-radius: 8px;
    padding: 8px 12px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12px;
    color: var(--muted-grey);
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    pointer-events: none;
`;

const TooltipYear = styled.span`
    font-weight: 600;
    margin-right: 4px;
    color: var(--ira-red-color);
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
      <TooltipYear>{label}</TooltipYear>
      {payload[0].value.toLocaleString()} sanger
    </TooltipBox>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface SongsByYearChartProps {
  tracks: Track[];
}

export function SongsByYearChart({ tracks }: SongsByYearChartProps) {
  const data = useMemo(() => songsByYear(tracks), [tracks]);

  return (
    <Wrapper>
      <Header>
        <StyledBigStatsCardTitle>Sanger per år</StyledBigStatsCardTitle>
      </Header>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
          <XAxis
            dataKey="year"
            tick={{ fill: 'var(--muted-grey)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-45}
            textAnchor="end"
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
          <Bar dataKey="count" fill="var(--ira-red-color)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  );
}
