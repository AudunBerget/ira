import styled from '@emotion/styled';
import { StyledBigStatsCardTitle } from '../page-components/BigStatsCard.tsx';

interface MostPlayedArtistsProps {
  stats: { artist: string; totalSongs: number }[];
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

const MostPlayedArtists = ({ stats }: MostPlayedArtistsProps) => {
  return (
    <Wrapper>
      <StyledBigStatsCardTitle>Mest spilte artister</StyledBigStatsCardTitle>
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
