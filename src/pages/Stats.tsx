import BigStatsCard from './page-components/BigStatsCard.tsx';
import styled from '@emotion/styled';
import type { Track } from '../types.ts';
import { groupSongsByDate } from '../utils/DataUtils.ts';
import { useMemo } from 'react';
import { SongsByYearChart } from './stats/SongsByYearChart.tsx';
import MostPlayedArtists from './stats/MostPlayedArtists.tsx';
import MostPlayedSongs from './stats/MostPlayedSongs.tsx';
import UniqueSongsPerOwnerChart from './stats/UniqueSongsPerOwnerChart.tsx';

type StatsProps = {
  data: Track[];
  height?: number;
  topN?: number;
}

const StyledBigStatsWrapper = styled('div')(() => ({
  display: 'grid',
  marginTop: '1.5rem',
  marginBottom: '1.5rem',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1rem'
}));

const TwoChartsWrapper = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
  marginTop: '1.5rem',
  marginBottom: '1.5rem',
}));

const Stats = ({ data }: StatsProps) => {
  const meetings = useMemo(() => groupSongsByDate(data), [data]);
  const firstMeet = meetings.keys().next().value;
  const lastMeet = [...meetings.keys()].at(-1)
  const uniqueArtists = new Set(
    data.map((t) => `${t.artist.toLowerCase()}`),
  ).size;
  const uniqueness = uniqueArtists / data.length;
  const firstMeetYear = firstMeet ? Number(firstMeet.slice(-4)) : 0;
  const lastMeetYear = lastMeet ? Number(lastMeet.slice(-4)) : 0;
  const yearsActive = (lastMeetYear - firstMeetYear) + 1;

  return (
    <div className="stats-wrapper">
      <StyledBigStatsWrapper>
        <BigStatsCard
          title={'Sanger spilt'}
          stat={data.length}
          statNote={'på alle møter'}
        />
        <BigStatsCard
          title={'Møter'}
          stat={meetings.size}
          statNote={`siden ${firstMeetYear}`}
          statColor={'var(--ira-orange-color)'}
        />
        <BigStatsCard
          title={'Unike artister'}
          stat={uniqueArtists}
          statNote={`${(uniqueness * 100).toFixed(1)}% unike artister`}
          statColor={'var(--ira-blue-color)'}
        />
        <BigStatsCard
          title={'År aktive'}
          stat={yearsActive}
          statNote={`${firstMeetYear} - ${lastMeetYear}`}
          statColor={'var(--ira-green-color)'}
        />
      </StyledBigStatsWrapper>
      <SongsByYearChart tracks={data} />
      <TwoChartsWrapper>
        {/* todo Refactor ovenfor for å kunne definere antall gridplasser */}
        <MostPlayedArtists tracks={data} />
        <MostPlayedSongs tracks={data} />
      </TwoChartsWrapper>
      <UniqueSongsPerOwnerChart tracks={data} />
    </div>
  );
};

export default Stats;
