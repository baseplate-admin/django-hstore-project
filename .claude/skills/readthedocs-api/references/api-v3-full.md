# Read the Docs API v3 endpoints (full reference)

Each section mirrors the API v3 documentation and expands the short reference with parameters, response fields, and notes.

Additional full reference: `https://docs.readthedocs.com/platform/stable/api/v3.html`

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
- Query parameters:
  - `name`: Match project name.
  - `slug`: Match project slug.
  - `language`: Language code like `en`, `es`, `ru`.
  - `programming_language`: Programming language code like `py`, `js`.
  - Read the Docs for Business: `expand=organization`.
- Response: Paginated list of project objects.
- Notes: `results` entries match the Project details response.

### Project details
- Method: GET
- Path: `/api/v3/projects/{project_slug}/`
- Query parameters:
  - `expand=active_versions` (comma-separated for multiple fields).
  - Read the Docs for Business: `expand=organization` (returns organization slug only).
- Response: Project object including `privacy_level`, `external_builds_privacy_level`, `versioning_scheme`, and `readthedocs_yaml_path`.
- Notes:
  - `versioning_scheme` values: `multiple_versions_with_translations`, `multiple_versions_without_translations`, `single_version_without_translations`.
  - `single_version` is deprecated; use `versioning_scheme`.
  - `translation_of` and `subproject_of` return only a slug (not a full project object).

### Project create
- Method: POST
- Path: `/api/v3/projects/`
- Body fields (JSON):
  - `name` (string)
  - `repository` (object): `url`, `type`
  - `homepage` (string)
  - `programming_language` (string)
  - `language` (string)
  - `privacy_level` (string)
  - `external_builds_privacy_level` (string)
  - `readthedocs_yaml_path` (string)
  - `tags` (list of strings)
  - Read the Docs for Business only:
    - `organization` (string, required)
    - `teams` (list of strings, optional)
- Response: Project object (same as Project details).
- Notes: Privacy-level fields are available only on Read the Docs for Business.

### Project update
- Method: PATCH
- Path: `/api/v3/projects/{project_slug}/`
- Body fields (JSON, partial):
  - `name`, `repository`, `language`, `programming_language`, `homepage`
  - `tags`
  - `default_version`, `default_branch`
  - `analytics_code`, `analytics_disabled`
  - `versioning_scheme`, `readthedocs_yaml_path`
  - `external_builds_enabled`
  - `privacy_level`, `external_builds_privacy_level`
- Response: `204 No Content`.
- Notes:
  - Providing `tags` replaces existing tags; omitting `tags` leaves them unchanged.
  - Privacy-level fields are available only on Read the Docs for Business.

### Project versions sync
- Method: POST
- Path: `/api/v3/projects/{project_slug}/sync-versions/`
- Response:
  - `202 Accepted`: Task created.
  - `400 Bad Request`: Task not created.

## Versions

Auth: Token required for private projects; recommended for version updates.

### Versions listing
- Method: GET
- Path: `/api/v3/projects/{project_slug}/versions/`
- Query parameters:
  - `active` (boolean)
  - `built` (boolean)
  - `privacy_level` (`public` or `private`)
  - `slug` (string)
  - `type` (`branch` or `tag`)
  - `verbose_name` (string)
- Response: Paginated list of versions.

### Version detail
- Method: GET
- Path: `/api/v3/projects/{project_slug}/versions/{version_slug}/`
- Response fields (high level):
  - `id`, `slug`, `verbose_name`, `identifier`, `ref`, `built`, `active`, `aliases`, `hidden`, `type`, `privacy_level`
  - `downloads` (`pdf`, `htmlzip`, `epub`)
  - `urls` (`dashboard.edit`, `documentation`, `vcs`)
  - `_links` (`_self`, `builds`, `project`)
- Notes:
  - `ref` is the version slug where `stable` points; `null` if not `stable`.
  - `built` indicates at least one successful build.

### Version update
- Method: PATCH
- Path: `/api/v3/projects/{project_slug}/versions/{version_slug}/`
- Body fields (JSON): `active`, `hidden`, `privacy_level`.
- Response: `204 No Content`.
- Notes:
  - Deactivating removes documentation; activating triggers a new build.
  - Updates invalidate CDN cache.
  - Privacy-level fields are available only on Read the Docs for Business.

## Builds

Auth: Token required for private projects; required for triggering builds.

### Build details
- Method: GET
- Path: `/api/v3/projects/{project_slug}/builds/{build_id}/`
- Query parameters:
  - `expand=config`
- Response fields (high level):
  - `id`, `version`, `project`, `created`, `finished`, `duration`, `state`, `success`, `error`, `commit`, `config`, `_links`
- Notes:
  - `created` and `finished` are ISO-8601 timestamps.
  - `duration` is in seconds.
  - `state.code` values: `triggered`, `building`, `installing`, `cloning`, `finished`, `cancelled`.
  - `error` is a message if the build failed.

### Builds listing
- Method: GET
- Path: `/api/v3/projects/{project_slug}/builds/`
- Query parameters:
  - `commit` (commit hash)
  - `running` (boolean)
- Response: Paginated list of builds.

### Build triggering
- Method: POST
- Path: `/api/v3/projects/{project_slug}/versions/{version_slug}/builds/`
- Response:
  - JSON with `build`, `project`, `version`.
  - `202 Accepted` when triggered.

## Subprojects

Auth: Token required.

### Subproject details
- Method: GET
- Path: `/api/v3/projects/{project_slug}/subprojects/{alias_slug}/`
- Response fields: `alias`, `child`, `_links.parent`.

### Subprojects listing
- Method: GET
- Path: `/api/v3/projects/{project_slug}/subprojects/`
- Response: Paginated list of subproject relationships.

### Subproject create
- Method: POST
- Path: `/api/v3/projects/{project_slug}/subprojects/`
- Body fields (JSON):
  - `child` (slug)
  - `alias` (optional)
- Response: Subproject relationship object.
- Notes:
  - `child` must be a project the user can access.
  - On Read the Docs for Business, `child` must be in the same organization as the parent project.
  - If `alias` is omitted, the child slug is used.
  - `201 Created` on success.

### Subproject delete
- Method: DELETE
- Path: `/api/v3/projects/{project_slug}/subprojects/{alias_slug}/`
- Response: `204 No Content`.

## Translations

Auth: Token required for private projects; recommended otherwise.

### Translations listing
- Method: GET
- Path: `/api/v3/projects/{project_slug}/translations/`
- Response: Paginated list of project objects (same shape as Project details).

## Redirects

Auth: Token required.

### Redirect details
- Method: GET
- Path: `/api/v3/projects/{project_slug}/redirects/{redirect_id}/`
- Response fields (high level):
  - `pk`, `created`, `modified`, `project`, `from_url`, `to_url`, `type`, `http_status`, `description`, `enabled`, `force`, `position`, `_links`

### Redirects listing
- Method: GET
- Path: `/api/v3/projects/{project_slug}/redirects/`
- Response: Paginated list of redirects.

### Redirect create
- Method: POST
- Path: `/api/v3/projects/{project_slug}/redirects/`
- Body fields (JSON):
  - `from_url`, `to_url`, `type`, `position`
- Notes:
  - `type` values: `page`, `exact`, `clean_url_to_html`, `html_to_clean_url`.
  - `page` and `exact` require `from_url` and `to_url`.
  - `clean_url_to_html` and `html_to_clean_url` do not require `from_url` or `to_url`.
  - `position` starts at `0` and controls ordering.
- Response: Redirect object; `201 Created` on success.

### Redirect update
- Method: PUT
- Path: `/api/v3/projects/{project_slug}/redirects/{redirect_id}/`
- Body fields (JSON):
  - `from_url`, `to_url`, `type`, `position` (as needed)
- Notes:
  - If `position` changes, redirects are reordered.
- Response: Redirect object.

### Redirect delete
- Method: DELETE
- Path: `/api/v3/projects/{project_slug}/redirects/{redirect_id}/`
- Response: `204 No Content`.

## Environment variables

Auth: Token required.

### Environment variable details
- Method: GET
- Path: `/api/v3/projects/{project_slug}/environmentvariables/{environmentvariable_id}/`
- Response fields (high level):
  - `_links`, `created`, `modified`, `pk`, `project`, `public`, `name`

### Environment variables listing
- Method: GET
- Path: `/api/v3/projects/{project_slug}/environmentvariables/`
- Response: Paginated list of environment variables.

### Environment variable create
- Method: POST
- Path: `/api/v3/projects/{project_slug}/environmentvariables/`
- Body fields (JSON):
  - `name`, `value`, `public`
- Notes:
  - `public` is optional; default is `false`.
  - If `public` is `true`, the variable is exposed in pull request builds.
- Response: Environment variable object; `201 Created` on success.

### Environment variable delete
- Method: DELETE
- Path: `/api/v3/projects/{project_slug}/environmentvariables/{environmentvariable_id}/`
- Response: `204 No Content`.

## Organizations (Read the Docs for Business)

Auth: Token required.

### Organizations list
- Method: GET
- Path: `/api/v3/organizations/`
- Response fields (high level):
  - `count`, `next`, `previous`, `results[]`
  - Each result includes `_links` (`_self`, `projects`), `created`, `description`, `disabled`, `email`, `modified`, `name`, `owners`, `slug`, `url`.

### Organization details
- Method: GET
- Path: `/api/v3/organizations/{organization_slug}/`
- Response fields: same as Organizations list entry.

### Organization projects list
- Method: GET
- Path: `/api/v3/organizations/{organization_slug}/projects/`
- Response: Paginated list of project objects scoped to the organization.

### Organization teams list
- Method: GET
- Path: `/api/v3/organizations/{organization_slug}/teams/`
- Query parameters:
  - `expand=members`
- Response fields (high level):
  - `access`, `created`, `modified`, `name`, `slug` (and members when expanded).

## Remote VCS resources

Auth: Token required.

### Remote organization listing
- Method: GET
- Path: `/api/v3/remote/organizations/`
- Query parameters:
  - `name` (contains)
  - `vcs_provider` (`github`, `gitlab`, `bitbucket`)
- Response fields (high level):
  - `avatar_url`, `created`, `modified`, `name`, `pk`, `slug`, `url`, `vcs_provider`.

### Remote repository listing
- Method: GET
- Path: `/api/v3/remote/repositories/`
- Query parameters:
  - `name` (contains)
  - `full_name` (contains full `org/name`)
  - `vcs_provider` (`github`, `gitlab`, `bitbucket`)
  - `organization` (remote organization slug)
  - `expand=remote_organization`
- Response fields (high level):
  - `remote_organization` (when expanded)
  - `projects` (already-imported Read the Docs projects)
  - `avatar_url`, `clone_url`, `created`, `description`, `full_name`, `html_url`, `modified`, `name`, `pk`, `ssh_url`, `vcs`, `vcs_provider`, `default_branch`, `private`, `admin`

## Embed

Auth: Not required.

### Embed content
- Method: GET
- Path: `/api/v3/embed/`
- Query parameters:
  - `url` (required): full document URL, optionally with a fragment.
  - `doctool` (optional): documentation tool key name (currently only `sphinx`).
  - `doctoolversion` (optional): documentation tool version (for example `4.2.0`).
  - `maincontent` (optional): CSS selector for the main content (for example `div#main`).
- Response fields: `url`, `fragment`, `content`, `external`.
- Notes:
  - Content is returned without sanitization; only embed trusted sources.
  - Providing `doctool`, `doctoolversion`, and `maincontent` can improve extraction.
