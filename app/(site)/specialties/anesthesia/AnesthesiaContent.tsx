'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import AgentSpotlightCard from '@/components/voice/AgentSpotlightCard'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import TeamCircleGrid from '@/components/ui/TeamCircleGrid'
import SpecialtyMarquee from '@/components/sections/SpecialtyMarquee'
import { ANESTHESIA_SOLUTIONS } from './_data/locations'

// "What Sets Us Apart" cards. Content per the Specialty Pages doc
// (v1, May 19 2026) — section 1 "Anesthesia (Accreda)". Doc spec is
// exactly 3 cards, replacing the previous 6 generic ones (Real+AI,
// Boutique Support, Privately Owned, etc.) that didn't speak to the
// specialty. Icons chosen to thematically reflect each card.
const advantages = [
  {
    // Anesthesia tools icon — "anesthesia is all we do"
    icon: <svg viewBox="0 0 1171.68 1152.62" className="apart-svg" aria-hidden="true">
        <path d="M895.54 600.33c152.51,0 276.14,123.63 276.14,276.15 0,152.51 -123.63,276.14 -276.14,276.14 -152.51,0 -276.15,-123.63 -276.15,-276.14 0,-152.51 123.63,-276.15 276.15,-276.15z"/>
        <path d="M895.54 600.33c43.22,0 84.11,9.94 120.53,27.63l0 497.02c-36.42,17.7 -77.31,27.63 -120.53,27.63 -41.48,0 -80.81,-9.16 -116.11,-25.54l0 -501.2c35.3,-16.38 74.63,-25.54 116.11,-25.54z"/>
        <path d="M895.54 600.33c152.51,0 276.14,123.63 276.14,276.15 0,152.51 -123.63,276.14 -276.14,276.14 -152.51,0 -276.15,-123.63 -276.15,-276.14 0,-152.51 123.63,-276.15 276.15,-276.15z"/>
        <path fill="#00B5D6" d="M895.54 0c152.51,0 276.15,123.63 276.15,276.14 0,152.51 -123.63,276.15 -276.15,276.15 -55.12,0 -106.47,-16.16 -149.57,-43.99l32.7 -34.59 -27.03 -27.03c-1.89,-1.89 -1.89,-4.98 0,-6.87l0 0c1.89,-1.89 4.98,-1.89 6.87,0l26.84 26.84 31.47 -33.29 -28.69 -28.69c-1.89,-1.89 -1.89,-4.98 0,-6.87l0 0c1.89,-1.89 4.98,-1.89 6.87,0l28.49 28.49 31.33 -33.14 -28.25 -28.25c-1.89,-1.89 -1.89,-4.98 0,-6.87l0 0c1.89,-1.89 4.98,-1.89 6.87,0l28.06 28.06 26.23 -27.75 -0 -0 0 0 22.84 -24.17c5.28,-5.55 5.06,-14.33 -0.5,-19.6l-6.13 -5.86 33.2 -49.25c4.49,-6.55 4.43,-14.97 0.36,-21.37l109.23 -115.54c1.37,-1.19 2.23,-2.94 2.23,-4.9 0,-3.59 -2.91,-6.49 -6.5,-6.49 -2.06,0 -3.9,0.96 -5.09,2.46l-109.1 115.4c-6.58,-4.16 -15.14,-4 -21.68,0.65l-48.63 35.15 -4.91 -4.7c-5.6,-5.31 -14.46,-5.09 -19.73,0.51l-0 -0 -22.87 24.21 0 0 -141.28 149.44c-31.35,-44.79 -49.75,-99.31 -49.75,-158.13 0,-152.51 123.64,-276.14 276.15,-276.14z"/>
        <path fill="#00B5D6" d="M276.15 600.33c152.51,0 276.15,123.63 276.15,276.15 0,152.51 -123.63,276.14 -276.15,276.14 -152.51,0 -276.15,-123.63 -276.15,-276.14 0,-152.51 123.64,-276.15 276.15,-276.15z"/>
        <path fill="#00B5D6" d="M895.54 600.33c152.51,0 276.14,123.63 276.14,276.15 0,152.51 -123.63,276.14 -276.14,276.14 -152.51,0 -276.15,-123.63 -276.15,-276.14 0,-152.51 123.63,-276.15 276.15,-276.15z"/>
        <path fill="none" d="M895.54 600.33c152.51,0 276.14,123.63 276.14,276.15 0,152.51 -123.63,276.14 -276.14,276.14 -152.51,0 -276.15,-123.63 -276.15,-276.14 0,-152.51 123.63,-276.15 276.15,-276.15z"/>
        <path fill="#FFFFFF" d="M331.59 786.75l0.01 0c30.24,0 54.97,24.73 54.97,54.97l0 101.71 -109.95 0 0 -101.71c0,-30.24 24.73,-54.97 54.97,-54.97zm54.98 173.17l0 101.7c0,30.24 -24.73,54.97 -54.97,54.97l-0.01 0c-30.24,0 -54.97,-24.73 -54.97,-54.97l0 -101.7 109.95 0z"/>
        <path fill="#FFFFFF" d="M274.84 663.17l0 0c26.19,15.12 35.24,48.91 20.12,75.09l-50.85 88.08 -95.22 -54.97 50.85 -88.08c15.12,-26.19 48.91,-35.24 75.09,-20.12l0 0zm-38.98 177.46l-50.85 88.08c-15.12,26.19 -48.91,35.24 -75.09,20.12l0 0c-26.19,-15.12 -35.24,-48.91 -20.12,-75.09l50.85 -88.08 95.22 54.97 -0 0z"/>
        <path fill="#00B5D6" d="M276.15 0c152.51,0 276.14,123.63 276.14,276.14 0,148.46 -117.16,269.54 -264.06,275.87l-0.69 -3.03 -0.86 -4.87 -0.62 -4.95 -0.38 -5.02 -0.13 -5.1 -0.01 -0.01 0.01 0 0 -152.24 -22.11 0 0 152.24 0.02 0 -0.01 0.01 0.15 6.22 0.46 6.14 0.76 6.06 0.81 4.6c-147.63,-5.53 -265.63,-126.94 -265.63,-275.93 0,-152.51 123.63,-276.14 276.15,-276.14z"/>
        <path fill="#FEFEFE" d="M127.61 382.4c-1.62,-4.51 -3.11,-9.06 -4.41,-13.59 -11.39,-39.53 -9.76,-81.31 2.56,-120.14 4.73,-14.99 11.03,-29.54 18.82,-43.34l61.14 -108.43c7.29,-12.89 17.69,-23.35 29.95,-30.56 12.26,-7.2 26.37,-11.18 41.07,-11.18l0.23 0c29.37,0 56.5,15.92 71.02,41.74l61.12 108.43c7.84,13.8 14.12,28.35 18.89,43.34 12.26,38.84 13.9,80.61 2.49,120.14 -0.57,2.12 -1.21,4.24 -1.92,6.36 -4.07,12.55 -9.41,25.01 -16.47,36.72 -22.9,38.2 -63.65,68.5 -135.25,68.94 -71.9,-0.44 -112.68,-30.97 -135.53,-69.37 -5.58,-9.32 -10.08,-19.11 -13.72,-29.05l0 -0zm114.74 -49.18c0,5.41 4.38,9.79 9.79,9.79l49.43 0c5.42,0 9.79,-4.37 9.79,-9.79l0 -72.15c0,-5.43 -4.36,-9.79 -9.79,-9.79l-49.43 0c-5.43,0 -9.79,4.36 -9.79,9.79l0 72.15zm-15.22 0c0,13.8 11.18,25.01 25.01,25.01l49.43 0c13.83,0 25.01,-11.2 25.01,-25.01l0 -72.15c0,-13.83 -11.18,-25.01 -25.01,-25.01l-49.43 0c-13.83,0 -25.01,11.18 -25.01,25.01l0 72.15z"/>
        <path fill="#00B5D6" d="M276.14 150.81c-1.97,0.01 -3.92,0.97 -5.03,2.84l-14.19 23.89 -0.02 0.04 -0.01 0.02 -0.06 0.1 -0 -0c-2.83,4.57 -8.94,6.13 -13.72,3.47 -4.82,-2.69 -6.46,-8.65 -3.67,-13.32l0.14 -0.23 14.02 -23.65c4.93,-8.31 13.71,-12.61 22.55,-12.62 8.84,0.01 17.62,4.31 22.55,12.62l14.02 23.65 0.14 0.23c2.79,4.67 1.15,10.64 -3.67,13.32 -4.78,2.66 -10.88,1.11 -13.72,-3.47l-0 0 -0.06 -0.1 -0.01 -0.02 -0.02 -0.04 -14.19 -23.89c-1.11,-1.87 -3.06,-2.83 -5.03,-2.84z"/>
      </svg>,
    t: 'Anesthesia Is All We Do',
    d: 'Our anesthesia team wakes up doing anesthesia and goes to bed doing anesthesia. They know every payer game, every modifier trap, and every reimbursement nuance specific to your specialty.',
  },
  {
    // Prevention icon — "prevent denials, not just recover"
    icon: <svg viewBox="0 0 675.68 961.68" className="apart-svg" aria-hidden="true">
        <path fill="#00B5D6" d="M56.25 156.98l0 0c31.07,0 56.25,25.18 56.25,56.25l0 216.18c0,3.99 3.24,7.23 7.23,7.23l0 0c4,0 7.24,-3.24 7.24,-7.23l0 -304.32c0,-31.07 25.18,-56.25 56.25,-56.25l0 0c31.06,0 56.25,25.18 56.25,56.25l0 304.31c0,3.99 3.24,7.23 7.23,7.23l0 0c4,0 7.23,-3.24 7.23,-7.23l0 -373.15c0,-31.07 25.19,-56.25 56.25,-56.25l0 -0c31.06,0 56.25,25.19 56.25,56.25l0 373.15c0,3.99 3.24,7.23 7.23,7.23l0 0c3.99,0 7.23,-3.24 7.23,-7.23l0 -317.71c0,-31.07 25.18,-56.25 56.25,-56.25l0 0c31.07,0 56.25,25.19 56.25,56.25l0 324.94 0 87.59 0 71.16 76.55 -141.1c14.81,-27.31 48.96,-37.44 76.27,-22.63l0 0c27.31,14.81 37.44,48.96 22.63,76.27l-127.04 294.38c-11.49,26.62 -26.42,51.68 -44.89,74.03 -62.58,75.73 -132.33,85.61 -243.22,85.34 -0.63,0 -1.26,0 -1.88,0l-10.75 0c-133.15,0 -241.09,-107.94 -241.09,-241.09l0 -94.83 0 -189.12 0 -223.41c0,-31.07 25.19,-56.25 56.25,-56.25zm214.74 345.94c-82.8,0 -149.93,67.13 -149.93,149.93 0,82.8 67.13,149.93 149.93,149.93 82.8,0 149.93,-67.13 149.93,-149.93 0,-82.8 -67.13,-149.93 -149.93,-149.93zm0 29.57c-66.47,0 -120.36,53.89 -120.36,120.36 0,66.47 53.89,120.36 120.36,120.36 66.47,0 120.36,-53.89 120.36,-120.36 0,-66.47 -53.89,-120.36 -120.36,-120.36zm-72.42 64.51l54.92 54.92 -54.92 54.92 18.57 18.57 54.92 -54.92 54.92 54.92 18.57 -18.57 -54.92 -54.92 54.92 -54.92 -18.56 -18.56 -54.92 54.92 -54.92 -54.92 -18.56 18.56z"/>
      </svg>,
    t: 'We Don\u2019t Just Recover Denials. We Prevent Them',
    d: 'Every denied claim gets a root cause review. We find out why it happened, fix the process, and make sure that denial category shrinks quarter over quarter.',
  },
  {
    // 23 years laurel icon — "23+ years"
    icon: <svg viewBox="0 0 1426.81 1466.65" className="apart-svg" aria-hidden="true">
        <path fill="#00B5D6" d="M58.61 216.29l35.23 -23.16 -0 0 35.03 -23.03 40.15 -26.39 -0 0 78.22 -51.41 26.46 -17.39 -0 0 66.31 -43.58 0 -0 47.66 -31.33c-29.87,44.31 -105.45,158.29 -146.88,237.86 -26.62,51.14 -129.39,265.71 -127.18,441.75 1.39,111.24 13.09,226.08 52.65,318.86 4.88,6.04 9.91,11.88 15.09,17.53 77.89,56.09 154.15,49.09 189.89,56.2 44.68,8.89 89.94,15.12 133.85,29.78 21.39,7.13 42.01,16.87 61.69,30.3 29.84,20.37 56.35,48.44 83.41,74.76 22.16,21.56 43.44,45.55 63.21,70 19.78,-24.45 41.05,-48.45 63.21,-70 27.06,-26.32 53.57,-54.39 83.41,-74.76 19.68,-13.43 40.3,-23.17 61.69,-30.3 43.91,-14.66 89.17,-20.9 133.85,-29.78 35.74,-7.11 112,-0.12 189.89,-56.2 5.18,-5.64 10.21,-11.49 15.09,-17.53 39.55,-92.78 51.25,-207.62 52.65,-318.86 2.21,-176.03 -100.56,-390.6 -127.18,-441.75 -41.43,-79.57 -117,-193.56 -146.88,-237.86l47.66 31.33 0 0 66.31 43.58 -0 -0 26.46 17.39 78.22 51.41 -0 -0 40.15 26.39 35.03 23.03 -0 -0 35.23 23.16c13.96,41.03 26.18,82.87 34.09,121.17 21.36,103.42 31.21,192.7 19.58,298.9 -9.17,83.71 -24.73,150.25 -44.48,204.28l-0.01 0.07 -0.05 0.11c-11.07,30.25 -23.45,56.57 -36.76,79.78l-0.03 0.07 -0.02 0.02c-22.71,39.56 -48.12,70.07 -74.33,95.55 -3.19,5.92 -6.5,11.9 -9.84,17.78 -15.6,33 -34.25,63.41 -56.36,90.07 -34.31,41.37 -75.7,69.94 -119.39,88.68 -43.02,18.46 -87.75,28.26 -132.36,36.83 -41.28,7.92 -83.01,14.24 -123.49,28.1 -27.32,9.36 -53.67,23.78 -78.66,41.78 30.42,41.45 55.46,80.89 72.11,108.49 8.31,12.35 16.35,25.25 23.71,38.68l-0.89 0 -0.41 0 -4.73 0 -17.84 0 -0.73 0 -1.46 0 -0.1 0c-17.38,-27.64 -36.86,-53.06 -57.33,-76.03 -14.25,-16 -29.29,-31.14 -44.99,-44.99 -15.71,13.85 -30.74,28.99 -44.99,44.99 -20.46,22.97 -39.94,48.39 -57.33,76.03l-0.1 0 -1.46 0 -0.73 0 -17.84 0 -4.73 0 -0.41 0 -0.89 0c7.36,-13.43 15.39,-26.32 23.71,-38.68 16.65,-27.6 41.69,-67.04 72.11,-108.49 -24.99,-18 -51.34,-32.42 -78.66,-41.78 -40.48,-13.87 -82.21,-20.18 -123.49,-28.1 -44.61,-8.57 -89.33,-18.37 -132.36,-36.83 -43.7,-18.74 -85.08,-47.31 -119.39,-88.68 -22.12,-26.66 -40.76,-57.07 -56.36,-90.07 -3.35,-5.87 -6.65,-11.85 -9.84,-17.78 -26.21,-25.48 -51.62,-55.99 -74.33,-95.55l-0.02 -0.02 -0.03 -0.07c-13.31,-23.21 -25.69,-49.53 -36.76,-79.78l-0.05 -0.11 -0.01 -0.07c-19.75,-54.03 -35.31,-120.58 -44.48,-204.28 -11.63,-106.2 -1.78,-195.48 19.58,-298.9 7.91,-38.3 20.13,-80.14 34.09,-121.17zm256.94 566.15c0,8.25 6.6,15.67 15.67,15.67l329.83 0c8.25,0 15.67,-7.42 15.67,-15.67l0 -74.21c0,-8.25 -7.42,-15.67 -15.67,-15.67l-145.12 0c38.76,-54.42 106.37,-142.65 132.76,-189.65 19.79,-38.76 32.16,-63.49 32.16,-107.19 0,-91.53 -69.26,-166.56 -187.18,-166.56 -98.12,0 -164.91,80.81 -164.91,80.81 -5.77,6.6 -4.95,16.49 0.83,21.44l50.3 51.12c6.6,6.6 16.49,6.6 23.09,0 15.67,-17.32 46.18,-41.23 79.98,-41.23 46.18,0 72.56,28.04 72.56,59.37 0,23.09 -10.72,46.18 -21.44,62.67 -48.65,74.21 -170.69,239.95 -218.51,302.62l0 16.49zm429.6 -49.47c17.32,22.26 70.09,73.39 173.98,73.39 113.79,0 192.12,-67.61 192.12,-157.49 0,-70.91 -61.02,-122.04 -99.77,-138.53l0 -2.47c37.1,-17.32 84.93,-64.32 84.93,-127.81 0,-92.35 -82.46,-150.9 -178.11,-150.9 -89.88,0 -157.49,72.56 -157.49,72.56 -5.77,5.77 -6.6,15.67 0,21.44l50.3 49.47c6.6,5.77 16.49,5.77 22.26,-0.82 12.37,-14.02 35.46,-32.98 71.74,-32.98 35.46,0 65.97,26.39 65.97,61.84 0,35.46 -30.51,63.49 -88.23,63.49l-46.18 0c-8.25,0 -15.67,6.6 -15.67,15.67l0 68.44c0,8.25 7.42,15.67 15.67,15.67l46.18 0c61.02,0 98.12,30.51 98.12,66.79 0,36.28 -36.28,65.97 -71.74,65.97 -39.58,0 -90.7,-37.93 -90.7,-37.93 -6.6,-4.95 -14.84,-4.12 -20.61,1.65l-51.95 51.95c-4.95,5.77 -5.77,14.84 -0.82,20.61zm-378.67 137.43l15.21 0 38.49 93 -19.17 0 -7.95 -20.2 -37.99 0 -7.95 20.2 -19.13 0 38.49 -93zm21.65 57.59l-13.81 -35.84 -0.52 0 -13.83 35.84 28.15 0zm40.25 -57.59l13.18 0 39.37 50.53 7.26 10.17 0.58 0 -0.45 -21.02 0 -39.67 18.05 0 0 93 -13.18 0 -39.13 -51.24 -7.43 -10.23 -0.52 0 0.32 21.47 0 40 -18.05 0 0 -93zm96.3 0l53.44 0 0 16.22 -35.39 0 0 21.75 29.46 0 0 15.79 -29.46 0 0 23.02 35.39 0 0 16.22 -53.44 0 0 -93zm98.36 94.01c-5.21,0 -10.14,-1.01 -14.8,-3.04 -4.65,-2.02 -8.62,-4.72 -11.89,-8.14 -3.3,-3.4 -5.58,-7.11 -6.89,-11.09l17.1 -7.19c0.75,2.17 1.9,4.26 3.4,6.25 1.53,1.98 3.38,3.6 5.56,4.85 2.2,1.27 4.59,1.9 7.19,1.9 2.33,0 4.48,-0.5 6.46,-1.49 2,-0.99 3.6,-2.33 4.8,-4.03 1.21,-1.7 1.81,-3.6 1.81,-5.64 0,-2.59 -0.88,-4.76 -2.63,-6.55 -1.74,-1.79 -3.77,-3.21 -6.1,-4.29 -2.3,-1.08 -5.13,-2.15 -8.44,-3.25l-1.96 -0.69c-7.28,-2.48 -13.07,-5.84 -17.38,-10.1 -4.31,-4.24 -6.46,-9.89 -6.46,-16.91 0,-5.13 1.21,-9.63 3.62,-13.5 2.41,-3.86 5.79,-6.85 10.12,-8.96 4.33,-2.09 9.3,-3.15 14.9,-3.15 7.34,0 13.57,1.72 18.67,5.19 5.08,3.49 8.79,7.93 11.09,13.35l-16.58 6.7c-0.54,-1.27 -1.42,-2.59 -2.59,-3.94 -1.18,-1.38 -2.67,-2.56 -4.48,-3.57 -1.81,-1.01 -3.81,-1.51 -6.01,-1.51 -1.83,0 -3.6,0.34 -5.26,1.06 -1.66,0.73 -3.02,1.79 -4.07,3.23 -1.06,1.42 -1.57,3.14 -1.57,5.17 0,2.78 0.99,5.11 2.95,7 1.98,1.9 4.11,3.32 6.37,4.27 2.28,0.95 5.17,1.98 8.72,3.12 16.61,5.34 24.92,14.37 24.92,27.07 0,5.17 -1.34,9.89 -4.01,14.13 -2.67,4.24 -6.35,7.6 -11.03,10.06 -4.65,2.48 -9.84,3.7 -15.57,3.7zm60.2 -77.8l-23.22 0 0 -16.22 64.42 0 0 16.22 -23.15 0 0 76.78 -18.05 0 0 -76.78zm52.75 -16.22l18.05 0 0 37.73 40.25 0 0 -37.73 18.05 0 0 93 -18.05 0 0 -39.07 -40.25 0 0 39.07 -18.05 0 0 -93zm94.66 0l53.44 0 0 16.22 -35.39 0 0 21.75 29.46 0 0 15.79 -29.46 0 0 23.02 35.39 0 0 16.22 -53.44 0 0 -93zm98.36 94.01c-5.21,0 -10.14,-1.01 -14.8,-3.04 -4.65,-2.02 -8.62,-4.72 -11.89,-8.14 -3.3,-3.4 -5.58,-7.11 -6.89,-11.09l17.1 -7.19c0.75,2.17 1.9,4.26 3.4,6.25 1.53,1.98 3.38,3.6 5.56,4.85 2.2,1.27 4.59,1.9 7.19,1.9 2.33,0 4.48,-0.5 6.46,-1.49 2,-0.99 3.6,-2.33 4.8,-4.03 1.21,-1.7 1.81,-3.6 1.81,-5.64 0,-2.59 -0.88,-4.76 -2.63,-6.55 -1.74,-1.79 -3.77,-3.21 -6.1,-4.29 -2.3,-1.08 -5.13,-2.15 -8.44,-3.25l-1.96 -0.69c-7.28,-2.48 -13.07,-5.84 -17.38,-10.1 -4.31,-4.24 -6.46,-9.89 -6.46,-16.91 0,-5.13 1.21,-9.63 3.62,-13.5 2.41,-3.86 5.79,-6.85 10.12,-8.96 4.33,-2.09 9.3,-3.15 14.9,-3.15 7.34,0 13.57,1.72 18.67,5.19 5.08,3.49 8.79,7.93 11.09,13.35l-16.58 6.7c-0.54,-1.27 -1.42,-2.59 -2.59,-3.94 -1.18,-1.38 -2.67,-2.56 -4.48,-3.57 -1.81,-1.01 -3.81,-1.51 -6.01,-1.51 -1.83,0 -3.6,0.34 -5.26,1.06 -1.66,0.73 -3.02,1.79 -4.07,3.23 -1.06,1.42 -1.57,3.14 -1.57,5.17 0,2.78 0.99,5.11 2.95,7 1.98,1.9 4.11,3.32 6.37,4.27 2.28,0.95 5.17,1.98 8.72,3.12 16.61,5.34 24.92,14.37 24.92,27.07 0,5.17 -1.34,9.89 -4.01,14.13 -2.67,4.24 -6.35,7.6 -11.03,10.06 -4.65,2.48 -9.84,3.7 -15.57,3.7zm47 -94.01l18.11 0 0 93 -18.11 0 0 -93zm66.12 0l15.21 0 38.49 93 -19.17 0 -7.95 -20.2 -37.99 0 -7.95 20.2 -19.13 0 38.49 -93zm21.65 57.59l-13.81 -35.84 -0.52 0 -13.83 35.84 28.15 0z"/>
      </svg>,
    t: '23+ Years in Anesthesia RCM',
    d: 'This isn\u2019t a new vertical we added to a menu. Accreda was built for anesthesia from day one. 250+ years of combined team experience across every anesthesia subspecialty.',
  },
]

const leaders = [
  { name: 'Logan Lowry', role: 'President', photo: '/images/LOGAN LOWRY.jpg' },
  { name: 'Mark Wines', role: 'Chief Growth Officer', photo: '/images/MARK WINES.jpg' },
  { name: 'JR Thompson', role: 'Sr. VP Chief Operating Officer', photo: '/images/JR THOMPSON.jpg' },
  { name: 'Joseph Demory', role: 'Director Anesthesia Services', photo: '/images/JOSEPH DEMORY.jpg' },
  { name: 'Laurie Allen', role: 'VP Anesthesia Operations', photo: '/images/Laurie Allen.jpg' },
  { name: 'Melissa George', role: 'Sr. RCM Manager', photo: '/images/Melissa George.jpg' },
  { name: 'Evan Sewell', role: 'Director RCM', photo: '/images/Evan Sewell.jpg' },
  { name: 'Liz Hussey', role: 'Credentialing Manager', photo: '/images/Liz Hussey.jpg' },
  { name: 'Maisie Villegas', role: 'Director Quality Improvement', photo: '/images/Maicie.jpg' },
  { name: 'Thomas Wilson', role: 'Regional Director- Anesthesia Services', photo: '/images/Tom Wilson1.jpg' },
]

// Testimonials per Specialty Pages doc (v1, May 19 2026).
const testimonials = [
  {
    tag: 'Anesthesia',
    quote: 'What separates Accreda from other anesthesia billing companies is its dedication to collecting every dollar possible for its clients, along with providing an excellent team of people who are loyal and helpful.',
    name: 'Dr. John B. Field Jr.',
    role: 'Vice President, Anesthesia Associates',
  },
  {
    tag: 'Anesthesia',
    quote: 'Year-over-year collection rate of 97% from commercial payers and 98% overall. I can wholeheartedly recommend Accreda.',
    name: 'Randy Robbins, M.D.',
    role: 'Anesthesia Group Practice Administrator',
  },
]

// The "Complete Anesthesia Revenue Cycle" cards (ANESTHESIA_SOLUTIONS)
// live in ./_data/locations.ts so this page and the per-city anesthesia
// pages render the same section from one source.

export default function AnesthesiaContent() {
  return (
    <>
      {/* The Problem, Split impact section.
          Headline + 4 bullets per the Specialty Pages doc
          (v1, May 19 2026). Both panels use justifyContent:
          flex-start so the two headlines sit at the same vertical
          position. Bullets at 18px (preview feedback: 15px was too
          small). */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 28 }}>
                Base Units, Time Units, Modifiers. One Wrong Move and Revenue Disappears.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Base units, time-unit accuracy, medical direction modifiers, and concurrency rules trip up generic billing teams every day',
                  'Payers have their own anesthesia-specific reimbursement rules. What works for one doesn\u2019t work for another',
                  'Authorization lapses on high-cost cases lead to write-offs that could have been prevented',
                  'Without anesthesia-trained coders, undercoding and missed charges become the norm',
                ].map((bullet, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 18, lineHeight: 1.6, color: 'var(--gray-700)', marginBottom: 18 }}>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: '#00B5D6', marginTop: 10 }} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>

          <div className="ps-panel ps-solution" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: '#00B5D6', position: 'relative', overflow: 'hidden' }}>
            <div className="ps-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            <RevealOnScroll direction="right" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'white', marginTop: 0, marginBottom: 28 }}>
                Anesthesia Experts + Ai Working Together
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Dedicated anesthesia billing team that understands units, modifiers, concurrency, and the rules each payer follows, because that\u2019s all they do',
                  'Ai handles eligibility verification, authorization tracking, and claim follow-up across your full volume',
                  'Every denied claim gets a root cause review to prevent the same issue from recurring',
                  'Live dashboards showing collections by provider, case type, payer, and facility',
                ].map((bullet, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.95)', marginBottom: 18 }}>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: 'white', marginTop: 10 }} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
        </div>
      </section>


      {/* RCM Solutions: Complete Anesthesia Revenue Cycle.
          Grid + animation logic lives in SpecialtyMarquee
          component (shared across all 6 specialty pages). */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll><div className="section-title">Complete Anesthesia Revenue Cycle</div></RevealOnScroll>
        </div>

        {/* Grid layout: 3 col desktop, 2 col mobile. Cards wrap their
            own .container internally so they align with the title. */}
        <SpecialtyMarquee items={ANESTHESIA_SOLUTIONS} layout="grid" mobileCarousel />
      </section>


      {/* Client Reviews — shared TestimonialsSection */}
      <TestimonialsSection
        testimonials={testimonials}
        label="CLIENT REVIEWS"
        title={<>What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Clients</span> Say.</>}
      />


      {/* What Sets Accreda Apart — 3 specialty-specific cards per
          Specialty Pages doc (v1, May 19 2026). */}
      <section className="section">
        <div className="container">
        <RevealOnScroll><div className="section-title">What Sets Accreda Apart</div></RevealOnScroll>

          <div className="advantage-grid advantages-desktop" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 48 }}>
            {advantages.map((a, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.15 + i * 0.1}>
                <div className="advantage-card">
                  <div className="advantage-icon">{a.icon}</div>
                  <h4>{a.t}</h4>
                  <p>{a.d}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="advantages-mobile" style={{ marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4000} showArrows>
              {advantages.map((a, i) => (
                <div key={i} className="advantage-card">
                  <div className="advantage-icon">{a.icon}</div>
                  <h4>{a.t}</h4>
                  <p>{a.d}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>


      {/* Pre-Service Collection, Priya */}
      <section className="section">
        <div className="container">
          <div className="specialty-spotlight-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <RevealOnScroll direction="left">
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 20 }}>
                  Pre-Service Payment Collection
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 32 }}>
                  Priya contacts patients before procedures with verified cost estimates, lifting pre-service collections 30–40% vs post-service. She handles the volume so your team focuses on clinical care.
                </p>
                <div style={{ display: 'flex', gap: 32 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em' }}>30–40%</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Higher Collection Rate</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em' }}>3–7 Days</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Before Procedure</div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AgentSpotlightCard
                  agentName="Priya"
                  imgAlt="Priya, Pre-Service Payment Collection"
                  roleLabel="Pre-Service Cost Estimates"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>


      {/* Leadership, 250+ years */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Leadership Combined Experience</div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, marginTop: 16, marginBottom: 48 }}>
              {/* Matches homepage .ra-stat-num per user (Jun 2026):
                  clamp(44-68), 700, -0.02em, font-display. Was
                  clamp(48-72) / 200 / no display font. Same fix as the
                  150+ stat on behavioral-health. */}
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 5.5vw, 68px)', fontWeight: 700, color: 'var(--primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>250+</span>
              <span style={{ fontSize: 18, color: 'var(--gray-600)', fontWeight: 300 }}>years exclusively in anesthesia RCM</span>
            </div>
          </RevealOnScroll>

          <TeamCircleGrid
            people={leaders.map(l => ({ name: l.name, title: l.role, photo: l.photo }))}
            baseDelay={0.1}
          />
        </div>
      </section>
    </>
  )
}
