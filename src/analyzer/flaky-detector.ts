
import fs from 'node:fs';
import crypto from 'node:crypto';

const reportPath = 'data/test-results.json';
const summaryPath = 'data/summary.json';
const historyPath = 'data/history.json';

if (!fs.existsSync(reportPath)) {
  console.error(`Report not found: ${reportPath}`);
  process.exit(1);
}

const reportText = fs.readFileSync(reportPath, 'utf-8');
const report = JSON.parse(reportText);

let passed = 0;
let flaky = 0;
let failed = 0;

const tests: {
  name: string;
  browser: string;
  status: string;
  retries: number;
}[] = [];

function analyzeSuites(suites: any[], parentProject = 'unknown') {
  for (const suite of suites) {
    const projectName = suite.title || parentProject;

    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        const status = test.status;
        const results = test.results ?? [];

        const retries = results.filter(
          (result: { retry?: number }) => (result.retry ?? 0) > 0
        ).length;

        if (status === 'flaky') {
          flaky++;
        } else if (status === 'unexpected') {
          failed++;
        } else if (status === 'expected') {
          passed++;
        } else {
          continue;
        }

        tests.push({
          name: spec.title,
          browser: test.projectName ?? projectName,
          status,
          retries,
        });
      }
    }

    analyzeSuites(suite.suites ?? [], projectName);
  }
}

analyzeSuites(report.suites ?? []);

const total = passed + flaky + failed;
const flakyRate = total > 0
  ? Number((flaky / total * 100).toFixed(1))
  : 0;

const updatedAt = new Date().toISOString();

const summary = {
  passed,
  flaky,
  failed,
  total,
  flakyRate,
  updatedAt,
  tests,
};

fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

const history = fs.existsSync(historyPath)
  ? JSON.parse(fs.readFileSync(historyPath, 'utf-8'))
  : [];

// Build a stable fingerprint from the test outcomes, not the full report.
const fingerprint = tests
  .map(test => ({
    name: test.name,
    browser: test.browser,
    status: test.status,
    retries: test.retries,
  }))
  .sort((a, b) =>
    `${a.browser}:${a.name}`.localeCompare(`${b.browser}:${b.name}`)
  );

const runId = crypto
  .createHash('sha256')
  .update(JSON.stringify(fingerprint))
  .digest('hex')
  .slice(0, 12);

const alreadySaved = history.some(
  (run: { runId?: string }) => run.runId === runId
);

if (!alreadySaved) {
  history.push({
    runId,
    updatedAt,
    passed,
    flaky,
    failed,
    total,
    flakyRate,
  });

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  console.log(`Saved run ${runId} to history`);
} else {
  console.log(`Run ${runId} has the same test outcomes as a saved run`);
}

console.log('\nTest summary');
console.log(`Passed: ${passed}`);
console.log(`Flaky: ${flaky}`);
console.log(`Failed: ${failed}`);
console.log(`Flaky rate: ${flakyRate}%`);
console.log(`Total test executions: ${total}`);
