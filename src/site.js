// dlphn.app shared behaviour for the weekly pages and the gallery.
// Icons are Phosphor (regular weight), https://phosphoricons.com, MIT.

export const ICONS = {
  caretDown: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>',
  list: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>',
  images: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z"/></svg>',
  arrowUpRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"/></svg>',
  arrowLeft: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>',
  backpack: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M168,40.58V32A24,24,0,0,0,144,8H112A24,24,0,0,0,88,32v8.58A56.09,56.09,0,0,0,40,96V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V96A56.09,56.09,0,0,0,168,40.58ZM112,24h32a8,8,0,0,1,8,8v8H104V32A8,8,0,0,1,112,24Zm56,136H88v-8a8,8,0,0,1,8-8h64a8,8,0,0,1,8,8ZM88,176h48v8a8,8,0,0,0,16,0v-8h16v40H88Zm112,40H184V152a24,24,0,0,0-24-24H96a24,24,0,0,0-24,24v64H56V96A40,40,0,0,1,96,56h64a40,40,0,0,1,40,40V216ZM152,88a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,88Z"/></svg>',
  baseball: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM72.09,195.91c.82-1,1.64-1.93,2.42-2.91A8,8,0,1,0,62,183l-1.34,1.62a87.82,87.82,0,0,1,0-113.24L62,73A8,8,0,1,0,74.51,63c-.78-1-1.6-2-2.42-2.91a87.84,87.84,0,0,1,111.82,0c-.82,1-1.64,1.92-2.42,2.91A8,8,0,1,0,194,73l1.34-1.62a87.82,87.82,0,0,1,0,113.24L194,183a8,8,0,1,0-12.48,10c.78,1,1.6,1.95,2.42,2.91a87.84,87.84,0,0,1-111.82,0Zm23.8-50.59a104.5,104.5,0,0,1-4.48,17.35,8,8,0,0,1-15.09-5.34,87.1,87.1,0,0,0,3.79-14.65,8,8,0,1,1,15.78,2.64Zm0-34.64a8,8,0,0,1-6.57,9.21A8.52,8.52,0,0,1,88,120a8,8,0,0,1-7.88-6.68,87.1,87.1,0,0,0-3.79-14.65,8,8,0,0,1,15.09-5.34A104.5,104.5,0,0,1,95.89,110.68Zm78.91,56.86a8,8,0,0,1-10.21-4.87,104.5,104.5,0,0,1-4.48-17.35,8,8,0,1,1,15.78-2.64,87.1,87.1,0,0,0,3.79,14.65A8,8,0,0,1,174.8,167.54Zm-14.69-56.86a104.5,104.5,0,0,1,4.48-17.35,8,8,0,0,1,15.09,5.34,87.1,87.1,0,0,0-3.79,14.65A8,8,0,0,1,168,120a8.52,8.52,0,0,1-1.33-.11A8,8,0,0,1,160.11,110.68Z"/></svg>',
  bus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M184,32H72A32,32,0,0,0,40,64V208a16,16,0,0,0,16,16H80a16,16,0,0,0,16-16V192h64v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V64A32,32,0,0,0,184,32ZM56,176V120H200v56Zm0-96H200v24H56ZM72,48H184a16,16,0,0,1,16,16H56A16,16,0,0,1,72,48Zm8,160H56V192H80Zm96,0V192h24v16Zm-72-60a12,12,0,1,1-12-12A12,12,0,0,1,104,148Zm72,0a12,12,0,1,1-12-12A12,12,0,0,1,176,148Zm72-68v24a8,8,0,0,1-16,0V80a8,8,0,0,1,16,0ZM24,80v24a8,8,0,0,1-16,0V80a8,8,0,0,1,16,0Z"/></svg>',
  cake: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M232,112a24,24,0,0,0-24-24H136V79a32.06,32.06,0,0,0,24-31c0-28-26.44-45.91-27.56-46.66a8,8,0,0,0-8.88,0C122.44,2.09,96,20,96,48a32.06,32.06,0,0,0,24,31v9H48a24,24,0,0,0-24,24v23.33a40.84,40.84,0,0,0,8,24.24V200a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V159.57a40.84,40.84,0,0,0,8-24.24ZM112,48c0-13.57,10-24.46,16-29.79,6,5.33,16,16.22,16,29.79a16,16,0,0,1-32,0ZM40,112a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8v23.33c0,13.25-10.46,24.31-23.32,24.66A24,24,0,0,1,168,136a8,8,0,0,0-16,0,24,24,0,0,1-48,0,8,8,0,0,0-16,0,24,24,0,0,1-24.68,24C50.46,159.64,40,148.58,40,135.33Zm160,96H56a8,8,0,0,1-8-8V172.56A38.77,38.77,0,0,0,62.88,176a39.69,39.69,0,0,0,29-11.31A40.36,40.36,0,0,0,96,160a40,40,0,0,0,64,0,40.36,40.36,0,0,0,4.13,4.67A39.67,39.67,0,0,0,192,176c.38,0,.76,0,1.14,0A38.77,38.77,0,0,0,208,172.56V200A8,8,0,0,1,200,208Z"/></svg>',
  calendarCheck: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-38.34-85.66a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,164.69l42.34-42.35A8,8,0,0,1,169.66,122.34Z"/></svg>',
  clock: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"/></svg>',
  cloud: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M160,40A88.09,88.09,0,0,0,81.29,88.67,64,64,0,1,0,72,216h88a88,88,0,0,0,0-176Zm0,160H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.11A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,72,72Z"/></svg>',
  cloudFog: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M120,208H72a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm64-16H160a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Zm-24,32H104a8,8,0,0,0,0,16h56a8,8,0,0,0,0-16Zm72-124a76.08,76.08,0,0,1-76,76H76A52,52,0,0,1,76,72a53.26,53.26,0,0,1,8.92.76A76.08,76.08,0,0,1,232,100Zm-16,0A60.06,60.06,0,0,0,96,96.46a8,8,0,0,1-16-.92q.21-3.66.77-7.23A38.11,38.11,0,0,0,76,88a36,36,0,0,0,0,72h80A60.07,60.07,0,0,0,216,100Z"/></svg>',
  cloudLightning: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M156,16A76.2,76.2,0,0,0,84.92,64.76,53.26,53.26,0,0,0,76,64a52,52,0,0,0,0,104h37.87L97.14,195.88A8,8,0,0,0,104,208h25.87l-16.73,27.88a8,8,0,0,0,13.72,8.24l24-40A8,8,0,0,0,144,192H118.13l14.4-24H156a76,76,0,0,0,0-152Zm0,136H76a36,36,0,0,1,0-72,38.11,38.11,0,0,1,4.78.31q-.56,3.57-.77,7.23a8,8,0,0,0,16,.92A60.06,60.06,0,1,1,156,152Z"/></svg>',
  cloudRain: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M158.66,196.44l-32,48a8,8,0,1,1-13.32-8.88l32-48a8,8,0,0,1,13.32,8.88ZM232,92a76.08,76.08,0,0,1-76,76H132.28l-29.62,44.44a8,8,0,1,1-13.32-8.88L113.05,168H76A52,52,0,0,1,76,64a53.26,53.26,0,0,1,8.92.76A76.08,76.08,0,0,1,232,92Zm-16,0A60.06,60.06,0,0,0,96,88.46a8,8,0,0,1-16-.92q.21-3.66.77-7.23A38.11,38.11,0,0,0,76,80a36,36,0,0,0,0,72h80A60.07,60.07,0,0,0,216,92Z"/></svg>',
  cloudSnow: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M88,196a12,12,0,1,1-12-12A12,12,0,0,1,88,196Zm28,4a12,12,0,1,0,12,12A12,12,0,0,0,116,200Zm48-16a12,12,0,1,0,12,12A12,12,0,0,0,164,184ZM68,224a12,12,0,1,0,12,12A12,12,0,0,0,68,224Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,156,224ZM232,92a76.08,76.08,0,0,1-76,76H76A52,52,0,0,1,76,64a53.26,53.26,0,0,1,8.92.76A76.08,76.08,0,0,1,232,92Zm-16,0A60.06,60.06,0,0,0,96,88.46a8,8,0,0,1-16-.92q.21-3.66.77-7.23A38.11,38.11,0,0,0,76,80a36,36,0,0,0,0,72h80A60.07,60.07,0,0,0,216,92Z"/></svg>',
  cloudSun: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M164,72a76.2,76.2,0,0,0-20.26,2.73,55.63,55.63,0,0,0-9.41-11.54l9.51-13.57a8,8,0,1,0-13.11-9.18L121.22,54A55.9,55.9,0,0,0,96,48c-.58,0-1.16,0-1.74,0L91.37,31.71a8,8,0,1,0-15.75,2.77L78.5,50.82A56.1,56.1,0,0,0,55.23,65.67L41.61,56.14a8,8,0,1,0-9.17,13.11L46,78.77A55.55,55.55,0,0,0,40,104c0,.57,0,1.15,0,1.72L23.71,108.6a8,8,0,0,0,1.38,15.88,8.24,8.24,0,0,0,1.39-.12l16.32-2.88a55.74,55.74,0,0,0,5.86,12.42A52,52,0,0,0,84,224h80a76,76,0,0,0,0-152ZM56,104a40,40,0,0,1,72.54-23.24,76.26,76.26,0,0,0-35.62,40,52.14,52.14,0,0,0-31,4.17A40,40,0,0,1,56,104ZM164,208H84a36,36,0,1,1,4.78-71.69c-.37,2.37-.63,4.79-.77,7.23a8,8,0,0,0,16,.92,58.91,58.91,0,0,1,1.88-11.81c0-.16.09-.32.12-.48A60.06,60.06,0,1,1,164,208Z"/></svg>',
  confetti: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M111.49,52.63a15.8,15.8,0,0,0-26,5.77L33,202.78A15.83,15.83,0,0,0,47.76,224a16,16,0,0,0,5.46-1l144.37-52.5a15.8,15.8,0,0,0,5.78-26Zm-8.33,135.21-35-35,13.16-36.21,58.05,58.05Zm-55,20,14-38.41,24.45,24.45ZM156,168.64,87.36,100l13-35.87,91.43,91.43ZM160,72a37.8,37.8,0,0,1,3.84-15.58C169.14,45.83,179.14,40,192,40c6.7,0,11-2.29,13.65-7.21A22,22,0,0,0,208,23.94,8,8,0,0,1,224,24c0,12.86-8.52,32-32,32-6.7,0-11,2.29-13.65,7.21A22,22,0,0,0,176,72.06,8,8,0,0,1,160,72ZM136,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm101.66,82.34a8,8,0,1,1-11.32,11.31l-16-16a8,8,0,0,1,11.32-11.32Zm4.87-42.75-24,8a8,8,0,0,1-5.06-15.18l24-8a8,8,0,0,1,5.06,15.18Z"/></svg>',
  discoBall: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M120,64.37V16a8,8,0,0,0-16,0V64.37a88,88,0,1,0,16,0ZM183.54,144H151.77c-1.51-28.36-10.79-48.36-19.44-61.06A72.16,72.16,0,0,1,183.54,144Zm-95.3,16h47.52c-2,33.52-16.13,52.95-23.76,61.08C104.36,212.93,90.23,193.51,88.24,160Zm0-16c2-33.52,16.13-52.95,23.76-61.08,7.64,8.15,21.77,27.57,23.76,61.08Zm3.43-61.06C83,95.64,73.74,115.64,72.23,144H40.46A72.16,72.16,0,0,1,91.67,82.94ZM40.46,160H72.23c1.51,28.36,10.79,48.36,19.44,61.06A72.16,72.16,0,0,1,40.46,160Zm91.87,61.06c8.65-12.7,17.93-32.7,19.44-61.06h31.77A72.16,72.16,0,0,1,132.33,221.06ZM256,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,256,88ZM152,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H192V64a8,8,0,0,1-16,0V48H160A8,8,0,0,1,152,40Z"/></svg>',
  filmSlate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M216,104H102.09L210,75.51a8,8,0,0,0,5.68-9.84l-8.16-30a15.93,15.93,0,0,0-19.42-11.13L35.81,64.74a15.75,15.75,0,0,0-9.7,7.4,15.51,15.51,0,0,0-1.55,12L32,111.56c0,.14,0,.29,0,.44v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V112A8,8,0,0,0,216,104ZM192.16,40l6,22.07-22.62,6L147.42,51.83Zm-66.69,17.6,28.12,16.24-36.94,9.75L88.53,67.37Zm-79.4,44.62-6-22.08,26.5-7L94.69,89.4ZM208,200H48V120H208v80Z"/></svg>',
  flag: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50ZM216,172.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z"/></svg>',
  forkKnife: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M72,88V40a8,8,0,0,1,16,0V88a8,8,0,0,1-16,0ZM216,40V224a8,8,0,0,1-16,0V176H152a8,8,0,0,1-8-8,268.75,268.75,0,0,1,7.22-56.88c9.78-40.49,28.32-67.63,53.63-78.47A8,8,0,0,1,216,40ZM200,53.9c-32.17,24.57-38.47,84.42-39.7,106.1H200ZM119.89,38.69a8,8,0,1,0-15.78,2.63L112,88.63a32,32,0,0,1-64,0l7.88-47.31a8,8,0,1,0-15.78-2.63l-8,48A8.17,8.17,0,0,0,32,88a48.07,48.07,0,0,0,40,47.32V224a8,8,0,0,0,16,0V135.32A48.07,48.07,0,0,0,128,88a8.17,8.17,0,0,0-.11-1.31Z"/></svg>',
  moonStars: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M240,96a8,8,0,0,1-8,8H216v16a8,8,0,0,1-16,0V104H184a8,8,0,0,1,0-16h16V72a8,8,0,0,1,16,0V88h16A8,8,0,0,1,240,96ZM144,56h8v8a8,8,0,0,0,16,0V56h8a8,8,0,0,0,0-16h-8V32a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16Zm72.77,97a8,8,0,0,1,1.43,8A96,96,0,1,1,95.07,37.8a8,8,0,0,1,10.6,9.06A88.07,88.07,0,0,0,209.14,150.33,8,8,0,0,1,216.77,153Zm-19.39,14.88c-1.79.09-3.59.14-5.38.14A104.11,104.11,0,0,1,88,64c0-1.79,0-3.59.14-5.38A80,80,0,1,0,197.38,167.86Z"/></svg>',
  musicNotes: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M212.92,17.69a8,8,0,0,0-6.86-1.45l-128,32A8,8,0,0,0,72,56V166.08A36,36,0,1,0,88,196V110.25l112-28v51.83A36,36,0,1,0,216,164V24A8,8,0,0,0,212.92,17.69ZM52,216a20,20,0,1,1,20-20A20,20,0,0,1,52,216ZM88,93.75V62.25l112-28v31.5ZM180,184a20,20,0,1,1,20-20A20,20,0,0,1,180,184Z"/></svg>',
  personSimpleSwim: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M176,104a32,32,0,1,0-32-32A32,32,0,0,0,176,104Zm0-48a16,16,0,1,1-16,16A16,16,0,0,1,176,56Zm46.16,129.24a8,8,0,0,1-1,11.26c-17.36,14.39-32.86,19.5-47,19.5-18.58,0-34.82-8.82-49.93-17-25.35-13.76-47.24-25.65-79.07.74a8,8,0,1,1-10.22-12.31c40.17-33.29,70.32-16.93,96.93-2.49,25.35,13.77,47.24,25.65,79.07-.74A8,8,0,0,1,222.16,185.24ZM34.89,147.42a8,8,0,1,0,10.22,12.31c31.83-26.38,53.72-14.5,79.07-.74,15.11,8.2,31.35,17,49.93,17,14.14,0,29.64-5.11,47-19.5a8,8,0,1,0-10.22-12.31,75.79,75.79,0,0,1-19.28,12.06l-53.84-53.82A103.34,103.34,0,0,0,64.24,72H40a8,8,0,0,0,0,16H64.24a87.66,87.66,0,0,1,41.88,10.56L76.49,128.17C63.82,129.35,50.07,134.84,34.89,147.42Zm91.57-33.67,46.13,46.12c-14-.43-26.88-7.39-40.77-14.93-10.75-5.84-22.09-12-34.42-15.05l22.26-22.26A87.14,87.14,0,0,1,126.46,113.75Z"/></svg>',
  sneakerMove: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M231.16,166.63l-28.63-14.31A47.74,47.74,0,0,1,176,109.39V80a8,8,0,0,0-8-8,48.05,48.05,0,0,1-48-48,8,8,0,0,0-12.83-6.37L30.13,76l-.2.16a16,16,0,0,0-1.24,23.75L142.4,213.66a8,8,0,0,0,5.66,2.34H224a16,16,0,0,0,16-16V180.94A15.92,15.92,0,0,0,231.16,166.63ZM224,200H151.37L40,88.63l12.87-9.76,38.79,38.79A8,8,0,0,0,103,106.34L65.74,69.11l40-30.31A64.15,64.15,0,0,0,160,87.5v21.89a63.65,63.65,0,0,0,35.38,57.24L224,180.94ZM70.8,184H32a8,8,0,0,1,0-16H70.8a8,8,0,1,1,0,16Zm40,24a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16h54.8A8,8,0,0,1,110.8,208Z"/></svg>',
  star: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"/></svg>',
  sun: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"/></svg>',
  sunHorizon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M240,152H199.55a73.54,73.54,0,0,0,.45-8,72,72,0,0,0-144,0,73.54,73.54,0,0,0,.45,8H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM72,144a56,56,0,1,1,111.41,8H72.59A56.13,56.13,0,0,1,72,144Zm144,56a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,200ZM72.84,43.58a8,8,0,0,1,14.32-7.16l8,16a8,8,0,0,1-14.32,7.16Zm-56,48.84a8,8,0,0,1,10.74-3.57l16,8a8,8,0,0,1-7.16,14.31l-16-8A8,8,0,0,1,16.84,92.42Zm192,15.16a8,8,0,0,1,3.58-10.73l16-8a8,8,0,1,1,7.16,14.31l-16,8a8,8,0,0,1-10.74-3.58Zm-48-55.16,8-16a8,8,0,0,1,14.32,7.16l-8,16a8,8,0,1,1-14.32-7.16Z"/></svg>',
  tShirt: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M247.59,61.22,195.83,33A8,8,0,0,0,192,32H160a8,8,0,0,0-8,8,24,24,0,0,1-48,0,8,8,0,0,0-8-8H64a8,8,0,0,0-3.84,1L8.41,61.22A15.76,15.76,0,0,0,1.82,82.48l19.27,36.81A16.37,16.37,0,0,0,35.67,128H56v80a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V128h20.34a16.37,16.37,0,0,0,14.58-8.71l19.27-36.81A15.76,15.76,0,0,0,247.59,61.22ZM35.67,112a.62.62,0,0,1-.41-.13L16.09,75.26,56,53.48V112ZM184,208H72V48h16.8a40,40,0,0,0,78.38,0H184Zm36.75-96.14a.55.55,0,0,1-.41.14H200V53.48l39.92,21.78Z"/></svg>',
  translate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M247.15,212.42l-56-112a8,8,0,0,0-14.31,0l-21.71,43.43A88,88,0,0,1,108,126.93,103.65,103.65,0,0,0,135.69,64H160a8,8,0,0,0,0-16H104V32a8,8,0,0,0-16,0V48H32a8,8,0,0,0,0,16h87.63A87.76,87.76,0,0,1,96,116.35a87.74,87.74,0,0,1-19-31,8,8,0,1,0-15.08,5.34A103.63,103.63,0,0,0,84,127a87.55,87.55,0,0,1-52,17,8,8,0,0,0,0,16,103.46,103.46,0,0,0,64-22.08,104.18,104.18,0,0,0,51.44,21.31l-26.6,53.19a8,8,0,0,0,14.31,7.16L148.94,192h70.11l13.79,27.58A8,8,0,0,0,240,224a8,8,0,0,0,7.15-11.58ZM156.94,176,184,121.89,211.05,176Z"/></svg>',
  tree: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M198.1,62.59a76,76,0,0,0-140.2,0A71.71,71.71,0,0,0,16,127.8C15.9,166,48,199,86.14,200A72.09,72.09,0,0,0,120,192.47V232a8,8,0,0,0,16,0V192.47A72.17,72.17,0,0,0,168,200l1.82,0C208,199,240.11,166,240,127.8A71.71,71.71,0,0,0,198.1,62.59ZM169.45,184a56.08,56.08,0,0,1-33.45-10v-41l43.58-21.78a8,8,0,1,0-7.16-14.32L136,115.06V88a8,8,0,0,0-16,0v51.06L83.58,120.84a8,8,0,1,0-7.16,14.32L120,156.94v17a56,56,0,0,1-33.45,10C56.9,183.23,31.92,157.52,32,127.84A55.77,55.77,0,0,1,67.11,76a8,8,0,0,0,4.53-4.67,60,60,0,0,1,112.72,0A8,8,0,0,0,188.89,76,55.79,55.79,0,0,1,224,127.84C224.08,157.52,199.1,183.23,169.45,184Z"/></svg>',
  trophy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path d="M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-29,64.64-64,64.9a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z"/></svg>'
};

// Weather: the data carries emoji (or a condition string for Reception); map to an icon + tint class.
export function weatherKey(glyph) {
  const g = String(glyph || '');
  if (!g) return null;
  if (/⛈|thunder/i.test(g)) return 'lightning';
  if (/🌨|snow/i.test(g)) return 'snow';
  if (/🌫|fog|mist/i.test(g)) return 'fog';
  if (/🌧|🌦|rain|shower|drizzle/i.test(g)) return 'rain';
  if (/⛅|🌤|partly|few|scattered|broken/i.test(g)) return 'cloudSun';
  if (/☁|overcast|cloud/i.test(g)) return 'cloud';
  if (/☀|🌞|sun|clear/i.test(g)) return 'sun';
  return 'cloud';
}
const WEATHER_ICON = { sun: 'sun', cloudSun: 'cloudSun', cloud: 'cloud', rain: 'cloudRain', lightning: 'cloudLightning', snow: 'cloudSnow', fog: 'cloudFog' };

// Activity glyph: label first, then the colour class as a fallback.
const ACTIVITY_ICONS = [
  [/swim/i, 'personSimpleSwim'],
  [/birthday/i, 'cake'],
  [/party|disco|celebrat/i, 'confetti'],
  [/dance/i, 'discoBall'],
  [/music|choir|sing/i, 'musicNotes'],
  [/forest|woodland|outdoor/i, 'tree'],
  [/french|spanish|language/i, 'translate'],
  [/pe kit|\bpe\b|physical|games kit/i, 'sneakerMove'],
  [/kit|uniform|dress|costume|pyjama|pajama|colours/i, 'tShirt'],
  [/cricket|all stars|football|rugby|match|tournament/i, 'baseball'],
  [/sports day|trophy|award|medal/i, 'trophy'],
  [/lunch|picnic|bake|cake sale/i, 'forkKnife'],
  [/finish|pick ?up|\b\d{1,2}[:.]\d{2}\b/i, 'clock'],
  [/last day|first day|end of term|start of term|inset/i, 'calendarCheck'],
  [/half term|holiday|break/i, 'sunHorizon'],
  [/trip|visit|outing|sussex|coach/i, 'bus'],
  [/cinema|film|movie/i, 'filmSlate'],
  [/sleepover|night|evening|bedtime/i, 'moonStars'],
  [/house/i, 'flag'],
  [/bag|homework|reading/i, 'backpack']
];
const CLASS_ICONS = { 'chip-forest': 'tree', 'chip-pe': 'sneakerMove', 'chip-music': 'musicNotes', 'chip-french': 'translate', 'chip-kit': 'tShirt', 'chip-birthday': 'cake', 'chip-kids': 'confetti' };

export function iconFor(label, cls) {
  for (const [re, icon] of ACTIVITY_ICONS) if (re.test(label)) return icon;
  return CLASS_ICONS[cls] || 'star';
}

export const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const MONTHS_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SITE_LINKS = [
  { group: 'This week', items: [
    { href: '/', label: 'Year 4' },
    { href: '/?reception', label: 'Reception' },
    { href: '/gallery', label: 'Poster gallery' }
  ]},
  { group: 'Projects', items: [
    { href: '/card', label: 'Card' },
    { href: '/games', label: 'Games' },
    { href: '/horrid', label: 'Horrid' },
    { href: '/is-it-swimming-today', label: 'Is it swimming today?' },
    { href: '/kids-vs-parents', label: 'Kids vs Parents' },
    { href: '/half-term-fighter', label: 'Half Term Fighter' },
    { href: '/ideas', label: 'Ideas' }
  ]}
];

const isMobile = () => window.matchMedia('(max-width: 720px)').matches;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Fill any [data-icon] placeholder with its Phosphor glyph.
export function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(node => {
    const svg = ICONS[node.dataset.icon];
    if (svg) node.innerHTML = svg;
  });
}

// ── Menu sheet ──
export function initMenu(currentPath = location.pathname + location.search) {
  const button = document.getElementById('menuBtn');
  if (!button) return;

  const backdrop = el('div', 'sheet-backdrop');
  const sheet = el('nav', 'sheet');
  sheet.id = 'siteMenu';
  sheet.setAttribute('aria-label', 'Site menu');
  sheet.setAttribute('aria-hidden', 'true');

  const head = el('div', 'sheet-head');
  const titleWrap = el('div');
  titleWrap.appendChild(el('div', 'title', 'dlphn.app'));
  titleWrap.appendChild(el('div', 'sub', 'Family project hub'));
  const close = el('button', 'icon-btn');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close menu');
  close.innerHTML = ICONS.x;
  head.append(titleWrap, close);

  const body = el('div', 'sheet-body');
  let index = 0;
  SITE_LINKS.forEach(group => {
    body.appendChild(el('div', 'sheet-group', group.group));
    const list = el('ul', 'sheet-links');
    group.items.forEach(item => {
      const li = el('li');
      li.style.setProperty('--i', index++);
      const a = el('a');
      a.href = item.href;
      a.appendChild(el('span', null, item.label));
      const arrow = el('span');
      arrow.innerHTML = ICONS.arrowUpRight;
      a.appendChild(arrow.firstChild);
      if (normalise(item.href) === normalise(currentPath)) a.setAttribute('aria-current', 'page');
      li.appendChild(a);
      list.appendChild(li);
    });
    body.appendChild(list);
  });

  sheet.append(head, body);
  document.body.append(backdrop, sheet);

  button.setAttribute('aria-controls', 'siteMenu');
  button.setAttribute('aria-expanded', 'false');

  function open() {
    sheet.classList.add('is-open');
    backdrop.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
    close.focus({ preventScroll: true });
  }
  function shut() {
    sheet.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.focus({ preventScroll: true });
  }

  button.addEventListener('click', () => sheet.classList.contains('is-open') ? shut() : open());
  close.addEventListener('click', shut);
  backdrop.addEventListener('click', shut);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sheet.classList.contains('is-open')) shut();
  });
}

function normalise(url) {
  const [path, query = ''] = url.split('?');
  const cleanPath = path.replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/$/, '') || '/';
  return cleanPath + (query ? '?' + query : '');
}

// ── Year group dropdown ──
export function initYearMenu(onChange) {
  const menu = document.getElementById('yearMenu');
  if (!menu) return;
  document.addEventListener('click', e => {
    if (menu.open && !menu.contains(e.target)) menu.open = false;
  });
  if (onChange) {
    menu.querySelectorAll('a[href]').forEach(a => a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      history.pushState({}, '', a.getAttribute('href'));
      menu.open = false;
      onChange();
    }));
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
}

// ── Week badge ──
export function setBadge(label) {
  const badge = document.getElementById('weekBadge');
  if (!badge) return;
  const text = String(label || '').trim();
  badge.textContent = /^[A-Za-z]$/.test(text) ? 'Week ' + text.toUpperCase() : text;
}

// "6-12 July 2026" within a month, "31 Aug-6 Sep 2026" across two.
export function formatRange(start, end) {
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}-${end.getDate()} ${MONTHS_LONG[end.getMonth()]} ${end.getFullYear()}`;
  }
  return `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]}-${end.getDate()} ${MONTHS_SHORT[end.getMonth()]} ${end.getFullYear()}`;
}

export function setDateRange(text) {
  const node = document.getElementById('dateRange');
  if (node) node.textContent = text;
}

export function localDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ── Chip classification (Year 4 data uses plain strings) ──
export const DEFAULT_CHIP_RULES = [
  { test: /Birthday/i, cls: 'chip-birthday' },
  { test: /Mum Cinema|Eurovision|James|Summer Fair|Careers|Performance/i, cls: 'chip-school' },
  { test: /Dance|Swim|PE Kit/i, cls: 'chip-kit' },
  { test: /All Stars|Cricket|Party/i, cls: 'chip-kids' },
  { test: /Mum|Dad|Parent|PYJAMARAMA|Discover Dolphin|Digital Detox|Dolphin Forum|East Sussex|Trip|Forest School/i, cls: 'chip-parents' }
];

export function classifyActivity(label, rules = DEFAULT_CHIP_RULES) {
  for (const rule of rules) {
    if (rule.test.test(label)) return rule.cls;
  }
  return 'chip-default';
}

// ── Day cards ──
// days: [{ name, date, month, weather, temp, chips:[{label, cls}], isToday, isWeekend }]
export function renderDays(container, days) {
  container.innerHTML = '';
  if (!days || !days.length) {
    container.appendChild(el('div', 'days-empty', 'No week data yet.'));
    return;
  }
  let itemIndex = 0;
  days.forEach((d, i) => {
    const day = el('article', 'day' + (d.isToday ? ' is-today' : '') + (d.isWeekend ? ' is-weekend' : ''));
    day.style.setProperty('--i', i);
    if (d.isToday) day.setAttribute('aria-current', 'date');

    const head = el('header', 'day-head');
    head.appendChild(el('span', 'day-name', d.name));
    head.appendChild(el('span', 'day-date', `${d.date} ${d.month}`));
    if (d.isToday) head.appendChild(el('span', 'today-tag', 'Today'));
    day.appendChild(head);

    const wk = weatherKey(d.weather);
    if (wk || d.temp) {
      const w = el('div', 'day-weather' + (wk ? ' w-' + wk : ''));
      if (wk) {
        const icon = el('span', 'w-icon');
        icon.innerHTML = ICONS[WEATHER_ICON[wk]];
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-label', wk === 'cloudSun' ? 'Sunny intervals' : wk);
        w.appendChild(icon);
      }
      if (d.temp) w.appendChild(el('span', 'temp', d.temp));
      day.appendChild(w);
    }

    if (d.chips && d.chips.length) {
      const list = el('ul', 'plan');
      d.chips.forEach(c => {
        const li = el('li', 'plan-item ' + (c.cls || 'chip-default').replace('chip-', 'c-'));
        li.style.setProperty('--j', itemIndex++);
        const icon = el('span', 'plan-icon');
        icon.innerHTML = ICONS[iconFor(c.label, c.cls)] || ICONS.star;
        li.appendChild(icon);
        li.appendChild(el('span', 'plan-label', c.label));
        list.appendChild(li);
      });
      day.appendChild(list);
    } else if (!d.isWeekend) {
      day.appendChild(el('p', 'plan-empty', 'Nothing on'));
    }
    container.appendChild(day);
  });
  scrollTodayIntoView(container);
}

function scrollTodayIntoView(container) {
  if (!isMobile()) return;
  const today = container.querySelector('.is-today');
  if (!today) return;
  requestAnimationFrame(() => {
    container.scrollLeft = today.offsetLeft - (container.clientWidth - today.offsetWidth) / 2;
  });
}

// Build the day list from the inline WEEK_DATA block.
export function daysFromWeekData(data, rules = DEFAULT_CHIP_RULES) {
  if (!data || !Array.isArray(data.days)) return [];
  const todayKey = localDateKey(new Date());
  return data.days.map((d, i) => {
    const monthIndex = d.month ? MONTHS_SHORT.indexOf(String(d.month).slice(0, 3)) : data.startMonth - 1;
    const date = new Date(data.year, monthIndex, d.date);
    return {
      name: d.name,
      date: d.date,
      month: MONTHS_SHORT[monthIndex] || '',
      weather: d.weather,
      temp: d.temp,
      chips: (d.activities || []).map(label => ({ label, cls: classifyActivity(label, rules) })),
      isToday: localDateKey(date) === todayKey,
      isWeekend: i >= 5,
      dateObj: date
    };
  });
}

// ── Poster zoom (pinch, pan, double tap, double click) ──
export function initZoom(poster) {
  const wrap = poster.querySelector('.zoom-wrap');
  const img = wrap && wrap.querySelector('img');
  const bg = poster.querySelector('.poster-bg');
  if (!wrap || !img) return;

  let imgW = 0, imgH = 0, baseScale = 1, scale = 1, tx = 0, ty = 0;
  let lastDist = 0, panStart = null, lastTap = 0, gestured = false;

  const flexX = () => (wrap.clientWidth - imgW) / 2;
  const flexY = () => (wrap.clientHeight - imgH) / 2;

  function apply() {
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    wrap.classList.toggle('is-zoomed', scale > baseScale * 1.02);
  }

  function clamp() {
    const cw = wrap.clientWidth, ch = wrap.clientHeight;
    const sw = imgW * scale, sh = imgH * scale;
    if (sw <= cw) tx = (cw - sw) / 2 - flexX();
    else tx = Math.max(cw - sw - flexX(), Math.min(-flexX(), tx));
    if (sh <= ch) ty = (ch - sh) / 2 - flexY();
    else ty = Math.max(ch - sh - flexY(), Math.min(-flexY(), ty));
  }

  function fit() {
    const cw = wrap.clientWidth, ch = wrap.clientHeight;
    if (!cw || !ch || !imgW || !imgH) return;
    const contain = Math.min(cw / imgW, ch / imgH);
    const cover = Math.max(cw / imgW, ch / imgH);
    const useContain = cw / ch >= 1;
    baseScale = useContain ? contain : cover;
    poster.classList.toggle('is-contain', useContain);
    scale = baseScale;
    clamp();
    apply();
  }

  function zoomAt(clientX, clientY, targetScale) {
    const rect = wrap.getBoundingClientRect();
    const cx = clientX - rect.left, cy = clientY - rect.top;
    const next = Math.max(baseScale, Math.min(baseScale * 6, targetScale));
    const ratio = next / scale;
    tx = cx - (cx - tx) * ratio;
    ty = cy - (cy - ty) * ratio;
    scale = next;
    clamp();
    apply();
  }

  function ready() {
    imgW = img.naturalWidth;
    imgH = img.naturalHeight;
    if (!imgW || !imgH) return;
    if (bg) bg.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
    img.classList.add('is-loaded');
    fit();
  }

  if (img.complete && img.naturalWidth) ready(); else img.addEventListener('load', ready, { once: true });
  img.addEventListener('error', () => {
    poster.appendChild(el('div', 'poster-empty', 'No poster for this week yet.'));
  }, { once: true });
  new ResizeObserver(() => fit()).observe(wrap);

  wrap.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      const [a, b] = e.touches;
      lastDist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      panStart = null;
      gestured = true;
    } else if (e.touches.length === 1) {
      gestured = false;
      const overflowing = imgW * scale > wrap.clientWidth + 1 || imgH * scale > wrap.clientHeight + 1;
      panStart = overflowing ? { x: e.touches[0].clientX - tx, y: e.touches[0].clientY - ty } : null;
    }
  }, { passive: true });

  wrap.addEventListener('touchmove', e => {
    if (e.touches.length === 2 && lastDist) {
      const [a, b] = e.touches;
      const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      zoomAt((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2, scale * dist / lastDist);
      lastDist = dist;
    } else if (e.touches.length === 1 && panStart) {
      const nx = e.touches[0].clientX - panStart.x;
      const ny = e.touches[0].clientY - panStart.y;
      if (Math.abs(nx - tx) > 3 || Math.abs(ny - ty) > 3) gestured = true;
      tx = nx;
      ty = ny;
      clamp();
      apply();
    }
  }, { passive: true });

  wrap.addEventListener('touchend', e => {
    lastDist = 0;
    if (e.changedTouches.length === 1 && e.touches.length === 0 && !gestured) {
      const now = Date.now();
      if (now - lastTap < 300) toggleZoom(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      lastTap = now;
    }
    panStart = null;
  });
  wrap.addEventListener('touchcancel', () => { lastDist = 0; panStart = null; });

  function toggleZoom(x, y) {
    if (scale > baseScale * 1.5) { scale = baseScale; clamp(); apply(); }
    else zoomAt(x, y, baseScale * 2.5);
  }

  wrap.addEventListener('dblclick', e => toggleZoom(e.clientX, e.clientY));

  // Desktop drag when zoomed in.
  let dragging = null;
  wrap.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || scale <= baseScale * 1.02) return;
    dragging = { x: e.clientX - tx, y: e.clientY - ty };
    wrap.setPointerCapture(e.pointerId);
  });
  wrap.addEventListener('pointermove', e => {
    if (!dragging || e.pointerType === 'touch') return;
    tx = e.clientX - dragging.x;
    ty = e.clientY - dragging.y;
    clamp();
    apply();
  });
  wrap.addEventListener('pointerup', () => { dragging = null; });
  wrap.addEventListener('pointercancel', () => { dragging = null; });
}

// ── Views: which year groups the URL asks for ──
// "/" is Year 4. "?reception" or "#reception" is Reception. Naming both ("?year4&reception") shows both.
export const VIEWS = {
  year4: { key: 'year4', label: 'Year 4', href: '/' },
  reception: { key: 'reception', label: 'Reception', href: '/?reception' }
};

export function readViews(search = location.search, hash = location.hash) {
  const tokens = new Set();
  [search, hash].forEach(part => {
    new URLSearchParams(part.replace(/^[?#]/, '')).forEach((v, k) => tokens.add(k.trim().toLowerCase()));
  });
  const reception = tokens.has('reception') || tokens.has('rec');
  const year4 = tokens.has('year4') || tokens.has('year-4') || tokens.has('y4');
  if (reception && year4) return ['year4', 'reception'];
  if (reception) return ['reception'];
  return ['year4'];
}

// ── Reception: fortnightly timetable plus live weather ──
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function mondayOf(date) {
  const d = new Date(date);
  const dow = d.getDay();
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

export function schoolWeek(weekAStart, today = new Date()) {
  const diffWeeks = Math.round((mondayOf(today) - mondayOf(weekAStart)) / (7 * 86400000));
  return diffWeeks % 2 === 0 ? 'A' : 'B';
}

export function daysFromTimetable(timetable, weekLabel, today = new Date()) {
  const monday = mondayOf(today);
  const todayKey = localDateKey(today);
  return DAY_NAMES.map((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const week = timetable && timetable[weekLabel];
    const list = i < 5 && week && week[name.toLowerCase()] ? week[name.toLowerCase()] : [];
    return {
      name,
      date: d.getDate(),
      month: MONTHS_SHORT[d.getMonth()],
      chips: list.map(a => ({ label: a.label, cls: a.cls })),
      isToday: localDateKey(d) === todayKey,
      isWeekend: i >= 5,
      dateObj: d
    };
  });
}

export function weatherGlyph(condition) {
  const c = String(condition || '').toLowerCase();
  if (c.includes('clear') || c.includes('sunny')) return '☀️';
  if (c.includes('partly') || c.includes('few') || c.includes('scattered') || c.includes('broken')) return '⛅';
  if (c.includes('overcast')) return '☁️';
  if (c.includes('drizzle') || c.includes('light rain')) return '🌦';
  if (c.includes('rain') || c.includes('shower')) return '🌧';
  if (c.includes('thunder')) return '⛈';
  if (c.includes('snow')) return '🌨';
  if (c.includes('mist') || c.includes('fog')) return '🌫';
  return '☁️';
}

function mergeWeather(days, entries) {
  const byDate = {};
  (entries || []).forEach(w => { (byDate[w.date] ||= []).push(w); });
  days.forEach(d => {
    const list = byDate[localDateKey(d.dateObj)];
    if (!list || !list.length) return;
    const temps = list.map(e => Number(e.temp)).filter(n => !Number.isNaN(n));
    const mid = list[Math.floor(list.length / 2)];
    d.weather = weatherGlyph(mid.condition);
    if (temps.length) d.temp = `${Math.max(...temps)}°`;
  });
}

let weatherPromise = null;
function loadWeather() {
  if (!weatherPromise) {
    weatherPromise = fetch('/data.json?ts=' + Date.now())
      .then(r => (r.ok ? r.json() : null))
      .then(data => (data && Array.isArray(data.weather) ? data.weather : null))
      .catch(() => null);
  }
  return weatherPromise;
}

// ── Page bootstrap ──
export function initChrome(onViewChange) {
  hydrateIcons();
  initYearMenu(onViewChange);
  initMenu();
  const poster = document.getElementById('poster');
  if (poster) initZoom(poster);
}

function buildModel(view, { data, rules, timetable, weekAStart }) {
  if (view === 'reception') {
    const start = weekAStart instanceof Date ? weekAStart : new Date(2026, 1, 9);
    const weekLabel = schoolWeek(start);
    const days = daysFromTimetable(timetable, weekLabel);
    return { view, label: VIEWS.reception.label, weekLabel, days, liveWeather: true };
  }
  const chipRules = Array.isArray(rules) && rules.length ? rules : DEFAULT_CHIP_RULES;
  const days = daysFromWeekData(data, chipRules);
  return { view, label: VIEWS.year4.label, weekLabel: data ? data.weekLabel : '', days, liveWeather: false };
}

function rangeOf(days) {
  return days.length === 7 ? formatRange(days[0].dateObj, days[6].dateObj) : '';
}

function renderStrips(wrapper, models) {
  wrapper.innerHTML = '';
  models.forEach(m => {
    if (models.length > 1) {
      const title = el('div', 'days-title');
      title.appendChild(el('span', 'name', m.label));
      const badge = /^[A-Za-z]$/.test(String(m.weekLabel).trim()) ? 'Week ' + String(m.weekLabel).toUpperCase() : String(m.weekLabel || '');
      title.appendChild(el('span', 'meta', [badge, rangeOf(m.days)].filter(Boolean).join(', ')));
      wrapper.appendChild(title);
    }
    const strip = el('section', 'days');
    strip.dataset.view = m.view;
    strip.setAttribute('aria-label', `${m.label}, day by day`);
    renderDays(strip, m.days);
    wrapper.appendChild(strip);
    m.strip = strip;
  });
}

function syncYearMenu(views) {
  const menu = document.getElementById('yearMenu');
  if (!menu) return;
  const label = views.length > 1 ? 'Year 4 + Reception' : VIEWS[views[0]].label;
  const summary = menu.querySelector('summary');
  const text = summary.querySelector('span');
  if (text) text.textContent = label;
  summary.setAttribute('aria-label', `Change year group, currently ${label}`);
  menu.querySelectorAll('a[data-view]').forEach(a => {
    if (views.length === 1 && a.dataset.view === views[0]) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// Single weekly page. The URL decides which year group(s) to show; data blocks are inline in index.html.
export function initWeekPage(sources = {}) {
  const wrapper = document.getElementById('dayStrip');

  function render() {
    const views = readViews();
    const models = views.map(v => buildModel(v, sources));
    const primary = models[0];

    document.body.dataset.year = views.length === 1 ? views[0] : 'year4';
    document.body.dataset.views = views.join(' ');
    document.title = `${views.length > 1 ? 'Year 4 and Reception' : primary.label} this week | Dolphin School`;

    setBadge(primary.weekLabel);
    setDateRange(rangeOf(primary.days));
    syncYearMenu(views);
    if (wrapper) renderStrips(wrapper, models);

    const live = models.filter(m => m.liveWeather);
    if (live.length) {
      loadWeather().then(entries => {
        if (!entries) return;
        live.forEach(m => { mergeWeather(m.days, entries); if (m.strip) renderDays(m.strip, m.days); });
      });
    }
  }

  initChrome(render);
  window.addEventListener('popstate', render);
  window.addEventListener('hashchange', render);
  render();
}
