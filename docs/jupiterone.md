# Google Firebase Integration with JupiterOne

## Google Firebase + JupiterOne Integration Benefits

- Visualize Google Firebase projects and users in the JupiterOne graph.
- Map Google Firebase projects to users in your JupiterOne account.
- Monitor changes to Google Firebase projects and users using JupiterOne alerts.

## How it Works

- JupiterOne periodically fetches projects and users from Google Firebase to
  update the graph.
- Write JupiterOne queries to review and monitor updates to the graph, or
  leverage existing queries.
- Configure alerts to take action when JupiterOne graph changes, or leverage
  existing alerts.

## Requirements

- JupiterOne requires the contents of a Google Cloud service account key file
  with the correct API services enabled (see the **Integration Walkthrough**).
- You must have permission in JupiterOne to install new integrations.

## Support

If you need help with this integration, please contact
[JupiterOne Support](https://support.jupiterone.io).

## Integration Walkthrough

### In Google Firebase

A
[Google Cloud service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts)
and a
[Google Cloud service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)
must be created in order to run the integration. The service account key is used
to authenticate on behalf of the integration's Google Cloud project and ingest
data into JupiterOne.

#### Creating Google Cloud project service account

- See the
  [Google Cloud service account documentation](https://cloud.google.com/iam/docs/creating-managing-service-accounts#creating)
  for more information on how to create a service account in one of the projects
  that you would like to ingest data from.

We must assign the correct permissions to the newly created service account for
the integration to be run. We recommend using the following roles managed by
Google Cloud:

- [`roles/firebase.viewer`](https://cloud.google.com/iam/docs/understanding-roles#firebase.viewer)
- [`roles/firebase.viewer`](https://cloud.google.com/iam/docs/understanding-roles#firebase.viewer)
- [`roles/iam.securityReviewer`](https://cloud.google.com/iam/docs/understanding-roles#iam.securityReviewer)

See the
[Google Cloud custom role documentation](https://cloud.google.com/iam/docs/creating-custom-roles#creating_a_custom_role)
for additional information on how custom roles can be configured and assigned.

NOTE: You may also create a service account using the
[`gcloud` CLI](https://cloud.google.com/sdk/gcloud). There is documentation on
how to leverage the CLI in the
[JupiterOne Google Cloud integration developer documentation](https://github.com/JupiterOne/graph-google-cloud/blob/master/docs/development.md).

#### Generate a service account key

- See the
  [Google Cloud service account key documentation](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys)
  for more information on how to create a service account key for the service
  account that you would like to ingest data using.

NOTE: You may also create a service account key using the
[`gcloud` CLI](https://cloud.google.com/sdk/gcloud). There is documentation on
how to leverage the CLI in the
[Google Cloud integration developer documentation](https://github.com/JupiterOne/graph-google-cloud/blob/master/docs/development.md).

#### JupiterOne + Google Cloud Organization

Given the correct permissions, JupiterOne has the ability to automatically
discover each project under a Google Cloud organization and configure
integration instances for each of the projects.

##### Setup

1. Select one Google Cloud project to configure a service account for
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
on the JupiterOne Google Cloud integration list page.

### In JupiterOne

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **Google Firebase** integration tile and click it.
3. Click the **Add Configuration** button and configure the following settings:

- Enter the **Account Name** by which you'd like to identify this Google
  Firebase account in JupiterOne. Ingested entities will have this value stored
  in `tag.AccountName` when **Tag with Account Name** is checked.
- Enter a **Description** that will further assist your team when identifying
  the integration instance.
- Select a **Polling Interval** that you feel is sufficient for your monitoring
  needs. You may leave this as `DISABLED` and manually execute the integration.
- {{additional provider-specific settings}} Enter the **Google Firebase API
  Key** generated for use by JupiterOne.

4. Click **Create Configuration** once all values are provided.

# How to Uninstall

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **Google Firebase** integration tile and click it.
3. Identify and click the **integration to delete**.
4. Click the **trash can** icon.
5. Click the **Remove** button to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources | Entity `_type`            | Entity `_class` |
| --------- | ------------------------- | --------------- |
| Account   | `google_firebase_account` | `Account`       |
| Project   | `google_firebase_project` | `Project`       |
| User      | `google_firebase_user`    | `User`          |

### Relationships

The following relationships are created:

| Source Entity `_type`     | Relationship `_class` | Target Entity `_type`     |
| ------------------------- | --------------------- | ------------------------- |
| `google_firebase_account` | **HAS**               | `google_firebase_project` |
| `google_firebase_project` | **HAS**               | `google_firebase_user`    |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
