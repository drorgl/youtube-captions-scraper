import { fail } from "assert";
import { expect } from "chai";
import "mocha";
import querystring from "querystring";
import { getSubtitles, getSubtitlesContent, ICaptionTrack, ISubtitle } from "../src";
import { YoutubeCaption } from "../src/YoutubeCaption";
import { MockRequester } from "./MockRequester";

it("Extract estonia war subtitles", async () => {
	const subtitles = await getSubtitles({ videoID: "HBA0xDHZjko" });
	expect(subtitles[0]).to.deep.eq({
		dur: "5.679",
		start: "7.12",
		text: "november 1918",
		htmlText: "november 1918"
	});
}).timeout(10000);

it("Extract passive income video", async () => {
	const subtitles = await getSubtitles({ videoID: "JueUvj6X3DA" });
	expect(subtitles[0].text).to.contain("Creating passive income takes work");
}).timeout(10000);

it("Extract automatic subtitles video", async () => {
	const subtitles = await getSubtitlesContent({ videoID: "P-ygmGxuiEI" });
	expect(subtitles).to.contain("out what Alex made Alex is tiny LED matrix by the way oh let's have a look");
}).timeout(10000);

describe("YoutubeCaptions", () => {
	it("Extract estonia war subtitles with ", async () => {
		const youtubeCaptions = new YoutubeCaption("HBA0xDHZjko");
		const subtitles = await youtubeCaptions.getSubtitles();
		expect(subtitles[0]).to.deep.eq({
			dur: "5.679",
			htmlText: "november 1918",
			start: "7.12",
			text: "november 1918"
		});
	}).timeout(10000);

	it("Extract estonia war caption tracks", async () => {
		const youtubeCaptions = new YoutubeCaption("HBA0xDHZjko");
		const captionTracks = await youtubeCaptions.getCaptionTracks();
		expect(captionTracks.length).to.greaterThan(1);
		expect(captionTracks[0]).to.contain({
			kind: "asr",
			languageCode: "en",
			vssId: "a.en"
		});
	}).timeout(10000);

	describe("Styled", () => {
		let subtitles: ISubtitle[] = null;
		before(async () => {
			const youtubeCaptions = new YoutubeCaption("9W0Dy1nM-zU");
			subtitles = await youtubeCaptions.getSubtitles();
		});

		it("plain text", () => {
			expect(subtitles[0].text).to.eq("Bold");
			expect(subtitles[1].text).to.eq("Italic");
			expect(subtitles[2].text).to.eq("Underline");
			expect(subtitles[3].text).to.eq("Bold Italic Underline");
			expect(subtitles[4].text).to.eq("Red (a = 40)");
		});
		it("html", () => {
			expect(subtitles[0].htmlText).to.eq("<b>Bold</b>");
			expect(subtitles[1].htmlText).to.eq("<i>Italic</i>");
			expect(subtitles[2].htmlText).to.eq("<u>Underline</u>");
			expect(subtitles[3].htmlText).to.eq("<b>Bold</b> <i>Italic</i> <u>Underline</u>");
			expect(subtitles[4].htmlText).to.eq('<font color="#FF0000">Red (a = 40)</font>');
		});

	});

});

describe("external requester", () => {
	const enTrack = querystring.encode({
		player_response: JSON.stringify({
			captions: {
				playerCaptionsTracklistRenderer: {
					captionTracks: [{
						languageCode: "en",
						baseUrl: "en-url"
					}] as ICaptionTrack[]
				}
			}
		})
	});

	const enTranscript = `
		<?xml version="1.0" encoding="utf-8" ?>
		<transcript>
			<text start="0.381" dur="2.721">Creating passive</text>
			<text start="3.102" dur="2.334">but once you implement those processes</text>
		</transcript>
	`;

	const requester = new MockRequester([
		{
			url: "https://youtube.com/get_video_info?video_id=9W0Dy1nM-zU",
			responseText: enTrack
		},
		{
			url: "en-url",
			responseText: enTranscript
		}
	]);

	it("YoutubeCaption should call requester with desired url", async () => {
		const youtubeCaptions = new YoutubeCaption("9W0Dy1nM-zU", requester);
		const subtitles = await youtubeCaptions.getSubtitles();

		expect(requester.requestedUrls[0]).to.eq("https://youtube.com/get_video_info?video_id=9W0Dy1nM-zU");
		expect(subtitles[0].text).to.eq("Creating passive");
	});

	it("getSubtitles should call requester with desired url", async () => {
		const subtitles = await getSubtitles({ videoID: "9W0Dy1nM-zU", requester });

		expect(requester.requestedUrls[0]).to.eq("https://youtube.com/get_video_info?video_id=9W0Dy1nM-zU");
		expect(subtitles[0].text).to.eq("Creating passive");
	});

	it("getSubtitlesContent should call requester with desired url", async () => {
		const subtitles = await getSubtitlesContent({ videoID: "9W0Dy1nM-zU", requester });

		expect(requester.requestedUrls[0]).to.eq("https://youtube.com/get_video_info?video_id=9W0Dy1nM-zU");
		expect(subtitles).to.eq("Creating passive but once you implement those processes");
	});
});
