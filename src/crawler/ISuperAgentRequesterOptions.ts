export interface ISuperAgentRequesterOptions {
	/**
	 * timeout for each request
	 */
	timeout?: number;

	/**
	 * maximum number of requests to perform simultaneously
	 */
	maximum_parallelism?: number;

	/**
	 * interval between checks for pending requests
	 */
	parallelism_delay?: number;

	/**
	 * failure will return null instead of throwing an exception
	 */
	gracefulFailure?: boolean;
}
