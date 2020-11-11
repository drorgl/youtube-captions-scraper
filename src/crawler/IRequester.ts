/**
 * Requester Interface
 */
export interface IRequester {
	/**
	 * Retrieve URL
	 * @param url url to retrieve
	 * @returns contents
	 */
	get(url: string): Promise<string>;
}
