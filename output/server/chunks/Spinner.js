import { c as create_ssr_component, e as escape } from "./ssr.js";
import "./Spinner.svelte_svelte_type_style_lang.js";
const css = {
  code: ".spinner-container.svelte-fxijdv{display:flex;align-items:center;justify-content:center;gap:0.5rem}.spinner-container.inline.svelte-fxijdv{display:inline-flex}.spinner.svelte-fxijdv{border:2px solid #e0e0e0;border-top-color:#002776;border-radius:50%;animation:svelte-fxijdv-spin 0.8s linear infinite}.spinner.small.svelte-fxijdv{width:1rem;height:1rem;border-width:2px}.spinner.medium.svelte-fxijdv{width:2rem;height:2rem;border-width:3px}.spinner.large.svelte-fxijdv{width:3rem;height:3rem;border-width:4px}.label.svelte-fxijdv{color:#333;font-size:0.875rem}@keyframes svelte-fxijdv-spin{to{transform:rotate(360deg)}}",
  map: '{"version":3,"file":"Spinner.svelte","sources":["Spinner.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let size = \\"medium\\";\\nexport let label = \\"\\";\\nexport let inline = false;\\n<\/script>\\n\\n<span class=\\"spinner-container\\" class:inline>\\n\\t<span class=\\"spinner {size}\\"></span>\\n\\t{#if label}\\n\\t\\t<span class=\\"label\\">{label}</span>\\n\\t{/if}\\n</span>\\n\\n<style>\\n\\t.spinner-container {\\n\\t\\tdisplay: flex;\\n\\t\\talign-items: center;\\n\\t\\tjustify-content: center;\\n\\t\\tgap: 0.5rem;\\n\\t}\\n\\n\\t.spinner-container.inline {\\n\\t\\tdisplay: inline-flex;\\n\\t}\\n\\n\\t.spinner {\\n\\t\\tborder: 2px solid #e0e0e0;\\n\\t\\tborder-top-color: #002776;\\n\\t\\tborder-radius: 50%;\\n\\t\\tanimation: spin 0.8s linear infinite;\\n\\t}\\n\\n\\t.spinner.small {\\n\\t\\twidth: 1rem;\\n\\t\\theight: 1rem;\\n\\t\\tborder-width: 2px;\\n\\t}\\n\\n\\t.spinner.medium {\\n\\t\\twidth: 2rem;\\n\\t\\theight: 2rem;\\n\\t\\tborder-width: 3px;\\n\\t}\\n\\n\\t.spinner.large {\\n\\t\\twidth: 3rem;\\n\\t\\theight: 3rem;\\n\\t\\tborder-width: 4px;\\n\\t}\\n\\n\\t.label {\\n\\t\\tcolor: #333;\\n\\t\\tfont-size: 0.875rem;\\n\\t}\\n\\n\\t@keyframes spin {\\n\\t\\tto {\\n\\t\\t\\ttransform: rotate(360deg);\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAaC,gCAAmB,CAClB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,GAAG,CAAE,MACN,CAEA,kBAAkB,qBAAQ,CACzB,OAAO,CAAE,WACV,CAEA,sBAAS,CACR,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,OAAO,CACzB,gBAAgB,CAAE,OAAO,CACzB,aAAa,CAAE,GAAG,CAClB,SAAS,CAAE,kBAAI,CAAC,IAAI,CAAC,MAAM,CAAC,QAC7B,CAEA,QAAQ,oBAAO,CACd,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,YAAY,CAAE,GACf,CAEA,QAAQ,qBAAQ,CACf,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,YAAY,CAAE,GACf,CAEA,QAAQ,oBAAO,CACd,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,YAAY,CAAE,GACf,CAEA,oBAAO,CACN,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,QACZ,CAEA,WAAW,kBAAK,CACf,EAAG,CACF,SAAS,CAAE,OAAO,MAAM,CACzB,CACD"}'
};
const Spinner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "medium" } = $$props;
  let { label = "" } = $$props;
  let { inline = false } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0) $$bindings.inline(inline);
  $$result.css.add(css);
  return `<span class="${["spinner-container svelte-fxijdv", inline ? "inline" : ""].join(" ").trim()}"><span class="${"spinner " + escape(size, true) + " svelte-fxijdv"}"></span> ${label ? `<span class="label svelte-fxijdv">${escape(label)}</span>` : ``} </span>`;
});
export {
  Spinner as S
};
