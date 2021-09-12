/* eslint-disable unicorn/no-null */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// eslint-disable-next-line valid-jsdoc
/**
 * Encapsulation of console output functions.
 */
export class CliConsole<DEBUG_FUNC extends Function, INFO_FUNC extends Function, WARN_FUNC extends Function, ERROR_FUNC extends Function> {
  protected static NO_OP_FUNC = function () {}

  /**
   * Build an instance with console.log/info/warn/error.
   * @param flags           The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled.
   * Those fields are evaluated only once within the function.
   * They are not evaluated when debug/info/warn/error functions are called.
   * @param debugFlagName   Name of the debug field in the flags object
   * @param quietFlagName   Name of the quiet field in the flags object
   * @returns An instance that uses console.log/info/warn/error.
   */
  static default<FLAGS extends Record<string, any>>(flags: FLAGS, debugFlagName: keyof FLAGS = 'debug', quietFlagName: keyof FLAGS = 'quiet') {
    return new CliConsole(console.log, console.info, console.warn, console.error, flags[debugFlagName], flags[quietFlagName]);
  }

  /**
   * Build an instance with console.log/info/warn/error and chalk/colors/cli-color.
   * @param flags           The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled.
   * Those fields are evaluated only once within the function.
   * They are not evaluated when debug/info/warn/error functions are called.
   * @param colourer              Supplier of the colouring function, such as chalk or colors or cli-color
   * @param debugColourFuncName   Name of the function within colourer that will be used to add colour to debug messages, or null if colouring is not desired.
   * @param infoColourFuncName    Name of the function within colourer that will be used to add colour to info messages, or null if colouring is not desired.
   * @param warnColourFuncName    Name of the function within colourer that will be used to add colour to warn messages, or null if colouring is not desired.
   * @param errorColourFuncName   Name of the function within colourer that will be used to add colour to error messages, or null if colouring is not desired.
   * @param debugFlagName   Name of the debug field in the flags object
   * @param quietFlagName   Name of the quiet field in the flags object
   * @returns An instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.
   */
  static withColour<FLAGS extends Record<string, any>, COLOURER extends Record<string, any>>(flags: FLAGS,
    colourer: COLOURER, debugColourFuncName: keyof COLOURER = 'grey', infoColourFuncName?: keyof COLOURER | undefined, warnColourFuncName: keyof COLOURER = 'yellow', errorColourFuncName: keyof COLOURER = 'red',
    debugFlagName: keyof FLAGS = 'debug', quietFlagName: keyof FLAGS = 'quiet',
  ) {
    return new CliConsole(
      // debug
      (message?: any, ...optionalParams: any[]) => {
        if (typeof message === 'string') {
          console.log(debugColourFuncName == null ? message : (colourer[debugColourFuncName] as any as Function)(message), ...optionalParams);
        }
      },
      // info
      (message?: any, ...optionalParams: any[]) => {
        if (typeof message === 'string') {
          console.info(infoColourFuncName == null ? message : (colourer[infoColourFuncName] as any as Function)(message), ...optionalParams);
        }
      },
      // warn
      (message?: any, ...optionalParams: any[]) => {
        if (typeof message === 'string') {
          console.warn(warnColourFuncName == null ? message : (colourer[warnColourFuncName] as any as Function)(message), ...optionalParams);
        }
      },
      // error
      (message?: any, ...optionalParams: any[]) => {
        if (typeof message === 'string') {
          console.error(errorColourFuncName == null ? message : (colourer[errorColourFuncName] as any as Function)(message), ...optionalParams);
        }
      },
      flags[debugFlagName], flags[quietFlagName],
    );
  }

  info: INFO_FUNC = CliConsole.NO_OP_FUNC as any;
  debug: DEBUG_FUNC = CliConsole.NO_OP_FUNC as any;
  warn: WARN_FUNC = CliConsole.NO_OP_FUNC as any;
  error: ERROR_FUNC = CliConsole.NO_OP_FUNC as any;

  /**
   * Constructor
   * @param debugFunction   function for outputting debug information
   * @param infoFunction    function for outputting info information
   * @param warnFunction    function for outputting warn information
   * @param errorFunction   function for outputting error information
   * @param isDebug         is debug output enabled or not
   * @param isQuiet         is quiet mode enabled or not. When quiet mode is enabled, debug and info output would be discarded.
   */
  constructor(debugFunction: DEBUG_FUNC, infoFunction: INFO_FUNC, warnFunction: WARN_FUNC, errorFunction: ERROR_FUNC,
              public isDebug: boolean = false, public isQuiet: boolean = false,
  ) {
    if (isDebug === true) {
      this.debug = debugFunction;
    }
    if (isQuiet !== true) {
      this.info = infoFunction;
    }
    this.warn = warnFunction;
    this.error = errorFunction;
  }
}

/**
 * CliConsole that has function signatures based on console.log/info/warn/error.
 */
export type DefaultCliConsole = ReturnType<typeof CliConsole.default>;

/**
 * Build an encapsulation of console output functions with console.log/info/warn/error.
 * @param flags           The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled.
 * Those fields are evaluated only once within the function.
 * They are not evaluated when debug/info/warn/error functions are called.
 * @param debugFlagName   Name of the debug field in the flags object
 * @param quietFlagName   Name of the quiet field in the flags object
 * @returns An CliConsole instance that uses console.log/info/warn/error.
 */
export const cliConsole = CliConsole.default;

/**
 * Build an encapsulation of console output functions with console.log/info/warn/error and chalk/colors/cli-color.
 * @param flags           The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled.
 * Those fields are evaluated only once within the function.
 * They are not evaluated when debug/info/warn/error functions are called.
 * @param colourer              Supplier of the colouring function, such as chalk or colors or cli-color
 * @param debugColourFuncName   Name of the function within colourer that will be used to add colour to debug messages, or null if colouring is not desired.
 * @param infoColourFuncName    Name of the function within colourer that will be used to add colour to info messages, or null if colouring is not desired.
 * @param warnColourFuncName    Name of the function within colourer that will be used to add colour to warn messages, or null if colouring is not desired.
 * @param errorColourFuncName   Name of the function within colourer that will be used to add colour to error messages, or null if colouring is not desired.
 * @param debugFlagName   Name of the debug field in the flags object
 * @param quietFlagName   Name of the quiet field in the flags object
 * @returns An CliConsole instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.
*/
export const cliConsoleWithColour = CliConsole.withColour;
