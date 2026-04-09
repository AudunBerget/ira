import styled from "@emotion/styled";
import {breakpoints} from "../../utils/Variables.ts";
import type {Track} from "../../utils/XslxParser.ts";

type MeetCardProps = {
  song: Track
}

const ComponentMeetCard = styled('div') ({
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

const MeetCard = ({song}: MeetCardProps) => {

  return (
    <ComponentMeetCard>
      {song.date.toString()} - {song.artist} - {song.title} - {song.owner}
    </ComponentMeetCard>
  )

}


export default MeetCard;
