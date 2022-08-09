# Development

This integration focuses on [Google Firebase](https://firebase.google.com/) and
is using the
[Google APIs Node.js Client](https://www.npmjs.com/package/googleapis) for
interacting with the Google Firebase resources.

## Google Firebase account setup

1. Create a Google account.
2. Create Firebase project.
3. Log in to the [Firebase console](https://console.firebase.google.com/u/0/),
   then click Add project.

### Creating a Google Firebase service account and service account key

1. Go to Project Settings
2. Go to Service Acounts tab
3. Click "Create Service Account"
4. After the service account is created, click "Generate new private key"
5. In the pop-up, click "Generate key"
6. Flatten the key and generate .env file by running

```bash
  yarn create-env-file ~/SERVICE_ACCOUNT_FILE_PATH_HERE.json
```

## Authentication

The Google Cloud service account key file should be a flattened JSON string.

The following is an example of an unflattened service account key file:

```json
{
  "type": "service_account",
  "project_id": "PROJECT_ID",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

A helper script can be run that will automatically generate the `.env` file in
the correct format:

```bash
yarn create-env-file ~/SERVICE_ACCOUNT_FILE_PATH_HERE.json
```
