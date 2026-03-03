import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["app/immutable/nodes/2.DrdUJmyW.js","app/immutable/chunks/scheduler.DkUGhlvm.js","app/immutable/chunks/index.C7iCkZ2n.js","app/immutable/chunks/myBookings.DR1R4L1h.js","app/immutable/chunks/dateFunctions.BiDinQCm.js","app/immutable/chunks/entry.t9JCv9IL.js","app/immutable/chunks/index.CuKoY1RR.js","app/immutable/chunks/globalOnMount.C6PjAZos.js","app/immutable/chunks/users.DbRhCqVH.js","app/immutable/chunks/Spinner.Cmk_wb-X.js","app/immutable/chunks/spread.CgU5AtxT.js"];
export const stylesheets = ["app/immutable/assets/2.BUnuNw46.css","app/immutable/assets/myBookings.DGGm1vKM.css","app/immutable/assets/Spinner.D3VIUZon.css"];
export const fonts = [];
