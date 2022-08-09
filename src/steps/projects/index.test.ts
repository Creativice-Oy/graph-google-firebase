import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupGoogleCloudRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-projects', async () => {
  recording = setupGoogleCloudRecording({
    directory: __dirname,
    name: 'fetch-projects',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.PROJECTS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
