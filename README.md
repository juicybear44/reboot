Under Construction: Bee back soon!

## Navbar browser regression tests

```sh
npm ci
npx playwright install chromium
npm run test:navbar
```

The tests start a local Vite server automatically and check desktop hover and
mobile touch dropdowns above the landing-page artwork, with the animated bear
both hidden and visible. They also verify link navigation, Escape, and outside
press behavior. Failure screenshots and traces go into ignored `test-results/`.
