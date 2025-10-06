export type ErrorType =
  | 'Not Found'
  | 'Bad Request'
  | 'Unprocessable'
  | 'Internal Server Error'
  | 'Conflict'
  | 'Unauthorized'
  | 'Forbidden';

export default abstract class AbstractApplicationException extends Error {
  abstract readonly error: ErrorType;
  abstract readonly code: number;
}
