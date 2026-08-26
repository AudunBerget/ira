import styled from "@emotion/styled";
import {breakpoints} from "../../utils/Variables.ts";
import type {Track} from "../../utils/XslxParser.ts";
import {groupBy} from "../../utils/ArrayUtils.ts";
import {normalizeTheArtist} from "../../utils/StringUtils.ts";

type MeetCardProps = {
  songs: Track[],
  meetingId: number, // essentially just a numbering of meetings, such that meeting 1 will be the first meet ever
  date: string,
}

const ComponentMeetCard = styled('div') ({
  [breakpoints.minWid768]: {
    marginBottom: '1rem',
  },
  marginBottom: '0.5rem',
  border: '1px solid var(--ira-red-color)',
  borderTopRightRadius: '0.7rem',
  borderTopLeftRadius: '0.7rem',
  borderBottomRightRadius: '0.7rem',
  borderBottomLeftRadius: '0.7rem',
})

const ComponentMeetCardHeader = styled('div') ({
  [breakpoints.minWid768]: {
  },
  backgroundColor: 'var(--ira-red-color)',
  color: 'var(--ds-color-accent-background-default)',
  padding: '0.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  borderTopRightRadius: '0.7rem',
  borderTopLeftRadius: '0.7rem',
})

const ComponentMeetCardContentWrapper = styled('div') ({
  [breakpoints.minWid768]: {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
  display: 'grid',

  padding: '0.5rem',
})

const ComponentMeetCardContent = styled('div') ({
  [breakpoints.minWid768]: {
    paddingRight: '1rem',
  },
  paddingLeft: '1rem',
  paddingBottom: '1rem',
  textIndent: '-1rem',

  h3: {
    marginTop: '0.5rem',
    marginBottom: '0.25rem',
  }
})

const CompnentMeetCardContentArtist = styled('span') ({
  fontWeight: 'bold',
})

const MeetCard = ({songs, meetingId, date}: MeetCardProps) => {
  const [year, month, day] = date.split('-');
  const groupedByOwner = groupBy(songs, 'owner')

  return (
    <ComponentMeetCard>
      <ComponentMeetCardHeader><span>Møte {meetingId} - {songs.length} sanger</span> <span>{day}-{month}-{year}</span></ComponentMeetCardHeader>
      <ComponentMeetCardContentWrapper>
      {Object.entries(groupedByOwner).map(([owner, songs], index) =>
        <ComponentMeetCardContent key={meetingId + owner + index}>
          <h3>{owner} ({songs.length})</h3>
          {songs.map((song, index) =>
            <div key={meetingId + owner + index + '-song-list'}>
              <CompnentMeetCardContentArtist>{normalizeTheArtist(song.artist)}</CompnentMeetCardContentArtist> - {song.title} {song.comment ? `(${song.comment})` : ''}
            </div>
          )}
        </ComponentMeetCardContent>
      )}
      </ComponentMeetCardContentWrapper>
    </ComponentMeetCard>
  )

}


export default MeetCard;
