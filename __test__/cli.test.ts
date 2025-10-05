import { createActionContext } from '../src/cli/actions/context';
import { handleCLI } from '../src/cli/command/handle-cli-args';

describe('handleCLI function', () => {

  describe('default command', () => {

    test('should pass empty object if not options passed', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI([], action, context);
      expect(action).toHaveBeenCalledWith({}, context);
    });

    test('should pass dev if -d options set', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['-d'], action, context);
      expect(action).toHaveBeenCalledWith({ dev: true }, context);
    });

    test('should pass dev if --dev options set', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['--dev'], action, context);
      expect(action).toHaveBeenCalledWith({ dev: true }, context);
    });

    test('should pass watch if -w options set', async () => {
      const action = jest.fn();
      const consoleLog = jest.fn();
      const consoleWarn = jest.fn();

      const context = createActionContext({ consoleLog, consoleWarn });
      await handleCLI(['-w'], action, context);

      expect(action).toHaveBeenCalledWith({ watch: true }, context);

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('WARNING'));

      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith('');
    });

    test('should pass watch if --watch options set', async () => {
      const action = jest.fn();
      const consoleLog = jest.fn();
      const consoleWarn = jest.fn();

      const context = createActionContext({ consoleLog, consoleWarn });
      await handleCLI(['--watch'], action, context);

      expect(action).toHaveBeenCalledWith({ watch: true }, context);

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('WARNING'));

      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith('');
    });

    test('should pass watch if -s options set', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['-s'], action, context);
      expect(action).toHaveBeenCalledWith({ silent: true }, context);
    });

    test('should pass watch if --silent options set', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['--silent'], action, context);
      expect(action).toHaveBeenCalledWith({ silent: true }, context);
    });

  });

  describe('build command', () => {

    test('should force watch option if not options passed', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['build'], action, context);
      expect(action).toHaveBeenCalledWith({ watch: false }, context);
    });

    test('should force watch option to false even if -d options set', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['build', '-d'], action, context);
      expect(action).toHaveBeenCalledWith({ watch: false, dev: true }, context);
    });

    test('should force watch option to false even if --dev options set', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['build', '--dev'], action, context);
      expect(action).toHaveBeenCalledWith({ watch: false, dev: true }, context);
    });

    test('should force watch option to false even if -w options set', async () => {
      const action = jest.fn();
      const consoleLog = jest.fn();
      const consoleWarn = jest.fn();

      const context = createActionContext({ consoleLog, consoleWarn });
      await handleCLI(['build', '-w'], action, context);

      expect(action).toHaveBeenCalledWith({ watch: false }, context);

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('WARNING'));

      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith('');
    });

    test('should force watch option to false even if --watch options set', async () => {
      const action = jest.fn();
      const consoleLog = jest.fn();
      const consoleWarn = jest.fn();

      const context = createActionContext({ consoleLog, consoleWarn });
      await handleCLI(['build', '--watch'], action, context);

      expect(action).toHaveBeenCalledWith({ watch: false }, context);

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('WARNING'));

      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith('');
    });

    test('should force watch option to false even if -s options set', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['build', '-s'], action, context);
      expect(action).toHaveBeenCalledWith({ watch: false, silent: true }, context);
    });

    test('should force watch option to false even if --silent options set', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['build', '--silent'], action, context);
      expect(action).toHaveBeenCalledWith({ watch: false, silent: true }, context);
    });

  });

  describe('watch command', () => {

    test('should pass watch option if not options passed', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['watch'], action, context);
      expect(action).toHaveBeenCalledWith({ watch: true }, context);
    });

    test('should pass watch option even if -d options set', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['watch', '-d'], action, context);
      expect(action).toHaveBeenCalledWith({ watch: true, dev: true }, context);
    });

    test('should pass watch option even if --dev options set', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['watch', '--dev'], action, context);
      expect(action).toHaveBeenCalledWith({ watch: true, dev: true }, context);
    });

    test('should pass watch option even if -w options set', async () => {
      const action = jest.fn();
      const consoleLog = jest.fn();
      const consoleWarn = jest.fn();

      const context = createActionContext({ consoleLog, consoleWarn });
      await handleCLI(['watch', '-w'], action, context);

      expect(action).toHaveBeenCalledWith({ watch: true }, context);

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('WARNING'));

      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith('');
    });

    test('should pass watch option even if --watch options set', async () => {
      const action = jest.fn();
      const consoleLog = jest.fn();
      const consoleWarn = jest.fn();

      const context = createActionContext({ consoleLog, consoleWarn });
      await handleCLI(['watch', '--watch'], action, context);

      expect(action).toHaveBeenCalledWith({ watch: true }, context);

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('WARNING'));

      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith('');
    });

    test('should pass watch option even if -s options set', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['watch', '-s'], action, context);
      expect(action).toHaveBeenCalledWith({ watch: true, silent: true }, context);
    });

    test('should pass watch option even if --silent options set', async () => {
      const action = jest.fn();
      const context = createActionContext();
      await handleCLI(['watch', '--silent'], action, context);
      expect(action).toHaveBeenCalledWith({ watch: true, silent: true }, context);
    });

  });

});
