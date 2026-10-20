import styled from '@emotion/styled';
import { StyledCardTitle } from '../page-components/BigStatsCard.tsx';
import type { Track } from '../../types.ts';
import { useMemo } from 'react';

interface MostPlayedArtistsProps {
  tracks: Track[];
}

// todo generic stats wrapper?
export const Wrapper = styled('div')({
  border: '1px solid var(--border)',
  borderRadius: 15,
  backgroundColor: 'var(--surface-white)',
  padding: '1rem'
});

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

const mostPlayedArtists = (tracks: Track[]): {artist: string, totalSongs: number }[] => {
  const counts = new Map<string, { display: string; count: number }>()
  for (const track of tracks) {
    const entry = counts.get(track.artistRaw)
    if (entry) {
      entry.count++
    } else {
      counts.set(track.artistRaw, { display: track.artist, count: 1 })
    }
  }
  return [...counts.values()]
    .map(({ display, count }) => ({ artist: display, totalSongs: count }))
    .sort((a, b) => b.totalSongs - a.totalSongs)
    .filter(o => o.totalSongs > 15)
}

const MostPlayedArtists = ({ tracks }: MostPlayedArtistsProps) => {
  const stats = useMemo(() => mostPlayedArtists(tracks), [tracks]);

  return (
    <Wrapper>
      <StyledCardTitle>Mest spilte artister</StyledCardTitle>
      <List>
        {stats.map((song, index) => (
          <ListItem>
            <ArtistWrapper>
              <span>#{index + 1}</span>
              <ArtistItem>{song.artist}</ArtistItem>
            </ArtistWrapper>
            <span>{song.totalSongs}x</span>
          </ListItem>
        ))}
      </List>
    </Wrapper>
  );
};

export default MostPlayedArtists;
