import { c as create_ssr_component, a as subscribe, e as escape, v as validate_component, m as missing_component } from "../../chunks/ssr.js";
import "../../chunks/client.js";
import { b as base } from "../../chunks/paths.js";
import { i as isAuthenticated, a as isAdminUser } from "../../chunks/auth.js";
import "../../chunks/Spinner.svelte_svelte_type_style_lang.js";
import { w as writable } from "../../chunks/index.js";
const modalContent = writable({ component: null, props: {} });
const showModal = writable(false);
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_showModal;
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  let $isAdminUser, $$unsubscribe_isAdminUser;
  $$unsubscribe_showModal = subscribe(showModal, (value) => value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  $$unsubscribe_isAdminUser = subscribe(isAdminUser, (value) => $isAdminUser = value);
  const getUserNameText = (userName2) => {
    {
      return "Min side";
    }
  };
  $$unsubscribe_showModal();
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_isAdminUser();
  return `<header class="global-header"><nav><a class="title" href="${escape(base, true) + "/"}" data-svelte-h="svelte-16bfvjm"><img src="${escape(base, true) + "/booknook_full_logo.png"}" alt="BookNook Logo"></a> ${$isAuthenticated ? `<button id="toggleModalButton" data-svelte-h="svelte-1wzz5bz"><p>Ny booking</p> <span class="icon">+</span></button> <a href="${escape(base, true) + "/minside"}">${escape(getUserNameText())}</a> ${$isAdminUser ? `<a href="${escape(base, true) + "/admin"}" data-svelte-h="svelte-sjnl6u">Admin</a>` : ``} <button class="nav-link" data-svelte-h="svelte-tmiclf">Logg ut</button>` : `<a href="${escape(base, true) + "/register"}" data-svelte-h="svelte-1vpid5c">Registrer</a> <a href="${escape(base, true) + "/login"}" data-svelte-h="svelte-1ezpzth">Logg inn</a>`} <img id="info_img" src="${escape(base, true) + "/info.png"}" alt="Info"></nav></header>`;
});
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<footer><button-group><button title="GitHub Link for Frontend (Svelte)" data-svelte-h="svelte-1xgwip3"><img src="${escape(base, true) + "/footer/gh_svelte_icon.svg"}" alt="GitHub Link for Frontend (Svelte)"></button> <button title="GitHub Link for Backend (Spring Boot)" data-svelte-h="svelte-46976h"><img src="${escape(base, true) + "/footer/gh_springboot_icon.svg"}" alt="GitHub Link for Backend (Spring Boot)"></button> <button title="LinkedIn of Author (Haakon Gunleiksrud)" data-svelte-h="svelte-7z5ts3"><img src="${escape(base, true) + "/footer/linkedin.png"}" alt="LinkedIn of Author (Haakon Gunleiksrud)"></button> <button class="egg" title="Klikk meg daaaa... (du vet du vil)" data-svelte-h="svelte-uq4xz0"><img src="${escape(base, true) + "/footer/egg.png"}" alt="Klikk og finn ut..."></button> <button class="api-ping" data-svelte-h="svelte-xke6nd">Ping backend</button>  <span class="api-ping-response"></span></button-group></footer>`;
});
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { onClose } = $$props;
  let { component = null } = $$props;
  let { props = {} } = $$props;
  if ($$props.onClose === void 0 && $$bindings.onClose && onClose !== void 0) $$bindings.onClose(onClose);
  if ($$props.component === void 0 && $$bindings.component && component !== void 0) $$bindings.component(component);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0) $$bindings.props(props);
  return `<modal><div class="modal-container"><button class="backdrop"></button> <div class="modal-content"><button class="close" data-svelte-h="svelte-1t612tt">×</button> ${slots.default ? slots.default({}) : ``}</div></div></modal>`;
});
const css = {
  code: ".app.svelte-ijpjar{display:flex;flex-direction:column;min-height:100vh}main.svelte-ijpjar{flex:1;display:flex;flex-direction:column;padding:1rem;width:100%;margin:0 auto;box-sizing:border-box}",
  map: '{"version":3,"file":"+layout.svelte","sources":["+layout.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Header from \\"../lib/components/header/header.svelte\\";\\nimport Footer from \\"../lib/components/footer/footer.svelte\\";\\nimport Modal from \\"$lib/components/modal/modal.svelte\\";\\nimport \\"../app.css\\";\\nimport { showModal, modalContent } from \\"../stores/modal\\";\\nimport { onMount } from \\"svelte\\";\\nimport { globalOnMount } from \\"$lib/api/globalOnMount\\";\\nimport NewBooking from \\"$lib/components/newBooking/newBooking.svelte\\";\\nlet bookings = [];\\nonMount(async () => {\\n  const { user: fetchedUser, bookings: fetchedBookings } = await globalOnMount();\\n  user = fetchedUser;\\n  bookings = fetchedBookings;\\n});\\nonMount(() => {\\n  const unsubscribe = showModal.subscribe((value) => {\\n    if (value) {\\n      document.body.style.overflow = \\"hidden\\";\\n    } else {\\n      document.body.style.overflow = \\"\\";\\n    }\\n  });\\n  return () => {\\n    unsubscribe();\\n  };\\n});\\nlet user = {\\n  id: \\"\\",\\n  name: \\"\\",\\n  phoneNumber: \\"\\",\\n  email: \\"\\",\\n  apartmentNumber: \\"\\"\\n};\\n<\/script>\\n\\n<div class=\\"app\\">\\n\\t<Header />\\n\\n\\t<main>\\n\\t\\t<slot />\\n\\t\\t{#if $showModal}\\n\\t\\t\\t<Modal onClose={() => showModal.set(false)}>\\n\\t\\t\\t\\t{#if $modalContent.component}\\n\\t\\t\\t\\t\\t<svelte:component this={$modalContent.component} {...$modalContent.props} />\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t</Modal>\\n\\t\\t{/if}\\n\\t</main>\\n\\t<Footer />\\n</div>\\n\\n<style>\\n\\t.app {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t\\tmin-height: 100vh;\\n\\t}\\n\\n\\tmain {\\n\\t\\tflex: 1;\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t\\tpadding: 1rem;\\n\\t\\twidth: 100%;\\n\\t\\t/* max-width: 64rem; */\\n\\t\\tmargin: 0 auto;\\n\\t\\tbox-sizing: border-box;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAoDC,kBAAK,CACJ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,UAAU,CAAE,KACb,CAEA,kBAAK,CACJ,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,IAAI,CAEX,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,UAAU,CAAE,UACb"}'
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $showModal, $$unsubscribe_showModal;
  let $modalContent, $$unsubscribe_modalContent;
  $$unsubscribe_showModal = subscribe(showModal, (value) => $showModal = value);
  $$unsubscribe_modalContent = subscribe(modalContent, (value) => $modalContent = value);
  $$result.css.add(css);
  $$unsubscribe_showModal();
  $$unsubscribe_modalContent();
  return `<div class="app svelte-ijpjar">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="svelte-ijpjar">${slots.default ? slots.default({}) : ``} ${$showModal ? `${validate_component(Modal, "Modal").$$render($$result, { onClose: () => showModal.set(false) }, {}, {
    default: () => {
      return `${$modalContent.component ? `${validate_component($modalContent.component || missing_component, "svelte:component").$$render($$result, Object.assign({}, $modalContent.props), {}, {})}` : ``}`;
    }
  })}` : ``}</main> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})} </div>`;
});
export {
  Layout as default
};
