import { test, expect } from '@playwright/experimental-ct-react';
import { Counter } from '../../components/Counter';

test('starts at zero by default', async ({ mount }) => {
  const component = await mount(<Counter />);
  await expect(component.getByTestId('count')).toHaveText('0');
});

test('increments count on click', async ({ mount }) => {
  const component = await mount(<Counter />);
  await component.getByRole('button', { name: 'Increment' }).click();
  await expect(component.getByTestId('count')).toHaveText('1');
});

test('decrements count on click', async ({ mount }) => {
  const component = await mount(<Counter initial={3} />);
  await component.getByRole('button', { name: 'Decrement' }).click();
  await expect(component.getByTestId('count')).toHaveText('2');
});

test('accepts an initial value via props', async ({ mount }) => {
  const component = await mount(<Counter initial={10} />);
  await expect(component.getByTestId('count')).toHaveText('10');
});
