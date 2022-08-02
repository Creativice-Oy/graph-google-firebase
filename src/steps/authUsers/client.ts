import { Client } from '../../admin-sdk/client';
import { ListUsersResult, UserRecord } from 'firebase-admin/auth';

export class Auth extends Client {
  async iterateAuthUsers(callback: (data: UserRecord) => Promise<void>) {
    await this.iterateApi(
      async (nextPageToken) => {
        return await this.getAuth().listUsers(500, nextPageToken);
      },
      async (data: ListUsersResult) => {
        for (const user of data.users || []) {
          await callback(user);
        }
      },
    );
  }
}
