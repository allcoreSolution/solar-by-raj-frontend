import { site } from "../data/site";
// Opens WhatsApp with a ready message, used when the server is not reachable
export const waWithText = (text) => site.whatsapp.split("?")[0] + "?text=" + encodeURIComponent(text);