import { IRequester, ISuperAgentRequesterOptions, SuperAgentRequester } from "./crawler";
import { ICaptionTrack } from "./ICaptionTrack";
import { ISubtitle } from "./ISubtitle";
import { YoutubeCaption } from "./YoutubeCaption";

export { YoutubeCaption, ISubtitle, ICaptionTrack };

const defaultRequester = new SuperAgentRequester({});

interface ISubtitleOptions {
	videoID: string;
	lang?: "en" | "de" | "fr";
	requester?: IRequester;
}

/**
 * Retrieves Subtitles for certain youtube video
 *
 * @export
 * @param {ISubtitleOptions} {
 * 	videoID,
 * 	lang = 'en',
 * }
 * @returns {Promise<ISubtitle[]} subtitles
 */
export async function getSubtitles({
	videoID,
	lang = "en",
	requester = defaultRequester
}: ISubtitleOptions): Promise<ISubtitle[]> {
	const youtubeCaptions = new YoutubeCaption(videoID, requester);
	return await youtubeCaptions.getSubtitles(lang);
}

/**
 * Retrieves Subtitles for certain youtube video
 *
 * @export
 * @param {ISubtitleOptions} {
 * 	videoID,
 * 	lang = 'en',
 * }
 * @returns {string} subtitles
 */
export async function getSubtitlesContent({
	videoID,
	lang = "en",
	requester = defaultRequester
}: ISubtitleOptions): Promise<string> {
	const subtitles = await getSubtitles({ videoID, lang, requester });
	let content = "";
	for (const subtitle of subtitles) {
		content += " " + subtitle.text;
	}

	return content.replace(/([\s\r\n])+/g, " ").trim();
}
