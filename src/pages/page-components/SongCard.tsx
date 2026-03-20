import {formatDate} from "../../utils/DateUtils.ts";
import {normalizeTheArtist} from "../../utils/StringUtils.ts";
import styled from "@emotion/styled";
import {breakpoints} from "../../utils/Variables.ts";
import type {Track} from "../../utils/XslxParser.ts";

type SongCardProps = {
  song: Track
}

const ComponentSongCard = styled('div') ({
  [breakpoints.minWid768]: {
    display: 'grid',
    padding: '0.5rem',
    gridTemplateColumns: '0.3fr 1fr 1fr 0.3fr',
    gridTemplateRows: '1fr',
    borderTop: '1px solid var(--ds-color-info-border-subtle)',
    borderBottom: '1px solid var(--ds-color-info-border-subtle)',
    borderLeft: '1px solid var(--ds-color-info-base-default)',
    borderRight: '1px solid var(--ds-color-info-base-default)',
    ':nth-of-type(odd)': {
      backgroundColor: 'color-mix(in srgb, var(--ds-color-info-base-default) 20%, transparent)',
    },
    marginBottom: '0',
  },
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gridTemplateRows: '1fr 1fr 1fr',
  marginBottom: '0.5rem',
  border: '1px solid var(--ds-color-info-border-subtle)',
})

const ComponentSongCardDate = styled('div') ({
  [breakpoints.minWid768]: {
    gridColumn: '1',
    gridRow: '1',
    padding: '0',
  },
  [breakpoints.maxWid767]: {
    backgroundColor: 'var(--ds-color-info-base-default)',
    color: 'var(--ds-color-accent-background-default)',
    textAlign: 'right',
  },
  gridColumnStart: '3',
  gridColumnEnd: '4',
  gridRow: '1',
  padding: '0.5rem',
  alignContent: 'center',
})

const ComponentSongCardArtist = styled('div') ({
  [breakpoints.minWid768]: {
    gridColumn: '2',
    gridRow: '1',
    padding: '0',
    fontWeight: 'normal',
  },
  [breakpoints.maxWid767]: {
    backgroundColor: 'var(--ds-color-info-base-default)',
    color: 'var(--ds-color-accent-background-default)',
  },
  gridColumnStart: '1',
  gridColumnEnd: '3',
  gridRow: '1',
  fontWeight: 'bold',
  padding: '0.5rem',
  alignContent: 'center',
})

const ComponentSongCardTitle = styled('div') ({
  [breakpoints.minWid768]: {
    gridColumn: '3',
    gridRow: '1',
    padding: '0',
  },
  gridColumnStart: '1',
  gridColumnEnd: '4',
  gridRowStart: '2',
  gridRowEnd: '4',
  padding: '0.5rem',
})

const ComponentSongCardPlayedBy = styled('div') ({
  [breakpoints.minWid768]: {
    gridColumn: '4',
    gridRow: '1',
  },
  [breakpoints.maxWid767]: {
    textAlign: 'right',
    padding: '0.5rem',
  },
  gridColumn: '3',
  gridRow: '3',
  alignContent: 'center',
})

const SongCard = ({song}: SongCardProps) => {

  return (
    <ComponentSongCard>
      <ComponentSongCardDate>{formatDate(song.date)}</ComponentSongCardDate>
      <ComponentSongCardArtist>{normalizeTheArtist(song.artist)}</ComponentSongCardArtist>
      <ComponentSongCardTitle>{song.title.toString()}</ComponentSongCardTitle>
      <ComponentSongCardPlayedBy>{song.owner}</ComponentSongCardPlayedBy>
    </ComponentSongCard>
  )

}


export default SongCard;
