import { expect } from 'chai';
import { $, ProcessOutput } from 'zx';

function runWithinDir(dir: string): (cmd: string) => Promise<ProcessOutput> {
  function withinPrj(cmd: string): Promise<ProcessOutput> {
    return $`cd ${dir} && ${cmd.split(' ')}`.catch((error) => error);
  }
  return withinPrj;
}

describe('OclifUtils used in test projects', () => {
  for (const v of ['2', '3']) {
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
        expect(outcome.stdout).to.contain('simple-cli-prj me --from myself --gen');
      });
  
      for (const arg of ['-h', '--help']) {
        it(`prints help when there is only ${arg}`, async () => {
          const outcome = await runWithinPrj(`./bin/run ${arg}`);
          expect(outcome.exitCode).to.equal(0);
          expect(outcome.stdout).to.contain('USAGE');
          expect(outcome.stdout).to.contain('ARGUMENTS');
          expect(outcome.stdout).to.contain('FLAGS');
          expect(outcome.stdout).to.contain('DESCRIPTION');
          expect(outcome.stdout).to.contain('EXAMPLES');
        });
      }
  
      it('does not print help when it is not the only argument', async () => {
        const outcome = await runWithinPrj('./bin/run me -h');
        expect(outcome.exitCode).to.equal(2);
        expect(outcome.stderr).to.contain('Missing required flag');
      });
    });  
  }
});
