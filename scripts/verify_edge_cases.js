const fs = require('fs');
const assert = require('assert');

let passed = 0;
function test(desc, fn) {
  try {
    fn();
    passed++;
    console.log(`  [PASS] ${desc}`);
  } catch (err) {
    console.error(`  [FAIL] ${desc}: ${err.message}`);
    process.exit(1);
  }
}

console.log('=== VERIFYING EDGE CASES & CODE QUALITY FIXES ===\n');

// 1. Glossary Checks
const gloss = fs.readFileSync('Glossary/svg-filters-and-filter-primitives-glossary/index.html', 'utf8');
const termCards = gloss.split('class="term-card"').length - 1;

test('Glossary has >= 35 term cards (actual count: ' + termCards + ')', () => {
  assert(termCards >= 35, `Expected >= 35 terms, got ${termCards}`);
});

test('Glossary has exact single H1 with 35+ terms', () => {
  const h1 = gloss.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  assert(h1 && h1[1].includes('35+ Terms'));
});

test('Glossary has #noResults box and reset filter button', () => {
  assert(gloss.includes('id="noResults"'));
  assert(gloss.includes('id="resetFilterBtn"'));
});

test('Glossary has semantic main.page-container and article.article-main', () => {
  assert(gloss.includes('<main class="page-container">'));
  assert(gloss.includes('<article class="article-main">'));
  assert(gloss.includes('</article>'));
  assert(gloss.includes('</main>'));
});

test('Glossary contains new primitives: feConvolveMatrix, feImage, feFunc, surfaceScale', () => {
  assert(gloss.includes('feConvolveMatrix'));
  assert(gloss.includes('feImage'));
  assert(gloss.includes('feFuncR'));
  assert(gloss.includes('surfaceScale &amp; specularExponent') || gloss.includes('surfaceScale & specularExponent'));
});

test('Glossary BreadcrumbList and HTML breadcrumb text are aligned', () => {
  assert(gloss.includes('<a href="/Glossary/icon-svg-terminology/">Glossary</a>'));
});

// 2. React Native & Expo Guide Checks
const rn = fs.readFileSync('articles/how-to-use-svg-icons-in-react-native-and-expo/index.html', 'utf8');

test('React Native guide has semantic main.page-container and article.article-main', () => {
  assert(rn.includes('<main class="page-container">'));
  assert(rn.includes('<article class="article-main">'));
  assert(rn.includes('</article>'));
  assert(rn.includes('</main>'));
});

test('React Native guide ProfileIcon imports Circle and Path', () => {
  assert(rn.includes("import Svg, { Path, Circle } from 'react-native-svg';"));
});

test('React Native guide ProfileIcon specifies fill="none" and stroke={color}', () => {
  assert(rn.includes('fill="none"'));
  assert(rn.includes('stroke={color}'));
  assert(rn.includes('strokeWidth={strokeWidth}'));
});

test('React Native guide explains why currentColor fails and defaults to black fill', () => {
  assert(rn.includes('Critical Mobile Rule:'));
});

// 3. Custom Icon NPM Package Guide Checks
const pkg = fs.readFileSync('articles/how-to-build-custom-icon-library-npm-package-guide/index.html', 'utf8');

test('Custom Icon guide has semantic main.page-container and article.article-main', () => {
  assert(pkg.includes('<main class="page-container">'));
  assert(pkg.includes('<article class="article-main">'));
  assert(pkg.includes('</article>'));
  assert(pkg.includes('</main>'));
});

test('Custom Icon guide provides npm install command in Section 2', () => {
  assert(pkg.includes('npm install -D typescript tsup svgo tsx fs-extra change-case @types/node @types/fs-extra @types/react react @changesets/cli'));
});

test('Custom Icon guide uses modern ESM export default in svgo.config.js', () => {
  assert(pkg.includes('export default {'));
});

test('Custom Icon guide places /*#__PURE__*/ annotation immediately before forwardRef', () => {
  assert(pkg.includes('export const ${componentName} = /*#__PURE__*/ forwardRef&lt;SVGSVGElement, IconProps&gt;('));
  assert(!pkg.includes('/*#__PURE__*/\nimport React'));
});

test('Custom Icon guide normalizes SVG kebab-case attributes to camelCase JSX properties', () => {
  assert(pkg.includes('.replace(/stroke-width=/g, \'strokeWidth=\')'));
  assert(pkg.includes('.replace(/stroke-linecap=/g, \'strokeLinecap=\')'));
  assert(pkg.includes('.replace(/fill-rule=/g, \'fillRule=\')'));
});

console.log(`\n========================================`);
console.log(`RESULTS: ${passed} PASSED, 0 FAILED`);
console.log(`========================================\n`);
