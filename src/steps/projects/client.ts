import { firebase_v1beta1, google } from 'googleapis';
import { Client } from '../../google-cloud/client';

export class FirebaseClient extends Client {
  private client = google.firebase('v1beta1');

  async iterateProjects(
    callback: (data: firebase_v1beta1.Schema$FirebaseProject) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.projects.list({
          auth,
          pageToken: nextPageToken,
        });
      },
      async (data: firebase_v1beta1.Schema$ListFirebaseProjectsResponse) => {
        for (const project of data.results || []) {
          await callback(project);
        }
      },
    );
  }
}
