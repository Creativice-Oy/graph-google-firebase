import { accountSteps } from './account';
import { applicationSteps } from './application';
import { projectSteps } from './projects';
import { userSteps } from './users';

const integrationSteps = [
  ...accountSteps,
  ...projectSteps,
  ...userSteps,
  ...applicationSteps,
];

export { integrationSteps };
