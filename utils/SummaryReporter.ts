import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';

type FailedTest = { title: string; error: string };

export default class SummaryReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private failures: FailedTest[] = [];

  onBegin(_config: FullConfig, suite: Suite) {
    console.log(`\nStarting ${suite.allTests().length} tests...\n`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed') {
      this.passed++;
    } else {
      this.failed++;
      this.failures.push({
        title: test.titlePath().join(' › '),
        error: result.errors[0]?.message?.split('\n')[0] ?? 'unknown error',
      });
    }
  }

  onEnd(result: FullResult) {
    console.log('\n── Summary ──────────────────────────────');
    console.log(`  Passed:  ${this.passed}`);
    console.log(`  Failed:  ${this.failed}`);
    console.log(`  Status:  ${result.status}`);

    if (this.failures.length > 0) {
      console.log('\n  Failed tests:');
      for (const f of this.failures) {
        console.log(`    ✗ ${f.title}`);
        console.log(`      ${f.error}`);
      }
    }

    console.log('─────────────────────────────────────────\n');
  }
}
