import { accountSteps } from './account';
import { applicationSteps } from './application';
import { authUserSteps } from './authUsers';
import { projectSteps } from './projects';
import { userSteps } from './users';

const integrationSteps = [
  ...accountSteps,
  ...projectSteps,
  ...userSteps,
  ...applicationSteps,
  ...authUserSteps,
];

export { integrationSteps };
