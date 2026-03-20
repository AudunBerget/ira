import {Divider, Heading, Link} from '@digdir/designsystemet-react';
import {SpeakerSoundWave3Icon, MenuHamburgerIcon, XMarkIcon} from '@navikt/aksel-icons';
import styled from '@emotion/styled';
import {Outlet, useLocation} from "react-router-dom";
import {breakpoints} from "../utils/Variables.ts";
import {type ReactNode, useRef, useState} from "react";
import {useClickOutside} from "../hooks/useClickOutside.ts";

const ComponentHeaderWrapper = styled('header')(() => ({
  display: 'flex',
  color: 'var(--ds-color-info-base-default)',
}))

const ComponentDesktopHeaderItem = styled('div')(() => ({
  [breakpoints.minWid768]: {
    display: 'flex',
  },
  display: 'none',
  gap: '1rem',
  padding: '1rem',
  fontSize: 'var(--ds-heading-lg-font-size)',
  justifyContent: 'center',
  flex: 1,
}))

const ComponentHeaderItem = styled('div')({
  display: 'inline-flex',
  fontSize: 'var(--ds-heading-lg-font-size)',
  gap: '1rem',
  padding: '1rem',
})

const ComponentMobileMenuWrapper = styled('div')({
  [breakpoints.minWid768]: {
    display: 'none',
  },
  display: 'flex',
  flex: '1',
  marginRight: '1rem',
  justifyContent: 'flex-end',
  fontSize: '3rem',

  button: {
    fontSize: '3rem',
    color: 'var(--ds-color-info-base-default)',
  }
})

const ComponentMobileMenu = styled('div')({
  [breakpoints.minWid768]: {
    display: 'none',
  },

  position: 'absolute',
  zIndex: 5,
  backgroundColor: '#fff',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  fontSize: '2rem',
})


export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const activeLink = (path: string) => {
    return location.pathname === path ? 'header-link.active' : 'header-link';
  }

  type PopUpProps = {
    onClose: () => void;
    children: ReactNode[] | ReactNode | null;
  }
  function Popup({ onClose, children}: PopUpProps) {
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, onClose);

    return <ComponentMobileMenu ref={ref}>{children}</ComponentMobileMenu>;
  }

  return (
    <>
      <ComponentHeaderWrapper>
        <ComponentHeaderItem>
          <Link href="/">
            <SpeakerSoundWave3Icon title='Ivrige Rockeres Avspillingslag' fontSize='4rem' />
          </Link>
            <Heading data-size='xl'>IRA</Heading>
        </ComponentHeaderItem>
        <ComponentDesktopHeaderItem className='header-desktop'>
          <Link className={activeLink('/moter')} href='/moter'>Møter</Link>
          <Link className={activeLink('/spor')} href='/spor'>Spor</Link>
          <Link className={activeLink('/stats')} href='/stats'>Statistikk</Link>
        </ComponentDesktopHeaderItem>
        <ComponentMobileMenuWrapper>
          <button
            className={'sort-caret-button'}
            onClick={() => {setIsMenuOpen(!isMenuOpen)}}
          >
            {isMenuOpen ? <XMarkIcon /> : <MenuHamburgerIcon />}
          </button>
        </ComponentMobileMenuWrapper>
      {/* todo Lightmode / darkmode? */}
      </ComponentHeaderWrapper>
      <Divider />
      {isMenuOpen &&
        <Popup onClose={() => setIsMenuOpen(false)}>
          <Link className={activeLink('/moter')} href='/moter'>Møter</Link>
          <Link className={activeLink('/spor')} href='/spor'>Spor</Link>
          <Link className={activeLink('/stats')} href='/stats'>Statistikk</Link>
        </Popup>
      }
      <main>
        <Outlet />
      </main>
    </>
  )
};

