import { Bench } from 'tinybench';
import { isNumber, isNumberStrict, isNumberLoose } from '../src/index';

// Mock implementations of popular libraries for comparison
const isNumberLodash = (value: unknown): boolean => {
  return typeof value === 'number' && value === value && value !== Infinity && value !== -Infinity;
};

const isNumberNpm = (value: unknown): boolean => {
  if (typeof value === 'number') {
    return value - value === 0;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+value) : isFinite(+value);
  }
  return false;
};

// Test data
const testCases = [
  { name: 'primitive number', value: 42 },
  { name: 'zero', value: 0 },
  { name: 'negative number', value: -3.14 },
  { name: 'string number', value: '123' },
  { name: 'string float', value: '3.14' },
  { name: 'string scientific', value: '1e10' },
  { name: 'empty string', value: '' },
  { name: 'non-numeric string', value: 'abc' },
  { name: 'NaN', value: NaN },
  { name: 'Infinity', value: Infinity },
  { name: 'boxed number', value: new Number(5) },
  { name: 'boolean true', value: true },
  { name: 'boolean false', value: false },
  { name: 'null', value: null },
  { name: 'undefined', value: undefined },
  { name: 'empty object', value: {} },
  { name: 'empty array', value: [] },
  { name: 'array with number', value: [1] },
];

async function runBenchmarks() {
  console.log('Running benchmarks...\n');

  for (const testCase of testCases) {
    const bench = new Bench({ time: 1000 });

    bench
      .add('@oxog/isNumber (strict)', () => {
        isNumberStrict(testCase.value);
      })
      .add('@oxog/isNumber (default)', () => {
        isNumber(testCase.value);
      })
      .add('@oxog/isNumber (loose)', () => {
        isNumberLoose(testCase.value);
      })
      .add('lodash.isNumber', () => {
        isNumberLodash(testCase.value);
      })
      .add('is-number (npm)', () => {
        isNumberNpm(testCase.value);
      });

    await bench.run();

    console.log(`Test case: ${testCase.name}`);
    console.log(`Value: ${JSON.stringify(testCase.value)}`);
    console.log('Results:');
    
    const results = bench.table();
    results.forEach(result => {
      console.log(`  ${result.name}: ${result.ops}/s (±${result.rme.toFixed(2)}%)`);
    });
    
    console.log('');
  }

  // Overall benchmark with mixed data
  console.log('Overall benchmark (mixed data):');
  const overallBench = new Bench({ time: 2000 });

  overallBench
    .add('@oxog/isNumber (strict)', () => {
      testCases.forEach(tc => isNumberStrict(tc.value));
    })
    .add('@oxog/isNumber (default)', () => {
      testCases.forEach(tc => isNumber(tc.value));
    })
    .add('@oxog/isNumber (loose)', () => {
      testCases.forEach(tc => isNumberLoose(tc.value));
    })
    .add('lodash.isNumber', () => {
      testCases.forEach(tc => isNumberLodash(tc.value));
    })
    .add('is-number (npm)', () => {
      testCases.forEach(tc => isNumberNpm(tc.value));
    });

  await overallBench.run();
  
  console.log('\nOverall Results:');
  const overallResults = overallBench.table();
  overallResults.forEach(result => {
    console.log(`  ${result.name}: ${result.ops}/s (±${result.rme.toFixed(2)}%)`);
  });
}

runBenchmarks().catch(console.error);