# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-04-25

### Changed
- Renamed the plugin to `payload-audit-logs`.
- Renamed the `collection` field to `entity` in the `AuditLogs` collection to avoid potential conflicts with MongoDB reserved keywords.
- Updated audit log hooks and integration tests to use the new `entity` field.
- Cleaned up `package.json` by removing the circular self-dependency.
