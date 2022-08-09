import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accountSpec } from './account';
import { applicationsSpec } from './application';
import { projectsSpec } from './projects';
import { usersSpec } from './users';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...accountSpec,
    ...projectsSpec,
    ...usersSpec,
    ...applicationsSpec,
  ],
};
