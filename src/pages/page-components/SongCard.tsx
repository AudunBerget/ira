import { formatDate } from "../../utils/DateUtils.ts";
import { normalizeTheArtist } from "../../utils/StringUtils.ts";
import styled from "@emotion/styled";
import { breakpoints } from "../../utils/Variables.ts";
import type { Track } from '../../types.ts';
import { ownerColor } from '../../utils/OWNER_COLORS.ts';

type SongCardProps = {
  song: Track;
};

const ComponentSongCard = styled("div")({
  [breakpoints.minWid768]: {
    display: "grid",
    padding: "0.5rem",
    gridTemplateColumns: "1fr 1fr 0.3fr 0.3fr",
    gridTemplateRows: "1fr",
    marginBottom: "0",
  },
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gridTemplateRows: "1fr 1fr 1fr",
  marginBottom: "0.5rem",
  borderBottom: "1px solid var(--muted-grey)",
  color: "var(--text-dark)",
  fontSize: "0.8rem",
});

const ComponentSongCardDate = styled("div")({
  [breakpoints.minWid768]: {
    gridColumn: "3",
    gridRow: "1",
    padding: "0",
  },
  [breakpoints.maxWid767]: {
    backgroundColor: "var(--ira-red-color)",
    color: "var(--ds-color-accent-background-default)",
    textAlign: "right",
  },

  gridColumnStart: "3",
  gridColumnEnd: "4",
  gridRow: "1",
  padding: "0.5rem",
  alignContent: "center",
});

const ComponentSongCardArtist = styled("div")({
  [breakpoints.minWid768]: {
    gridColumn: "1",
    gridRow: "1",
    padding: "0",
    fontWeight: "normal",
  },
  [breakpoints.maxWid767]: {
    backgroundColor: "var(--ira-red-color)",
    color: "var(--ds-color-accent-background-default)",
  },
  gridColumnStart: "1",
  gridColumnEnd: "3",
  gridRow: "1",
  fontWeight: "bold",
  padding: "0.5rem",
  alignContent: "center",
});

const ComponentSongCardTitle = styled("div")({
  [breakpoints.minWid768]: {
    gridColumn: "2",
    gridRow: "1",
    padding: "0",
  },
  gridColumnStart: "1",
  gridColumnEnd: "4",
  gridRowStart: "2",
  gridRowEnd: "4",
  padding: "0.5rem",
});

const ComponentSongCardPlayedBy = styled("div")({
  [breakpoints.minWid768]: {
    gridColumn: "4",
    gridRow: "1",
  },
  [breakpoints.maxWid767]: {
    textAlign: "right",
    padding: "0.5rem",
  },
  gridColumn: "3",
  gridRow: "3",
  alignContent: "center",
});

const Dot = ({ color = "var(--ira-grey-color)", size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true">
    <circle cx="5" cy="5" r="5" fill={color} />
  </svg>
);

const SongCard = ({ song }: SongCardProps) => {
  return (
    <ComponentSongCard>
      <ComponentSongCardDate>{formatDate(song.date, "DD.MM.YYYY")}</ComponentSongCardDate>
      <ComponentSongCardArtist>
        {normalizeTheArtist(song.artist)}
      </ComponentSongCardArtist>
      <ComponentSongCardTitle>{song.title.toString()}</ComponentSongCardTitle>
      <ComponentSongCardPlayedBy>
        <div style={{
          color: ownerColor(song.owner),
          display: "flex",
          alignItems: "center",
        }}>
          <Dot size={12} color={ownerColor(song.owner)} />
          <span style={{marginLeft: '0.3rem'}}>{song.owner}</span>
        </div>
      </ComponentSongCardPlayedBy>
    </ComponentSongCard>
  );
};

export default SongCard;
