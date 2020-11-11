import { exception } from "console";
import { IRequester } from "../src/crawler";

export class MockRequester implements IRequester {
	private _requestedUrls: string[] = [];
	constructor(private responses:
		Array<{
			url: string,
			responseText: string
		}>
	) {

	}

	public get requestedUrls() {
		return this._requestedUrls;
	}

	public async get(url: string): Promise<string> {
		this._requestedUrls.push(url);
		const response = this.responses.find((v) => v.url === url);
		if (response) {
			return response.responseText;
		}

		throw new Error(`No Response for ${url}`);
	}

}
