/**
 * Represents a successful operation result
 * @template T - The type of data returned on success
 */
type Success<T> = {
  /** The data returned on success */
  data: T
  /** Always null on success */
  error: null
}

/**
 * Represents a failed operation result
 * @template E - The type of error that occurred
 */
type Failure<E> = {
  /** Always null on failure */
  data: null
  /** The error that occurred */
  error: E
}

/**
 * Represents the result of an operation that may fail
 * @template T - The type of data returned on success
 * @template E - The type of error on failure, defaults to Error
 */
type Result<T, E = Error> = Success<T> | Failure<E>

/**
 * Executes a promise and catches any errors, returning a standardized Result object.
 * @template T - The type of data returned by the promise on success
 * @template [E=Error] - The type of error on failure
 * @param {Promise<T>} promise - The promise to execute
 * @returns {Promise<Result<T, E>>} A Result object containing data on success or error on failure
 * @example
 * // Usage example
 * const { data, error } = await tryCatch(fetchData());
 * if (error) {
 *  return
 * }
 * useData(data);
 */
export const tryCatch = async <T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> => {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as E }
  }
}
