# Read the Docs API v3 endpoints (short reference)

Use this for quick lookup of method, path, and high-level parameters. For details, see `api-v3-full.md`.

## Table of contents

- Projects
- Versions
- Builds
- Subprojects
- Translations
- Redirects
- Environment variables
- Organizations (Read the Docs for Business)
- Remote VCS resources
- Embed

## Projects

Auth: Token required for write operations and private data; recommended for user-scoped reads.

### Projects list
- Method: GET
- Path: `/api/v3/projects/`
- Summary: List projects for the current user.
- Query: `name`, `slug`, `language`, `programming_language`; Read the Docs for Business: `expand=organization`.
- Response: Paginated list of project objects.

### Project details
- Method: GET
- Path: `/api/v3/projects/{project_slug}/`
- Summary: Retrieve a single project's details.
- Query: `expand=active_versions` (comma-separated); Read the Docs for Business: `expand=organization`.
- Response: Project object.

### Project create
- Method: POST
- Path: `/api/v3/projects/`
- Summary: Import a project under the authenticated user.
- Body: Project fields (name, repository, language, privacy, etc.).
- Response: Project object.

### Project update
- Method: PATCH
- Path: `/api/v3/projects/{project_slug}/`
- Summary: Update an existing project.
- Body: Project fields to update.
- Response: `204 No Content`.

### Project versions sync
- Method: POST
- Path: `/api/v3/projects/{project_slug}/sync-versions/`
- Summary: Trigger a background task to sync versions.
- Response: `202 Accepted` on success.

## Versions

Auth: Token required for private projects; recommended for version updates.

### Versions listing
- Method: GET
- Path: `/api/v3/projects/{project_slug}/versions/`
- Summary: List versions for a project.
- Query: `active`, `built`, `privacy_level`, `slug`, `type`, `verbose_name`.
- Response: Paginated list of versions.

### Version detail
- Method: GET
- Path: `/api/v3/projects/{project_slug}/versions/{version_slug}/`
- Summary: Retrieve a single version.
- Response: Version object.

### Version update
- Method: PATCH
- Path: `/api/v3/projects/{project_slug}/versions/{version_slug}/`
- Summary: Update version visibility/status.
- Body: `active`, `hidden`, `privacy_level`.
- Response: `204 No Content`.

## Builds

Auth: Token required for private projects; required for triggering builds.

### Build details
- Method: GET
- Path: `/api/v3/projects/{project_slug}/builds/{build_id}/`
- Summary: Retrieve a single build.
- Query: `expand=config`.
- Response: Build object.

### Builds listing
- Method: GET
- Path: `/api/v3/projects/{project_slug}/builds/`
- Summary: List builds for a project.
- Query: `commit`, `running`.
- Response: Paginated list of builds.

### Build triggering
- Method: POST
- Path: `/api/v3/projects/{project_slug}/versions/{version_slug}/builds/`
- Summary: Trigger a new build for a version.
- Response: Build trigger payload; `202 Accepted`.

## Subprojects

Auth: Token required.

### Subproject details
- Method: GET
- Path: `/api/v3/projects/{project_slug}/subprojects/{alias_slug}/`
- Summary: Retrieve a subproject relationship.
- Response: Subproject relationship object.

### Subprojects listing
- Method: GET
- Path: `/api/v3/projects/{project_slug}/subprojects/`
- Summary: List subprojects for a project.
- Response: Paginated list of relationships.

### Subproject create
- Method: POST
- Path: `/api/v3/projects/{project_slug}/subprojects/`
- Summary: Create a subproject relationship.
- Body: `child`, optional `alias`.
- Response: Subproject relationship object; `201 Created`.

### Subproject delete
- Method: DELETE
- Path: `/api/v3/projects/{project_slug}/subprojects/{alias_slug}/`
- Summary: Delete a subproject relationship.
- Response: `204 No Content`.

## Translations

Auth: Token required for private projects; recommended otherwise.

### Translations listing
- Method: GET
- Path: `/api/v3/projects/{project_slug}/translations/`
- Summary: List translations for a project.
- Response: Paginated list of project objects.

## Redirects

Auth: Token required.

### Redirect details
- Method: GET
- Path: `/api/v3/projects/{project_slug}/redirects/{redirect_id}/`
- Summary: Retrieve a redirect.
- Response: Redirect object.

### Redirects listing
- Method: GET
- Path: `/api/v3/projects/{project_slug}/redirects/`
- Summary: List redirects for a project.
- Response: Paginated list of redirects.

### Redirect create
- Method: POST
- Path: `/api/v3/projects/{project_slug}/redirects/`
- Summary: Create a redirect.
- Body: `from_url`, `to_url`, `type`, optional `position`.
- Response: Redirect object; `201 Created`.

### Redirect update
- Method: PUT
- Path: `/api/v3/projects/{project_slug}/redirects/{redirect_id}/`
- Summary: Update a redirect.
- Body: Redirect fields to update.
- Response: Redirect object.

### Redirect delete
- Method: DELETE
- Path: `/api/v3/projects/{project_slug}/redirects/{redirect_id}/`
- Summary: Delete a redirect.
- Response: `204 No Content`.

## Environment variables

Auth: Token required.

### Environment variable details
- Method: GET
- Path: `/api/v3/projects/{project_slug}/environmentvariables/{environmentvariable_id}/`
- Summary: Retrieve an environment variable.
- Response: Environment variable object.

### Environment variables listing
- Method: GET
- Path: `/api/v3/projects/{project_slug}/environmentvariables/`
- Summary: List environment variables.
- Response: Paginated list of environment variables.

### Environment variable create
- Method: POST
- Path: `/api/v3/projects/{project_slug}/environmentvariables/`
- Summary: Create an environment variable.
- Body: `name`, `value`, optional `public`.
- Response: Environment variable object; `201 Created`.

### Environment variable delete
- Method: DELETE
- Path: `/api/v3/projects/{project_slug}/environmentvariables/{environmentvariable_id}/`
- Summary: Delete an environment variable.
- Response: `204 No Content`.

## Organizations (Read the Docs for Business)

Auth: Token required.

### Organizations list
- Method: GET
- Path: `/api/v3/organizations/`
- Summary: List organizations for the current user.
- Response: Paginated list of organizations.

### Organization details
- Method: GET
- Path: `/api/v3/organizations/{organization_slug}/`
- Summary: Retrieve an organization.
- Response: Organization object.

### Organization projects list
- Method: GET
- Path: `/api/v3/organizations/{organization_slug}/projects/`
- Summary: List projects under an organization.
- Response: Paginated list of projects.

### Organization teams list
- Method: GET
- Path: `/api/v3/organizations/{organization_slug}/teams/`
- Summary: List teams under an organization.
- Query: `expand=members`.
- Response: Paginated list of teams.

## Remote VCS resources

Auth: Token required.

### Remote organization listing
- Method: GET
- Path: `/api/v3/remote/organizations/`
- Summary: List remote VCS organizations for the user.
- Query: `name`, `vcs_provider` (`github`, `gitlab`, `bitbucket`).
- Response: Paginated list of remote organizations.

### Remote repository listing
- Method: GET
- Path: `/api/v3/remote/repositories/`
- Summary: List importable remote repositories for the user.
- Query: `name`, `full_name`, `vcs_provider`, `organization`, `expand=remote_organization`.
- Response: Paginated list of remote repositories.

## Embed

Auth: Not required.

### Embed content
- Method: GET
- Path: `/api/v3/embed/`
- Summary: Retrieve HTML content for a doc page or section.
- Query: `url` (required), optional `doctool`, `doctoolversion`, `maincontent`.
- Response: `url`, `fragment`, `content`, `external`.
