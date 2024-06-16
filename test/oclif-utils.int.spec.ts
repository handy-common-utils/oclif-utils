import { expect } from 'chai';
import * as fs from 'node:fs';
import { $, ProcessOutput } from 'zx';

function runWithinDir(dir: string): (cmd: string) => Promise<ProcessOutput> {
  function withinPrj(cmd: string): Promise<ProcessOutput> {
    return $`cd ${dir} && ${cmd.split(' ')}`.catch((error) => error);
  }
  return withinPrj;
}

describe('OclifUtils used in test projects', () => {
  for (const v of ['2', '3', '4']) {
    describe(`simple-cli-prj-v${v}`, () => {
      const runWithinPrj = runWithinDir(`test/simple-cli-prj-v${v}`);
  
      before(async () => {
        const outcome = await runWithinPrj('rm -rf node_modules && npm ci');
        expect(outcome.exitCode).to.equal(0);
      });
  
      it('handles missing required arg', async () => {
        const outcome = await runWithinPrj('./bin/run');
        expect(outcome.exitCode).to.equal(2);
        expect(outcome.stderr).to.contain('Missing 1 required arg');
      });
  
      it('handles missing required flag', async () => {
        const outcome = await runWithinPrj('./bin/run me');
        expect(outcome.exitCode).to.equal(2);
        expect(outcome.stderr).to.contain('Missing required flag');
      });
  
      it('handles happy case', async () => {
        const outcome = await runWithinPrj('./bin/run me --from myself');
        expect(outcome.exitCode).to.equal(0);
        expect(outcome.stdout).to.contain('Hello to me from myself');
      });
  
      it('handles happy case with --gen', async () => {
        const outcome = await runWithinPrj('./bin/run me --from myself --gen');
        expect(outcome.exitCode).to.equal(0);
        expect(outcome.stdout).to.contain('simple-cli-prj me --gen --from myself');
      });
  
      for (const arg of ['-h', '--help']) {
        it(`prints help when there is only ${arg}`, async () => {
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
  
      it('does not print help when it is not the only argument', async () => {
        const outcome = await runWithinPrj('./bin/run me -h');
        expect(outcome.exitCode).to.equal(2);
        expect(outcome.stderr).to.contain('Missing required flag');
      });

      for (const arg of ['-v', '--version']) {
        it(`prints version info when there is only ${arg}`, async () => {
          const outcome = await runWithinPrj(`./bin/run ${arg}`);
          expect(outcome.exitCode).to.equal(0);
          expect(outcome.stdout).to.contain('simple-cli-prj/3.0.1');
        });
      }

      it('updates README.md when there is only --update-readme.md', async () => {
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
