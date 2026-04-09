import {Divider, Link as DSLink} from '@digdir/designsystemet-react';
import {MenuHamburgerIcon, XMarkIcon} from '@navikt/aksel-icons';
import styled from '@emotion/styled';
import {Outlet, useLocation, Link as RouterLink} from "react-router-dom";
import {breakpoints} from "../utils/Variables.ts";
import {type ReactNode, useRef, useState} from "react";
import {useClickOutside} from "../hooks/useClickOutside.ts";
import iraLogo from "@/assets/iralogonotext.jpg"

const ComponentHeaderWrapper = styled('header')(() => ({
  display: 'flex',
  color: 'var(--ira-red-color)',
}))

const ComponentDesktopHeaderItem = styled('div')(() => ({
  [breakpoints.minWid768]: {
    display: 'flex',
    alignItems: 'center',
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
    color: 'var(--ira-red-color)',
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

const ComponentHeaderLogo = styled('img')({
  [breakpoints.minWid768]: {
    width: '200px',
  },

  width: '100px',
  height: 'auto',
})


export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const activeLink = (path: string) => {
    return location.pathname === path ? 'header-link-active' : 'header-link';
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
          <ComponentHeaderLogo src={iraLogo} alt='IRA Logo' />
        </ComponentHeaderItem>
        <ComponentDesktopHeaderItem className='header-desktop'>
          <RouterLink className={activeLink('/moter')} to='/moter'>Møter</RouterLink>
          <RouterLink className={activeLink('/spor')} to='/spor'>Spor</RouterLink>
          <RouterLink className={activeLink('/stats')} to='/stats'>Statistikk</RouterLink>
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
          <DSLink asChild onClick={() => {setIsMenuOpen(!isMenuOpen)}}>
            <RouterLink className={activeLink('/moter')} to='/moter'>Møter</RouterLink>
          </DSLink>
          <DSLink asChild onClick={() => {setIsMenuOpen(!isMenuOpen)}}>
            <RouterLink className={activeLink('/spor')} to='/spor'>Spor</RouterLink>
          </DSLink>
          <DSLink asChild onClick={() => {setIsMenuOpen(!isMenuOpen)}}>
            <RouterLink className={activeLink('/stats')} to='/stats'>Statistikk</RouterLink>
          </DSLink>
        </Popup>
      }
      <main>
        <Outlet />
      </main>
    </>
  )
};

