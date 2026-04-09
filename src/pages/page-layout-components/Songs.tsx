import styled from "@emotion/styled";
import {breakpoints} from "../../utils/Variables.ts";
import {ChevronDownIcon, ChevronUpIcon} from "@navikt/aksel-icons";

const ComponentSongLayout = styled('div') ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',

  [breakpoints.minWid768]: {
    flexDirection: 'row',
    marginTop: '20px',
  },
})

type ChildOnlyProps = {
  children?: React.ReactNode,
}

export const SongLayout = ({children}: ChildOnlyProps) => {
  return (
    <ComponentSongLayout>
      {children}
    </ComponentSongLayout>
  )}

const ComponentSongControlLayout = styled('div') ({

})

const ComponentSongControlMobile = styled('div') ({
  [breakpoints.minWid768]: {
    display: 'none',
  },
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  label: {
    color: 'var(--ira-red-color)',
  }
})

const ComponentSongControlDesktop = styled('div') ({
  [breakpoints.minWid768]: {
    display: 'flex',
  },
  display: 'none',
  width: '350px',
  flexDirection: 'column',
  label: {
    color: 'var(--ira-red-color)',
  }
})

const ComponentAccordionToggle = styled('div') ({
  [breakpoints.minWid768]: {
    display: 'none',
  },
  color: 'var(--ira-red-color)',
  fontSize: '2rem',
  justifyContent: 'space-between',
  display: 'flex'
})


type SongControlAccordionProps = {
  children?: React.ReactNode,
  isOpen: boolean
  onClick: React.MouseEventHandler<HTMLDivElement>,
  label?: string,
}

const ComponentAccordionLabel = styled('span') ({
  fontSize: '1.5rem',
})

const SongControlAccordionToggle = ({
  onClick,
  isOpen,
  label,
}: SongControlAccordionProps) => {
  return (
    <ComponentAccordionToggle onClick={onClick}>
      {label && isOpen && <ComponentAccordionLabel>Skjul {label}</ComponentAccordionLabel>}
      {label && !isOpen && <ComponentAccordionLabel>Vis {label}</ComponentAccordionLabel>}
      {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </ComponentAccordionToggle>
  )
}

const ComponentAccordionClose = styled('div') ({
  [breakpoints.minWid768]: {
    display: 'none',
  },
  width: 'fit-content',
  height: 'fit-content',
  fontSize: '2rem',
  alignSelf: 'center',
  color: 'var(--ira-red-color)',
})

const SongControlAccordionClose = ({
  onClick,
}: SongControlAccordionProps) => {
  return (
    <ComponentAccordionClose onClick={onClick}>
      <ChevronUpIcon/>
    </ComponentAccordionClose>
  )
}

export const SongControlLayout = ({
  children,
  isOpen,
  onClick,
  label,
}: SongControlAccordionProps) => {
  return (
    <ComponentSongControlLayout>
      <ComponentSongControlMobile>
        <SongControlAccordionToggle
          onClick={onClick}
          isOpen={isOpen}
          label={label}
        />
        {isOpen && <>{children}</>}
        {isOpen &&
        <SongControlAccordionClose
          isOpen={isOpen}
          onClick={onClick}
        />}
      </ComponentSongControlMobile>
      <ComponentSongControlDesktop>
        {children}
      </ComponentSongControlDesktop>
    </ComponentSongControlLayout>
  )
}

export const ComponentSongCardHeader = styled('div') ({
  [breakpoints.minWid768]: {
    display: 'grid',
  },
  display: 'none',
  padding: '0.5rem',
  gridTemplateColumns: '0.3fr 1fr 1fr 0.3fr',
  borderTop: '1px solid var(--ira-red-color)',
  borderBottom: '1px solid var(--ira-red-color)',
  borderTopLeftRadius: '0.5rem',
  borderTopRightRadius: '0.5rem',
  fontWeight: 'bold',
  backgroundColor: 'var(--ira-red-color)',
  color: 'var(--ds-color-accent-background-default)',
})

export const ComponentSongCardWrapper = styled('div') ({
  [breakpoints.minWid768]: {
    paddingRight: '1rem',
    height: 'auto',
  },
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
  maxHeight: '100vh',
  overflowY: 'auto',
})

export const ComponentSongCardDetailsWrapper = styled('div') ({
  [breakpoints.minWid768]: {
    position: 'static',
  },
  position: 'sticky',
  top: 0,
  zIndex: 1,
  backgroundColor: 'var(--ds-color-info-background-default)',
})

export const ComponentSongPaginationWrapper = styled('div') ({
  [breakpoints.minWid768]: {
    display: 'flex',
  },
  display: 'flex',
  justifyContent: 'center',
  marginTop: '2rem',
  marginBottom: '2rem',
})

