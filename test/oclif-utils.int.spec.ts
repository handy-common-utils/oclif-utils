import { expect } from 'chai';
import * as fs from 'node:fs';
import { $, path, ProcessOutput } from 'zx';

function runWithinDir(dir: string): (cmd: string) => Promise<ProcessOutput> {
  function withinPrj(cmd: string): Promise<ProcessOutput> {
    return $`cd ${dir} && node -v && ${cmd.split(' ')}`.catch((error) => error);
  }
  return withinPrj;
}

describe('OclifUtils used in test projects', () => {
  for (const v of ['2', '3', '4', '5']) {
    describe(`(v${v}) simple-cli-prj-v${v}`, () => {
      const prjDir = `test/simple-cli-prj-v${v}`;
      const runWithinPrj = runWithinDir(prjDir);

      it (`(v${v}) test fixture project has the correct @oclif/core version`, async function() {
        // eslint-disable-next-line unicorn/no-this-outside-of-class
        this.timeout(60000);
        await runWithinPrj('rm -rf node_modules');
        const ciOutcome = await runWithinPrj('npm ci');
        expect(ciOutcome.exitCode).to.equal(0, `npm ci failed with exit code ${ciOutcome.exitCode} and stderr: ${ciOutcome.stderr}`);
        const lsOutcome = await runWithinPrj('npm list @oclif/core');
        const version = lsOutcome.stdout.split(/[\n\r]+/, 10).find((line) => line.includes('@oclif/core'))?.trim().split('@oclif/core@', 2)[1];
        expect(version).to.match(new RegExp(`^${v}` + String.raw`\.`), `Expected @oclif/core version to start with ${v}. ${lsOutcome.stdout}`);

        // Copy files into node_modules directory to simulate a local install of oclif-utils
        const oclifUtilsDir = path.join(prjDir, 'node_modules/@handy-common-utils/oclif-utils');
        fs.rmSync(oclifUtilsDir, { recursive: true, force: true });
        fs.mkdirSync(oclifUtilsDir, { recursive: true });
        fs.cpSync('dist', `${oclifUtilsDir}`, { recursive: true });
        fs.cpSync('package.json', `${oclifUtilsDir}/package.json`);
      });

      it(`(v${v}) handles missing required arg`, async () => {
        const outcome = await runWithinPrj('./bin/run');
        expect(outcome.exitCode).to.equal(2);
        expect(outcome.stderr).to.contain('Missing 1 required arg');
      });

      it(`(v${v}) handles missing required flag`, async () => {
        const outcome = await runWithinPrj('./bin/run me');
        expect(outcome.exitCode).to.equal(2);
        expect(outcome.stderr).to.contain('Missing required flag');
      });

      it(`(v${v}) handles happy case`, async () => {
        const outcome = await runWithinPrj('./bin/run me --from myself');
        expect(outcome.exitCode).to.equal(0);
        expect(outcome.stdout).to.contain('Hello to me from myself');
      });

      it(`(v${v}) handles happy case with --gen`, async () => {
        const outcome = await runWithinPrj('./bin/run me --gen --from myself');
        expect(outcome.exitCode).to.equal(0);
        expect(outcome.stdout).to.contain('simple-cli-prj me --from myself --gen');
      });

      for (const arg of ['-h', '--help']) {
        it(`(v${v}) prints help when there is only ${arg}`, async () => {
          const outcome = await runWithinPrj(`./bin/run ${arg}`);
          expect(outcome.exitCode).to.equal(0);
          expect(outcome.stdout).to.contain('USAGE');
          expect(outcome.stdout).to.contain('$ simple-cli-prj   PERSON');
          expect(outcome.stdout).to.contain('ARGUMENTS');
          expect(outcome.stdout).to.contain('FLAGS');
          expect(outcome.stdout).to.contain('-f,');
          expect(outcome.stdout).to.contain('-g,');
          expect(outcome.stdout).to.contain('-h,');
          expect(outcome.stdout).to.not.contain('update-readme.md');
          expect(outcome.stdout).to.contain('DESCRIPTION');
          expect(outcome.stdout).to.contain('EXAMPLES');
          expect(outcome.stdout).to.contain('$ simple-cli-prj hello friend --from oclif');
        });
      }

      it(`(v${v}) does not print help when it is not the only argument`, async () => {
        const outcome = await runWithinPrj('./bin/run me -h');
        expect(outcome.exitCode).to.equal(2);
        expect(outcome.stderr).to.contain('Missing required flag');
      });

      for (const arg of ['-v', '--version']) {
        it(`(v${v}) prints version info when there is only ${arg}`, async () => {
          const outcome = await runWithinPrj(`./bin/run ${arg}`);
          expect(outcome.exitCode).to.equal(0);
          expect(outcome.stdout).to.contain('simple-cli-prj/3.0.1');
        });
      }

      it(`(v${v}) updates README.md when there is only --update-readme.md`, async () => {
        const readmeFile = `test/simple-cli-prj-v${v}/README.md`;
        fs.writeFileSync(readmeFile, '# Sample README\n## Manual\n<!-- help start -->\n<!-- help end -->\n');

        const outcome = await runWithinPrj('./bin/run --update-readme.md');
        expect(outcome.exitCode).to.equal(0);

        const readmeFileContent = fs.readFileSync(readmeFile, 'utf8');
        expect(readmeFileContent).to.contain('# Sample README');
        expect(readmeFileContent).to.contain('USAGE');
        expect(readmeFileContent).to.contain('ARGUMENTS');
        expect(readmeFileContent).to.contain('FLAGS');
        expect(readmeFileContent).to.contain('-f,');
        expect(readmeFileContent).to.contain('-g,');
        expect(readmeFileContent).to.contain('-h,');
        expect(readmeFileContent).to.not.contain('update-readme.md');
        expect(readmeFileContent).to.contain('DESCRIPTION');
        expect(readmeFileContent).to.contain('EXAMPLES');
      });
    });
  }
});
