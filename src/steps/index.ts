import { accountSteps } from './account';
import { projectSteps } from './projects';
import { userSteps } from './users';

const integrationSteps = [...accountSteps, ...projectSteps, ...userSteps];

export { integrationSteps };
