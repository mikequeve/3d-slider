import React, { useEffect, useRef, useState } from 'react';
import './Slider.css';
import type { Slide } from '../../utils/types';
import gsap from 'gsap';

const slides: Slide[] = [
  {
    img: './021.jpg',
    text: 'Recorrido dentro de nuestro bosque privado 1',
    title: 'Piscina Termal',
  },
  {
    img: './021.jpg',
    text: 'Recorrido dentro de nuestro bosque privado 2',
    title: 'Bosque Privado',
  },
  {
    img: './021.jpg',
    text: 'Recorrido dentro de nuestro bosque privado 3',
    title: 'Grupos Reducidos',
  },
  {
    img: './021.jpg',
    text: 'Recorrido dentro de nuestro bosque privado 4',
    title: 'Experiencia Exclusiva',
  },
];

const Slider: React.FC = () => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Angle (in degrees) between each slide in the circular formation
   * @constant {number}
   */
  const anglePerCard = 45;

  /**
   * Rotates the wheel and positions cards in 3D space
   * @param {number} index - Index of the active slide
   * @returns {void}
   */
  const rotateWheel = (index: number) => {
    const angle = -index * anglePerCard;

    // Animate wheel rotation
    gsap.to(wheelRef.current, {
      rotate: angle,
      duration: 0.5,
      ease: 'power2.out',
    });

    // Position each card in 3D space
    cardsRef.current.forEach((card, i) => {
      // Calculate relative position to active slide
      const relativeIndex = (i - index + slides.length) % slides.length;

      /**
       * Angle (in degrees)
       * Defines the position of each card in the circle relative to the center of the carousel
       */
      const positionAngle = (relativeIndex - 1) * anglePerCard;

      const radius = 380;

      // Convert polar coordinates to Cartesian
      const x = radius * Math.sin((positionAngle * Math.PI) / 120);
      const y = radius * Math.cos((positionAngle * Math.PI) / 120) * -1;

      // Defines the rotation of each card depending of the position in the slider
      const rotationZ =
        relativeIndex === 1
          ? 0
          : relativeIndex === 0
          ? -55
          : relativeIndex === 2
          ? 55
          : 0;

      const opacity =
        relativeIndex === 1 ? 1 : relativeIndex === 0 || relativeIndex === 2 ? 0.4 : 0;

      // Animate card position, scale and opacity
      gsap.to(card, {
        x, // Horizontal position
        y, // Vertical position
        rotate: rotationZ,
        scale: relativeIndex === 1 ? 1.5 : 0.9, // Scale active slide
        zIndex: relativeIndex === 1 ? 1 : -1, // Bring active slide to front
        opacity: opacity, // Hide slides thar are to far
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  };

  /**
   * Effect hook that triggers wheel rotation when activeIndex changes
   */
  useEffect(() => {
    rotateWheel(activeIndex);
  }, [activeIndex]);

  /**
   * Handles mouse leave event on cards
   * Resets card rotation when mouse leaves
   * @param {number} index - Index of the card
   * @returns {void}
   */
  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  /**
   * Handles drag gesture for navigation
   * Changes active slide when drag threshold is reached
   * @param {number} clientX - Current pointer X position
   * @returns {void}
   */
  const handleCardDrag = (clientX: number) => {
    if (!isDragging || dragStartX === null) return;
    // Calculate drag distance
    const deltaX = clientX - dragStartX;

    // Navigate left if dragged right past threshold
    if (deltaX > 50) {
      setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
      setDragStartX(clientX);
    }
    // Navigate right is dragged left past threshold
    else if (deltaX < -50) {
      setActiveIndex((prev) => (prev + 1) % slides.length);
      setDragStartX(clientX);
    }
  };

  return (
    <section className='flex center hero-section'>
      <article className='flex-column center container'>
        <div className='flex center cards-container'>
          {slides.map((slide, index) => (
            <>
              <div
                className='flex-column slide-card'
                key={index}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setDragStartX(e.clientX);
                  setIsDragging(true);
                }}
                onMouseMove={(e) => {
                  handleCardDrag(e.clientX);
                }}
                onMouseUp={() => {
                  setIsDragging(false);
                  setDragStartX(null);
                }}
                onMouseLeave={() => {
                  handleMouseLeave(index);
                  setIsDragging(false);
                  setDragStartX(null);
                }}
                onTouchStart={(e) => {
                  setDragStartX(e.touches[0].clientX);
                  setIsDragging(true);
                }}
                onTouchMove={(e) => handleCardDrag(e.touches[0].clientX)}
                onTouchEnd={() => {
                  setIsDragging(false);
                  setDragStartX(null);
                }}
              >
                <img src={slide.img} alt='' />
                <h4>{slide.title}</h4>
              </div>
              <div key={index + 1} className='slide-text'>
                {slides[activeIndex].text}
              </div>
            </>
          ))}
          <div ref={wheelRef} className='flex center wheel'>
            <img src='./Llanta.png' alt='' />
          </div>
        </div>
      </article>
    </section>
  );
};

export default Slider;
