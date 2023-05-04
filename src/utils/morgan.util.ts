import { middleware } from '../dependencies/index.dependencies';

const morgan = middleware.morgan;

export const initMorganToken = () => { return morgan.token('date', () => {
  return new Date().toLocaleDateString('ru', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
});};