import * as DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export const getSafeText = (content: string): string => {
  const html = `
        <div id="bloglist_buddy_project">
            ${content}
        </div>
    `;

  const dom = new JSDOM(html);
  return (
    dom.window.document.querySelector('#bloglist_buddy_project') as HTMLElement
  ).textContent;
};

export const getDescriptionText = (
  content: string,
  length: number = 300,
): string => {
  const safeText = getSafeText(content);

  return safeText
    .replace(/[\r\n]/gm, '')
    .replace(/^[\t\n\r\s]+/g, '')
    .replace(/[\t\n\r\s]+$/g, '')
    .substring(0, length);
};

export const getSafeHtml = (content: string): string => {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  return purify.sanitize(content);
};
