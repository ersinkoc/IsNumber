import { describe, it, expect } from 'vitest';
import { isNumber, isNumberStrict, isNumberLoose, type Options } from '../src/index';

describe('isNumber', () => {
  describe('default behavior (strict)', () => {
    it('should return true for finite primitive numbers', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(1)).toBe(true);
      expect(isNumber(-1)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
      expect(isNumber(-3.14)).toBe(true);
      expect(isNumber(0.5)).toBe(true);
      expect(isNumber(1e10)).toBe(true);
      expect(isNumber(1e-10)).toBe(true);
      expect(isNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(isNumber(Number.MIN_SAFE_INTEGER)).toBe(true);
      expect(isNumber(Number.EPSILON)).toBe(true);
    });

    it('should return false for non-finite numbers', () => {
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(false);
      expect(isNumber(-Infinity)).toBe(false);
      expect(isNumber(Number.POSITIVE_INFINITY)).toBe(false);
      expect(isNumber(Number.NEGATIVE_INFINITY)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('5')).toBe(false);
      expect(isNumber('0')).toBe(false);
      expect(isNumber('3.14')).toBe(false);
      expect(isNumber('1e3')).toBe(false);
      expect(isNumber('')).toBe(false);
      expect(isNumber(' ')).toBe(false);
      expect(isNumber('abc')).toBe(false);
      expect(isNumber(true)).toBe(false);
      expect(isNumber(false)).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(isNumber([1])).toBe(false);
      expect(isNumber(Symbol('test'))).toBe(false);
      expect(isNumber(BigInt(123))).toBe(false);
      expect(isNumber(new Date())).toBe(false);
      expect(isNumber(/regex/)).toBe(false);
      expect(isNumber(() => {})).toBe(false);
    });

    it('should return false for boxed numbers', () => {
      expect(isNumber(new Number(5))).toBe(false);
      expect(isNumber(new Number(0))).toBe(false);
      expect(isNumber(new Number(-3.14))).toBe(false);
      expect(isNumber(new Number(NaN))).toBe(false);
      expect(isNumber(new Number(Infinity))).toBe(false);
    });
  });

  describe('with allowBoxed option', () => {
    const options: Options = { allowBoxed: true };

    it('should return true for finite boxed numbers', () => {
      expect(isNumber(new Number(5), options)).toBe(true);
      expect(isNumber(new Number(0), options)).toBe(true);
      expect(isNumber(new Number(-3.14), options)).toBe(true);
      expect(isNumber(new Number(1e10), options)).toBe(true);
    });

    it('should return false for non-finite boxed numbers', () => {
      expect(isNumber(new Number(NaN), options)).toBe(false);
      expect(isNumber(new Number(Infinity), options)).toBe(false);
      expect(isNumber(new Number(-Infinity), options)).toBe(false);
    });

    it('should still work for primitive numbers', () => {
      expect(isNumber(5, options)).toBe(true);
      expect(isNumber(NaN, options)).toBe(false);
    });

    it('should still return false for non-numbers', () => {
      expect(isNumber('5', options)).toBe(false);
      expect(isNumber(true, options)).toBe(false);
      expect(isNumber(null, options)).toBe(false);
    });
  });

  describe('with allowCoercion option', () => {
    const options: Options = { allowCoercion: true };

    it('should return true for valid numeric strings', () => {
      expect(isNumber('0', options)).toBe(true);
      expect(isNumber('5', options)).toBe(true);
      expect(isNumber('-5', options)).toBe(true);
      expect(isNumber('3.14', options)).toBe(true);
      expect(isNumber('-3.14', options)).toBe(true);
      expect(isNumber('0.5', options)).toBe(true);
      expect(isNumber('1e3', options)).toBe(true);
      expect(isNumber('1e-3', options)).toBe(true);
      expect(isNumber(' 5 ', options)).toBe(true);
      expect(isNumber('\t10\n', options)).toBe(true);
    });

    it('should return false for invalid numeric strings', () => {
      expect(isNumber('', options)).toBe(false);
      expect(isNumber(' ', options)).toBe(false);
      expect(isNumber('abc', options)).toBe(false);
      expect(isNumber('5px', options)).toBe(false);
      expect(isNumber('NaN', options)).toBe(false);
      expect(isNumber('Infinity', options)).toBe(false);
      expect(isNumber('-Infinity', options)).toBe(false);
      expect(isNumber('1,000', options)).toBe(false);
      expect(isNumber('1 2 3', options)).toBe(false);
    });

    it('should still work for primitive numbers', () => {
      expect(isNumber(5, options)).toBe(true);
      expect(isNumber(NaN, options)).toBe(false);
    });

    it('should still return false for non-strings and non-numbers', () => {
      expect(isNumber(true, options)).toBe(false);
      expect(isNumber(null, options)).toBe(false);
      expect(isNumber(undefined, options)).toBe(false);
      expect(isNumber({}, options)).toBe(false);
      expect(isNumber([], options)).toBe(false);
    });
  });

  describe('with both options enabled', () => {
    const options: Options = { allowBoxed: true, allowCoercion: true };

    it('should handle all valid cases', () => {
      expect(isNumber(5, options)).toBe(true);
      expect(isNumber('5', options)).toBe(true);
      expect(isNumber(new Number(5), options)).toBe(true);
    });

    it('should reject all invalid cases', () => {
      expect(isNumber(NaN, options)).toBe(false);
      expect(isNumber('NaN', options)).toBe(false);
      expect(isNumber(new Number(NaN), options)).toBe(false);
      expect(isNumber(Infinity, options)).toBe(false);
      expect(isNumber('Infinity', options)).toBe(false);
      expect(isNumber(new Number(Infinity), options)).toBe(false);
    });
  });
});

describe('isNumberStrict', () => {
  it('should only accept finite primitive numbers', () => {
    expect(isNumberStrict(5)).toBe(true);
    expect(isNumberStrict(0)).toBe(true);
    expect(isNumberStrict(-3.14)).toBe(true);
    expect(isNumberStrict(1e10)).toBe(true);
  });

  it('should reject everything else', () => {
    expect(isNumberStrict(NaN)).toBe(false);
    expect(isNumberStrict(Infinity)).toBe(false);
    expect(isNumberStrict('5')).toBe(false);
    expect(isNumberStrict(new Number(5))).toBe(false);
    expect(isNumberStrict(true)).toBe(false);
    expect(isNumberStrict(null)).toBe(false);
    expect(isNumberStrict(undefined)).toBe(false);
  });
});

describe('isNumberLoose', () => {
  it('should accept all valid number representations', () => {
    expect(isNumberLoose(5)).toBe(true);
    expect(isNumberLoose('5')).toBe(true);
    expect(isNumberLoose(new Number(5))).toBe(true);
    expect(isNumberLoose(' 3.14 ')).toBe(true);
    expect(isNumberLoose('1e3')).toBe(true);
  });

  it('should reject invalid values', () => {
    expect(isNumberLoose(NaN)).toBe(false);
    expect(isNumberLoose('NaN')).toBe(false);
    expect(isNumberLoose(new Number(NaN))).toBe(false);
    expect(isNumberLoose(Infinity)).toBe(false);
    expect(isNumberLoose('abc')).toBe(false);
    expect(isNumberLoose(true)).toBe(false);
    expect(isNumberLoose(null)).toBe(false);
    expect(isNumberLoose({})).toBe(false);
  });
});

describe('edge cases', () => {
  it('should handle special numeric values', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-0)).toBe(true);
    expect(isNumber(Number.MIN_VALUE)).toBe(true);
    expect(isNumber(Number.MAX_VALUE)).toBe(true);
  });

  it('should handle objects with valueOf', () => {
    const obj = {
      valueOf() { return 5; }
    };
    expect(isNumber(obj)).toBe(false);
    expect(isNumber(obj, { allowCoercion: true })).toBe(false);
  });

  it('should handle objects with toString', () => {
    const obj = {
      toString() { return '5'; }
    };
    expect(isNumber(obj)).toBe(false);
    expect(isNumber(obj, { allowCoercion: true })).toBe(false);
  });

  it('should handle arrays correctly', () => {
    expect(isNumber([5])).toBe(false);
    expect(isNumber([5], { allowCoercion: true })).toBe(false);
    expect(isNumber(['5'])).toBe(false);
    expect(isNumber(['5'], { allowCoercion: true })).toBe(false);
  });
});