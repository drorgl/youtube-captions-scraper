import { EventEmitter } from "events";
import * as request from "superagent";
import { IRequester } from "./IRequester";
import { ISuperAgentRequesterOptions } from "./ISuperAgentRequesterOptions";

/**
 * SuperAgent Requester
 */
export class SuperAgentRequester extends EventEmitter implements IRequester {
	private _activeRequests: number = 0;
	private _options: ISuperAgentRequesterOptions;

	constructor(
		options: ISuperAgentRequesterOptions) {
		super();
		this._options = Object.assign({
			timeout: 15000,
			maximum_parallelism: 5,
			parallelism_delay: 100,
			gracefulFailure: false
		} as ISuperAgentRequesterOptions,
			options);
	}

	/**
	 * Retrieve URL
	 * @param url url to retrieve
	 * @returns contents
	 */
	public async get(url: string): Promise<string> {

		if (this._options.gracefulFailure) {
			try {
				return await this.getResource(url);
			} catch (e) {
				this.emit("error", e);
				return null;
			}
		} else {
			return await this.getResource(url);
		}

	}

	private async wait(ms: number): Promise<void> {
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	}

	private async getResource(url: string): Promise<string> {

		while (this._activeRequests > this._options.maximum_parallelism) {
			await this.wait(this._options.parallelism_delay);
		}
		this.emit("requesting", url);
		this._activeRequests++;

		const response = await request
			.get(url)
			.set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
			.set("Accept-Encoding", "gzip, deflate")
			.timeout(this._options.timeout)
			.buffer(true)
			.parse(request.parse.image);
		this._activeRequests--;
		this.emit("done", url, response.body);
		return response.body;
	}

}
