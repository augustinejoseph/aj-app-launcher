# Ecosystem documentation
Canonical cross-app architecture and integration decisions. App implementation details remain in each app repository.

- [Overview](ecosystem/overview.md), [inventory](ecosystem/application-inventory.md), [registry](ecosystem/application-registry-schema.md)
- [Naming](ecosystem/naming-conventions.md), [DNS](ecosystem/domain-and-dns.md), [deployment](ecosystem/deployment-architecture.md)
- [Launcher](architecture/launcher-design.md), [shared component](architecture/shared-component.md)
- [Authentication](architecture/authentication-and-sso.md), [identity](architecture/identity-and-user-models.md), [security](architecture/security-model.md), [data](architecture/database-and-storage-conventions.md)
- [Onboarding](integration/onboarding-a-new-app.md), [menu integration](integration/integrate-launcher-component.md), [Google setup](integration/configure-google-auth.md), [environment](integration/environment-variables.md), [release](integration/release-checklist.md), [validation](integration/validation.md), [future SSO](integration/future-keycloak-sso.md)
- [Repository decision](decisions/ADR-001-independent-repositories.md), [registry decision](decisions/ADR-002-central-app-registry.md), [identity decision](decisions/ADR-003-google-authentication.md)
- [App specification](templates/new-app-spec.md), [security](templates/app-security-checklist.md), [integration](templates/app-integration-checklist.md)

[Local Docker development and Vercel production](integration/local-docker.md).
