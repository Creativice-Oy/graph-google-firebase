import { google, identitytoolkit_v3 } from 'googleapis';
import { Client } from '../../google-cloud/client';

export class IdentityToolkitClient extends Client {
  private client = google.identitytoolkit('v3');

  async iterateUsers(
    projectId: string,
    callback: (data: identitytoolkit_v3.Schema$UserInfo) => Promise<void>,
  ): Promise<void> {
    const auth = await this.getAuthenticatedServiceClient();

    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.relyingparty.downloadAccount({
          requestBody: {
            maxResults: this.pageSize,
            targetProjectId: projectId,
            nextPageToken: nextPageToken,
          },
          auth,
        });
      },
      async (data: identitytoolkit_v3.Schema$DownloadAccountResponse) => {
        console.log('data', data);
        for (const user of data.users || []) {
          await callback(user);
        }
      },
    );
  }
}
