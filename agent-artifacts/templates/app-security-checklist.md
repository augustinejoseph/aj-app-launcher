# App security checklist
- [ ] Server validates identity and authorizes every protected endpoint.
- [ ] No unrestricted registration or browser-controlled authorization flags.
- [ ] Exact OAuth callbacks; secrets stay server-side; host-only secure sessions.
- [ ] CSRF/CORS policies preserve subdomain trust boundaries.
- [ ] Public registry contains no private data or tokens.
- [ ] Backup/recovery and unauthorized access tests pass.
