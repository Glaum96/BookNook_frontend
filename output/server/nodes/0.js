import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["app/immutable/nodes/0.YtYZbulg.js","app/immutable/chunks/scheduler.DkUGhlvm.js","app/immutable/chunks/index.C7iCkZ2n.js","app/immutable/chunks/spread.CgU5AtxT.js","app/immutable/chunks/entry.t9JCv9IL.js","app/immutable/chunks/index.CuKoY1RR.js","app/immutable/chunks/globalOnMount.C6PjAZos.js","app/immutable/chunks/users.DbRhCqVH.js","app/immutable/chunks/Spinner.Cmk_wb-X.js"];
export const stylesheets = ["app/immutable/assets/0.C1fudczv.css","app/immutable/assets/Spinner.D3VIUZon.css"];
export const fonts = ["app/immutable/assets/fira-mono-cyrillic-ext-400-normal.B04YIrm4.woff2","app/immutable/assets/fira-mono-cyrillic-ext-400-normal.0xXfcOOq.woff","app/immutable/assets/fira-mono-cyrillic-400-normal.36-45Uyg.woff2","app/immutable/assets/fira-mono-cyrillic-400-normal.Dq7SlH2J.woff","app/immutable/assets/fira-mono-greek-ext-400-normal.CsqI23CO.woff2","app/immutable/assets/fira-mono-greek-ext-400-normal.BEhC8Nsh.woff","app/immutable/assets/fira-mono-greek-400-normal.C3zng6O6.woff2","app/immutable/assets/fira-mono-greek-400-normal.DUeQbRz0.woff","app/immutable/assets/fira-mono-latin-ext-400-normal.D6XfiR-_.woff2","app/immutable/assets/fira-mono-latin-ext-400-normal.lWlD_NAB.woff","app/immutable/assets/fira-mono-latin-400-normal.DKjLVgQi.woff2","app/immutable/assets/fira-mono-latin-400-normal.g4W12wf9.woff"];
