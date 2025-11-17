# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **[BUG-001]** Fixed inconsistent numeric literal string coercion behavior
  - Now correctly blocks octal (`0o`/`0O`) and binary (`0b`/`0B`) strings when `allowCoercion: true`
  - Previously only blocked hexadecimal (`0x`/`0X`) strings
  - Prevents validation bypasses in security-sensitive contexts
  - See `BUG_ANALYSIS.md` for details

### Added
- Comprehensive test coverage for octal and binary string literals
  - Added 14 new test cases covering all numeric literal edge cases
  - Enhanced test suite with whitespace and sign prefix variations
  - Tests now cover: hexadecimal, octal, binary with all case variations

### Changed
- Improved `build:cjs` script robustness with file existence checking
- Updated development dependencies for security:
  - `vitest`: 1.x → 4.0.10
  - `@vitest/coverage-v8`: 1.x → 4.0.10
  - Resolved 2 moderate severity CVEs (GHSA-67mh-4wv8-2f99, GHSA-g4jq-h2w9-997c)

### Security
- **Zero vulnerabilities** (down from 2 moderate severity CVEs)
- Fixed esbuild vulnerability (CVSS 5.3)
- Fixed multiple vite path traversal vulnerabilities

## [1.0.2] - 2024-XX-XX

### Fixed
- Disallowed hexadecimal string coercion for consistency

## [1.0.1] - 2024-XX-XX

### Initial Release
- Basic `isNumber()` function with options support
- TypeScript support with full type definitions
- Zero runtime dependencies
- Three API variants: `isNumber()`, `isNumberStrict()`, `isNumberLoose()`

[Unreleased]: https://github.com/ersinkoc/isnumber/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/ersinkoc/isnumber/releases/tag/v1.0.2
[1.0.1]: https://github.com/ersinkoc/isnumber/releases/tag/v1.0.1
