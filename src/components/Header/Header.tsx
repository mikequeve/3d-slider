import React, { useState } from 'react';
import './Header.css';
import type { NavItem, SocialIcon } from '../../utils/types';
import { Menu, X } from 'lucide-react';

const navItems: NavItem[] = [
  { label: 'Tour' },
  { label: 'Galería de Aventuras' },
  { label: 'Acerca de' },
];

const socialIcons: SocialIcon[] = [
  { href: 'https://whatsapp.com', img: './whatsapp.svg' },
  { href: 'https://instagram.com', img: './instagram.svg' },
  { href: 'https://tiktok.com', img: './tiktok.svg' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className='flex center site-header'>
      <article className='flex container'>
        <div className='flex site-header__left'>
          <a href='#' className='site-logo'>
            super quads
          </a>
          <nav className={`flex center site-menu ${isOpen ? 'active' : ''}`}>
            {navItems.map((item, index) => (
              <a href='#' key={index} className='site-menu__item'>
                {item.label}
              </a>
            ))}
            <div className='flex center social-media'>
              {socialIcons.map((icon, index) => (
                <a
                  href={icon.href}
                  key={index}
                  className='flex center social-media__logo'
                >
                  <img src={icon.img} alt='' />
                </a>
              ))}
            </div>
          </nav>
        </div>
        <a href='#' className='primary-btn'>
          reservar
          <img src='./arrow-right-short.svg' alt='' />
        </a>
        <div
          className='flex center menu-btn__container'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </div>
      </article>
    </header>
  );
};

export default Header;
