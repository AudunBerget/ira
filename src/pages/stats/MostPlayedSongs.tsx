import styled from '@emotion/styled';
import { StyledBigStatsCardTitle } from '../page-components/BigStatsCard.tsx';
import { Wrapper } from './MostPlayedArtists.tsx';
import type { Track } from '../../types.ts';
import { useMemo } from 'react';

interface MostPlayedSongsProps {
  tracks: Track[];
}

const List = styled('div')({
  overflow: 'auto',
  height: '300px',
  marginTop: '1rem',
});

const ListItem = styled('div')({
  color: 'var(--muted-grey)',
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid var(--border)',
  marginBottom: '0.25rem',
  fontSize: '0.875rem',
  padding: '0.25rem',
});

const ArtistWrapper = styled('div')({
  display: 'flex',
  gap: '1rem',
})

const ArtistItem = styled('span')({
  color: 'var(--text-dark)',
})

const mostPlayedSongs = (tracks: Track[]): { artist: string, title: string, totalPlays: number }[] => {
  const counts = new Map<string, { display: string; title: string; count: number }>();
  for (const track of tracks) {
    const key = `${track.artistRaw}+${track.title}`;
    const entry = counts.get(key)
    if (entry) {
      entry.count++
    } else {
      counts.set(key, { display: track.artist, title: track.title, count: 1})
    }
  }
  return [...counts.values()]
    .map(({ display, title, count }) => ({ artist: display, title: title, totalPlays: count }))
    .sort((a, b) => b.totalPlays - a.totalPlays)
    .filter(o => o.totalPlays > 2)
}

const MostPlayedSongs = ({ tracks }: MostPlayedSongsProps) => {
  const stats = useMemo(() => mostPlayedSongs(tracks), [tracks]);
  return (
    <Wrapper>
      <StyledBigStatsCardTitle>Mest spilte sanger</StyledBigStatsCardTitle>
      <List>
        {stats.map((song, index) => (
          <ListItem>
            <ArtistWrapper>
              <span>#{index + 1}</span>
              <ArtistItem>{song.artist} - {song.title}</ArtistItem>
            </ArtistWrapper>
            <span>{song.totalPlays}x</span>
          </ListItem>
        ))}
      </List>
    </Wrapper>
  );
};

export default MostPlayedSongs;
