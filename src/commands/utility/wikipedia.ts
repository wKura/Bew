import type { Message, TextChannel } from "eris";
import { Command } from "../../classes/Command";
import axios from "axios";

export class WikipediaCommand extends Command {
  description = "Returns information about a page from Wikipedia.";
  args = "<query:string>";
  aliases = ["wiki"];
  cooldown = 3000;
  allowdms = true;

  // TODO: Search with a user's locale instead of only EN
  // FALL BACK TO EN!!
  async run(msg: Message<TextChannel>, _pargs: ParsedArgs, args: string[]) {
    const query = encodeURIComponent(args.join(" "));

    const body = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`);
    if (body.data.title === "Not found.") {
      return msg.createEmbed(msg.string("global.ERROR"), msg.string("utility.WIKIPEDIA_NOTFOUND"));
    }

    // Handles disambiguation pages
    if (body.data.type === "disambiguation") {
      return msg.createEmbed(
        `🌐 ${msg.string("utility.WIKIPEDIA")}`,
        msg.string("utility.WIKIPEDIA_DISAMBIGUATION", { page: body.data.content_urls.desktop.page }),
      );
    }

    msg.createEmbed(`🌐 ${msg.string("utility.WIKIPEDIA")}`, `${body.data.extract}`);
  }
}
