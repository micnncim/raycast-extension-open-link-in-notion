import { Clipboard, getApplications, getSelectedText, open, showToast, Toast } from "@raycast/api";

export default async function Command() {
  const text = await getText();

  if (!text || text.length === 0) {
    showToast({
      style: Toast.Style.Failure,
      title: "Neither URL was selected nor copied to clipboard",
    });
    return;
  }

  const urlRe = new RegExp("^https?://(www)?.notion.so/");

  if (!urlRe.test(text)) {
    showToast({
      style: Toast.Style.Failure,
      title: "URL must be a Notion page URL",
    });
    return;
  }

  const newUrl = text.replace(urlRe, "notion://");
  const app = await getNotionApp();

  return await open(newUrl, app);
}

async function getNotionApp(): Promise<string> {
  const apps = await getApplications();
  return apps.filter((app) => app.name.match(/Notion(\.exe)?/))[0].name;
}

async function getText(): Promise<string | undefined> {
  return getSelectedText()
    .then(async (text) => (!isEmpty(text) ? text : await Clipboard.readText()))
    .catch(async () => await Clipboard.readText())
    .then((item) => (!isEmpty(item) ? item : ""))
    .catch(() => "" as string);
}

function isEmpty(s: string | null | undefined): boolean {
  return !(s != null && String(s).length > 0);
}
