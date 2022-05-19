# Development

This integration focuses on [Google Firebase](https://firebase.google.com/) and
is using the
[Google APIs Node.js Client](https://www.npmjs.com/package/googleapis) for
interacting with the Google Firebase resources.

## Provider account setup

1. Create a Google account.
2. Create Firebase project.
3. Create a
   [Google Cloud service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts).
4. Create a
   [Google Cloud service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).

#### JupiterOne + Google Cloud Organization

Given the correct permissions, JupiterOne has the ability to automatically
discover each Firebase project under a Google Cloud organization and configure
integration instances for each of the projects.

##### Setup

1. Select one Google Firebase project to configure a service account for
   JupiterOne.
1. Create the service account without a role. Copy the email address of the new
   service account (e.g. `my-sa@my-j1-project.iam.gserviceaccount.com`)
1. Generate and copy a new service account key
1. Enable all service APIs in the "main" project and each "child" project that
   you'd like JupiterOne to access. Documentation for enabling service APIs is
   described in an earlier section of this document.
   - **NOTE**: The "Cloud Asset" and "Identity and Access Management (IAM)" APIs
     only need to be enabled in the "main" project.
1. Switch to the organization that you'd like to create individual integration
   instances for each project
1. [Create a new custom role](https://cloud.google.com/iam/docs/creating-custom-roles)
   with the following permissions:

```
resourcemanager.folders.get
resourcemanager.folders.list
resourcemanager.organizations.get
resourcemanager.projects.get
resourcemanager.projects.list
serviceusage.services.list
resourcemanager.organizations.getIamPolicy
cloudasset.assets.searchAllIamPolicies
```

The integration will also try to ingest organization policy for
"storage.publicAccessPrevention" to precisely calculate storage buckets public
access, it is therefore recommended that the following permission is also
included in the custom role above:

```
orgpolicy.policies.get
```

1. Navigate to the Cloud Resource Manager for that organization and
   [add a new member to the organization](https://cloud.google.com/resource-manager/docs/access-control-org#grant-access).
   The new member email address is the email address of the service account that
   was created earlier. Select the new organization role that was created above,
   as well as the Google Cloud managed role "Security Reviewer"
   (`roles/iam.securityReviewer`) or an alternative JupiterOne custom role that
   you've created.

1. Navigate to the JupiterOne Google Cloud integration configuration page to
   begin configuring the "main" integration instance.

Use the generated service account key as the value for the "Service Account Key
File" field.

**NOTE**: The "Polling Interval" that is selected for the "main" integration
instances, will be the same polling interval that is used for each of the child
integration instances.

1. Check the "Configure Organization Projects" checkbox
1. Place the numerical value of the Google Cloud organization into the
   "Organization ID" text field (e.g. "1234567890")
1. Click the `CREATE CONFIGURATION` button

**NOTE**: Depending on how many projects exist under a Google Cloud
organization, the auto-configuration process may take a few minutes to complete.
When the process has been completed, you will see your new integration instances
on the JupiterOne Google Firebase integration list page.

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
