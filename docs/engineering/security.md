# Security and authority boundaries

Security is enforced at the actual server/data/media boundary; client guards prevent
misleading display/actions but do not grant permission. Keep authority, access
policy and public projection explicit per endpoint. Apply additional controls
when the feature needs them, not by inventing unrelated security subsystems.

## Authority table

| Kind                   | Contract                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Public credential-free | No ambient session cookies/bearer/CSRF/alternate headers or user refresh            |
| User session           | Existing authentication, current account policy, role/ownership and applicable CSRF |
| Narrow credential      | Only its declared authority; no fallback to a broader signed-in session             |
| Mixed authority        | Explicit protocol/priority and evidence for every accepted combination              |

Authentication establishes identity; services enforce object eligibility close to
the operation. Use current server-authoritative roles/status, not UI claims or a
submitted owner ID. Choose 404 versus 403 according to existence privacy and keep
the choice consistent across endpoints and direct media.

GET/read/copy/share must not perform business commands. Unsafe cookie-auth writes
retain applicable CSRF protection. Rate limits use bounded policies and safe keys;
verify actual store/process scope. Public anti-abuse forms may use honeypots only
under an accepted neutral-response/no-write contract.

## Secrets and cryptography

Passwords use the existing appropriate password-hash primitive; token hashing is
not a password-hashing substitute. Store high-entropy verification credentials as
hashes when recovery is unnecessary. Encrypt a recoverable copy only when approved
business behavior requires it.

If encryption is needed, use a maintained authenticated primitive, correct random
nonce, versioned format, validated key sizes and entity-bound associated data.
Mismatched context must fail. Never retry unrelated database uniqueness errors as
token collisions. Bound genuine collision retries and expose a stable safe failure.

Preserve the current session protocol. Do not store access tokens in browser storage
or create parallel refresh owners. Rotate/revoke according to the server contract.
Refresh revocation alone does not revoke every already-issued stateless access token;
do not promise stronger semantics without implementing them.

## Error and log privacy

Allowlist public output and errors. Never return raw persistence/provider objects,
stack traces or private fields. Redact credentials/cookies/CSRF/passwords, sensitive
bodies, ciphertext and secret-bearing paths in request/response logs and envelopes.
Unknown error objects can retain config, URL, headers or bodies even when their
display message looks safe.

Frontend errors must be sanitized before sensitive query/mutation caches receive
them. The [frontend safe-error example](frontend-standard.md) shows an allowlisted
projection. Test absence across keys/meta/variables/data/errors; gcTime/reset and
display-time normalization alone do not make raw storage safe.

Return paths reject external/protocol-relative/backslash/control/credential-bearing
values, including sensitive path segments/fragments. Secrets must not leak through
server-component props, analytics, DOM fields, storage, build artifacts or telemetry.
Legitimate password input/one-time presentation is transient and cleared according
to the operation, not copied into persistent caches.

## Async access and browser credential flows

Follow F08/F27's per-resource/session denial owner: transient errors/cache writes/
remounts/old responses cannot undo denial. Only a newer matching authoritative GET
may recover. Independent parent/child resources and clients remain independent.
Use actual handler checks after asynchronous validation, not only disabled UI.

For credential URLs, specify bootstrap, history and canonical sharing deliberately.
Set/verify appropriate no-store/no-referrer/noindex policies on all relevant
documents/redirects. URL cleanup cannot undo upstream logs already written.
Check actual adapter headers and browser Referer/cookies; an API option does not
prove interceptor-level authority isolation.

## Media and external integrations

Validate ownership/access, actual decoded format, byte/pixel/resource bounds and
path containment. Server generates storage paths. Separate public assets from
protected content; page props/API/direct media must agree. Define replacement,
partial failure and safe cleanup. Implement ranges only for supported streaming
requirements, with correct bounds.

Render rich text/comments through an explicit safe representation/sanitization
boundary. A shared access policy prevents API/media/view drift. External scripts/
provider handoffs do not prove delivery or business completion.

## Review evidence

Use sentinel credentials/private values and assert absence in public output, logs,
caches and artifacts where relevant. Exercise wrong owner/role/inactive account,
malformed redirects, direct protected media, stale/duplicate commands and alternate
authority headers. Real browser/provider/deployment claims need their own evidence.

Relevant rules: B12–B23/B29/B30/B39–B42, F03–F05/F08/F12–F21/F25–F27/F31.
