import { firebase_v1beta1, google } from 'googleapis';
import { Client } from '../../google-cloud/client';

export class FirebaseClient extends Client {
  private client = google.firebase('v1beta1');

  async iterateWebApps(
    projectName: string,
    callback: (data: firebase_v1beta1.Schema$WebApp) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.projects.webApps.list({
          parent: projectName,
          auth,
          pageToken: nextPageToken,
        });
      },
      async (data: firebase_v1beta1.Schema$ListWebAppsResponse) => {
        for (const project of data.apps || []) {
          await callback(project);
        }
      },
    );
  }
}
