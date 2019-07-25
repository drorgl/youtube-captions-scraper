import { expect } from "chai";
import "mocha";
import { getSubtitles, getSubtitlesContent, ISubtitle } from "../src";
import { YoutubeCaption } from "../src/YoutubeCaption";

it("Extract estonia war subtitles", async () => {
	const subtitles = await getSubtitles({ videoID: "HBA0xDHZjko" });
	expect(subtitles[0]).to.deep.eq({
		dur: "5.87",
		start: "6.62",
		text: "November 19",
	});
}).timeout(10000);

it("Extract passive income video", async () => {
	const subtitles = await getSubtitles({ videoID: "JueUvj6X3DA" });
	expect(subtitles[0].text).to.contain("creating passive income takes work");
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
			dur: "5.87",
			start: "6.62",
			text: "November 19",
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
			const youtubeCaptions = new YoutubeCaption( "9W0Dy1nM-zU" );
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
