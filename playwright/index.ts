import { beforeMount, afterMount } from '@playwright/experimental-ct-react/hooks';

beforeMount(async () => {
  // global setup before each component mounts (add providers, global styles, etc.)
});

afterMount(async () => {
  // cleanup after each component mounts
});
