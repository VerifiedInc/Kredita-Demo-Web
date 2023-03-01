/**
 * Error class for errors that should trigger an alert in New Relic
 */
export class AlertError extends Error {
  override readonly name = 'AlertError';
  constructor(message: string) {
    super(message);
  }
}

// adapted from https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript

export interface ErrorWithMessage {
  message: string;
}

/**
 * Typeguard to check if an unknown value is an ErrorWithMessage
 */
export const isErrorWithMessage = (
  error: unknown
): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as ErrorWithMessage).message === 'string'
  );
};

/**
 * Converts an unknown value to an ErrorWithMessage
 * If the value is already an ErrorWithMessage, it is returned as-is
 * Othewise, the value is converted to a string and used as the message
 */
export const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) {
    return maybeError;
  }

  try {
    return new Error(
      JSON.stringify(maybeError, Object.getOwnPropertyNames(maybeError))
    );
  } catch {
    return new Error(String(maybeError));
  }
};

/**
 * Returns the message of an unknown value
 * If the value is already an ErrorWithMessage, its message is returned
 * Othewise, the value is converted to a string and used as the message
 */
export const getErrorMessage = (error: unknown): string => {
  return toErrorWithMessage(error).message;
};

interface ErrorWithStatus {
  status: number;
}

/**
 * Typeguard to check if an unknown value is an ErrorWithStatus
 */
export const isErrorWithStatus = (error: unknown): error is ErrorWithStatus => {
  return (
    typeof error === 'object' &&
    error != null &&
    'status' in error &&
    typeof (error as ErrorWithStatus).status === 'number'
  );
};

/**
 * Returns the status of an unknown value
 * If the value is already an ErrorWithStatus, its status is returned
 * Othewise, 500 is returned
 * @param {unknown} error
 * @returns {number} status
 */
export const getErrorStatus = (error: unknown): number => {
  if (isErrorWithStatus(error)) {
    return error.status;
  }

  return 500;
};
