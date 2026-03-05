/**
 * HTML export utilities — produce email-safe HTML from TipTap JSON/HTML
 */

/**
 * Wraps raw editor HTML in a full email-safe document shell.
 */
export function wrapEmailHtml(
  bodyHtml: string,
  opts: { subject?: string; fontFamily?: string } = {}
): string {
  const fontFamily = opts.fontFamily ?? "Arial, Helvetica, sans-serif";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${opts.subject ?? "Email"}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: ${fontFamily};
      background-color: #f4f4f4;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 24px;
    }
    img { max-width: 100%; height: auto; }
    a { color: #2563eb; }
    h1, h2, h3 { line-height: 1.3; }
    p { line-height: 1.6; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    ${bodyHtml}
  </div>
</body>
</html>`;
}

/**
 * Strips outer wrapper tags if present — useful when re-importing.
 */
export function extractBodyContent(fullHtml: string): string {
  const match = fullHtml.match(/<div class="email-wrapper">([\s\S]*?)<\/div>\s*<\/body>/);
  return match ? match[1].trim() : fullHtml;
}
