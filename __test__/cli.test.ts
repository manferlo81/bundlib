import { handleCLI } from '../src/cli/command/handle-cli-args';

describe('handleCLI function', () => {

  describe('default command', () => {

    test('should pass empty object if not options passed', async () => {
      const action = jest.fn();
      await handleCLI([], action);
      expect(action).toHaveBeenCalledWith({});
    });

    test('should pass dev if -d options set', async () => {
      const action = jest.fn();
      await handleCLI(['-d'], action);
      expect(action).toHaveBeenCalledWith({ dev: true });
    });

    test('should pass dev if --dev options set', async () => {
      const action = jest.fn();
      await handleCLI(['--dev'], action);
      expect(action).toHaveBeenCalledWith({ dev: true });
    });

    test('should pass watch if -w options set', async () => {
      const action = jest.fn();
      const consoleLog = jest.fn();
      const consoleWarn = jest.fn();

      await handleCLI(['-w'], action, consoleLog, consoleWarn);

      expect(action).toHaveBeenCalledWith({ watch: true });

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('WARNING'));

      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith('');
    });

    test('should pass watch if --watch options set', async () => {
      const action = jest.fn();
      const consoleLog = jest.fn();
      const consoleWarn = jest.fn();

      await handleCLI(['--watch'], action, consoleLog, consoleWarn);

      expect(action).toHaveBeenCalledWith({ watch: true });

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('WARNING'));

      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith('');
    });

    test('should pass watch if -s options set', async () => {
      const action = jest.fn();
      await handleCLI(['-s'], action);
      expect(action).toHaveBeenCalledWith({ silent: true });
    });

    test('should pass watch if --silent options set', async () => {
      const action = jest.fn();
      await handleCLI(['--silent'], action);
      expect(action).toHaveBeenCalledWith({ silent: true });
    });

  });

  describe('build command', () => {

    test('should force watch option if not options passed', async () => {
      const action = jest.fn();
      await handleCLI(['build'], action);
      expect(action).toHaveBeenCalledWith({ watch: false });
    });

    test('should force watch option to false even if -d options set', async () => {
      const action = jest.fn();
      await handleCLI(['build', '-d'], action);
      expect(action).toHaveBeenCalledWith({ watch: false, dev: true });
    });

    test('should force watch option to false even if --dev options set', async () => {
      const action = jest.fn();
      await handleCLI(['build', '--dev'], action);
      expect(action).toHaveBeenCalledWith({ watch: false, dev: true });
    });

    test('should force watch option to false even if -w options set', async () => {
      const action = jest.fn();
      const consoleLog = jest.fn();
      const consoleWarn = jest.fn();

      await handleCLI(['build', '-w'], action, consoleLog, consoleWarn);

      expect(action).toHaveBeenCalledWith({ watch: false });

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('WARNING'));

      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith('');
    });

    test('should force watch option to false even if --watch options set', async () => {
      const action = jest.fn();
      const consoleLog = jest.fn();
      const consoleWarn = jest.fn();

      await handleCLI(['build', '--watch'], action, consoleLog, consoleWarn);

      expect(action).toHaveBeenCalledWith({ watch: false });

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('WARNING'));

      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith('');
    });

    test('should force watch option to false even if -s options set', async () => {
      const action = jest.fn();
      await handleCLI(['build', '-s'], action);
      expect(action).toHaveBeenCalledWith({ watch: false, silent: true });
    });

    test('should force watch option to false even if --silent options set', async () => {
      const action = jest.fn();
      await handleCLI(['build', '--silent'], action);
      expect(action).toHaveBeenCalledWith({ watch: false, silent: true });
    });

  });

  describe('watch command', () => {

    test('should pass watch option if not options passed', async () => {
      const action = jest.fn();
      await handleCLI(['watch'], action);
      expect(action).toHaveBeenCalledWith({ watch: true });
    });

    test('should pass watch option even if -d options set', async () => {
      const action = jest.fn();
      await handleCLI(['watch', '-d'], action);
      expect(action).toHaveBeenCalledWith({ watch: true, dev: true });
    });

    test('should pass watch option even if --dev options set', async () => {
      const action = jest.fn();
      await handleCLI(['watch', '--dev'], action);
      expect(action).toHaveBeenCalledWith({ watch: true, dev: true });
    });

    test('should pass watch option even if -w options set', async () => {
      const action = jest.fn();
      const consoleLog = jest.fn();
      const consoleWarn = jest.fn();

      await handleCLI(['watch', '-w'], action, consoleLog, consoleWarn);

      expect(action).toHaveBeenCalledWith({ watch: true });

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('WARNING'));

      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith('');
    });

    test('should pass watch option even if --watch options set', async () => {
      const action = jest.fn();
      const consoleLog = jest.fn();
      const consoleWarn = jest.fn();

      await handleCLI(['watch', '--watch'], action, consoleLog, consoleWarn);

      expect(action).toHaveBeenCalledWith({ watch: true });

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('WARNING'));

      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith('');
    });

    test('should pass watch option even if -s options set', async () => {
      const action = jest.fn();
      await handleCLI(['watch', '-s'], action);
      expect(action).toHaveBeenCalledWith({ watch: true, silent: true });
    });

    test('should pass watch option even if --silent options set', async () => {
      const action = jest.fn();
      await handleCLI(['watch', '--silent'], action);
      expect(action).toHaveBeenCalledWith({ watch: true, silent: true });
    });

  });

});
