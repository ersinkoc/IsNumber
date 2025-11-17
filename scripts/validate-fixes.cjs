#!/usr/bin/env node
/**
 * Validation script for bug fixes
 *
 * This script verifies that all bugs identified in the comprehensive
 * repository analysis have been properly fixed.
 *
 * Run with: node scripts/validate-fixes.js
 */

const { isNumber, isNumberStrict, isNumberLoose } = require('../dist/index.cjs');

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, description) {
  if (condition) {
    passed++;
    console.log(`✓ ${description}`);
  } else {
    failed++;
    failures.push(description);
    console.error(`✗ ${description}`);
  }
}

console.log('='.repeat(70));
console.log('Bug Fix Validation Script');
console.log('='.repeat(70));
console.log();

// BUG-001: Validation for inconsistent numeric literal coercion fix
console.log('BUG-001: Validating numeric literal coercion consistency');
console.log('-'.repeat(70));

// Hexadecimal strings - should be blocked (original behavior)
assert(
  isNumber('0xFF', { allowCoercion: true }) === false,
  'Hexadecimal lowercase (0xFF) should be blocked'
);
assert(
  isNumber('0XFF', { allowCoercion: true }) === false,
  'Hexadecimal uppercase (0XFF) should be blocked'
);
assert(
  isNumber('-0xFF', { allowCoercion: true }) === false,
  'Negative hexadecimal (-0xFF) should be blocked'
);
assert(
  isNumber('+0xFF', { allowCoercion: true }) === false,
  'Positive hexadecimal (+0xFF) should be blocked'
);

// Octal strings - should NOW be blocked (FIX)
assert(
  isNumber('0o10', { allowCoercion: true }) === false,
  'Octal lowercase (0o10) should be blocked [FIXED]'
);
assert(
  isNumber('0O10', { allowCoercion: true }) === false,
  'Octal uppercase (0O10) should be blocked [FIXED]'
);
assert(
  isNumber('-0o10', { allowCoercion: true }) === false,
  'Negative octal (-0o10) should be blocked [FIXED]'
);
assert(
  isNumber('+0o10', { allowCoercion: true }) === false,
  'Positive octal (+0o10) should be blocked [FIXED]'
);
assert(
  isNumber(' 0o10 ', { allowCoercion: true }) === false,
  'Octal with whitespace ( 0o10 ) should be blocked [FIXED]'
);

// Binary strings - should NOW be blocked (FIX)
assert(
  isNumber('0b10', { allowCoercion: true }) === false,
  'Binary lowercase (0b10) should be blocked [FIXED]'
);
assert(
  isNumber('0B10', { allowCoercion: true }) === false,
  'Binary uppercase (0B10) should be blocked [FIXED]'
);
assert(
  isNumber('-0b10', { allowCoercion: true }) === false,
  'Negative binary (-0b10) should be blocked [FIXED]'
);
assert(
  isNumber('+0b10', { allowCoercion: true }) === false,
  'Positive binary (+0b10) should be blocked [FIXED]'
);
assert(
  isNumber(' 0b10 ', { allowCoercion: true }) === false,
  'Binary with whitespace ( 0b10 ) should be blocked [FIXED]'
);

// Decimal strings - should still work (regression check)
assert(
  isNumber('123', { allowCoercion: true }) === true,
  'Decimal string (123) should be allowed [REGRESSION]'
);
assert(
  isNumber('3.14', { allowCoercion: true }) === true,
  'Decimal float string (3.14) should be allowed [REGRESSION]'
);
assert(
  isNumber('1e10', { allowCoercion: true }) === true,
  'Scientific notation string (1e10) should be allowed [REGRESSION]'
);
assert(
  isNumber(' 42 ', { allowCoercion: true }) === true,
  'Decimal with whitespace ( 42 ) should be allowed [REGRESSION]'
);

console.log();
console.log('General Functionality Validation');
console.log('-'.repeat(70));

// Verify original functionality still works
assert(
  isNumber(5) === true,
  'Primitive number (5) should be valid'
);
assert(
  isNumber(NaN) === false,
  'NaN should be invalid'
);
assert(
  isNumber(Infinity) === false,
  'Infinity should be invalid'
);
assert(
  isNumber('5') === false,
  'String without coercion should be invalid'
);
assert(
  isNumber(new Number(5)) === false,
  'Boxed number without allowBoxed should be invalid'
);
assert(
  isNumber(new Number(5), { allowBoxed: true }) === true,
  'Boxed number with allowBoxed should be valid'
);

// Test strict and loose variants
assert(
  isNumberStrict(5) === true,
  'isNumberStrict should accept primitive numbers'
);
assert(
  isNumberStrict('5') === false,
  'isNumberStrict should reject strings'
);
assert(
  isNumberLoose('5') === true,
  'isNumberLoose should accept numeric strings'
);
assert(
  isNumberLoose(new Number(5)) === true,
  'isNumberLoose should accept boxed numbers'
);

console.log();
console.log('='.repeat(70));
console.log('Validation Results');
console.log('='.repeat(70));
console.log(`✓ Passed: ${passed}`);
console.log(`✗ Failed: ${failed}`);

if (failed > 0) {
  console.log();
  console.log('Failed Tests:');
  failures.forEach(f => console.log(`  - ${f}`));
  console.log();
  console.error('❌ VALIDATION FAILED');
  process.exit(1);
} else {
  console.log();
  console.log('✅ ALL VALIDATIONS PASSED - Bugs successfully fixed!');
  process.exit(0);
}
