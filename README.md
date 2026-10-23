\# FlakeGuard



\*\*Playwright Test Reliability Dashboard\*\*



FlakeGuard is a QA automation portfolio project built with Playwright and TypeScript. It analyzes automated test results, identifies flaky tests, and visualizes test reliability across Chromium, Firefox, and WebKit.



\## Features



\- Cross-browser test automation with Playwright

\- Detection of flaky tests using retry results

\- Test summaries: passed, flaky, and failed

\- Flaky test details by browser and retry count

\- Historical flaky-rate visualization

\- JSON-based test result and history storage

\- GitHub Actions CI workflow



\## Tech Stack



\- TypeScript

\- Playwright

\- Node.js

\- HTML, CSS, JavaScript

\- GitHub Actions



\## Getting Started



\### Prerequisites



\- Node.js

\- npm



\### Installation



```bash

git clone https://github.com/Fardinkh740/FlakeGuard.git

cd FlakeGuard

npm ci

npx playwright install

```



\### Run tests and analyze results



```bash

npm run test:analyze

```



\### Start the dashboard



```bash

npm run dashboard

```



Open http://localhost:3000 in your browser.



\## Demo Note



The `temporary flaky test` is intentionally designed to fail on its first attempt and pass on retry. It demonstrates how FlakeGuard identifies flaky tests. It is a demonstration scenario, not a production test.



\## Project Goal



The goal of FlakeGuard is to demonstrate practical QA automation skills, test result analysis, cross-browser testing, and CI integration.



\## Author



Fardin Khan — Senior QA Automation Engineer



\[GitHub](https://github.com/Fardinkh740)



