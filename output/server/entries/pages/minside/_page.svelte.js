import { c as create_ssr_component, a as subscribe, d as add_attribute, v as validate_component } from "../../../chunks/ssr.js";
import { M as MyBookings } from "../../../chunks/myBookings.js";
import { i as isLoading } from "../../../chunks/Spinner.svelte_svelte_type_style_lang.js";
import "../../../chunks/client.js";
import { S as Spinner } from "../../../chunks/Spinner.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $updateUserLoading, $$unsubscribe_updateUserLoading;
  const updateUserLoading = isLoading("updateUser");
  $$unsubscribe_updateUserLoading = subscribe(updateUserLoading, (value) => $updateUserLoading = value);
  let user = {
    id: "",
    name: "",
    phoneNumber: "",
    email: "",
    apartmentNumber: ""
  };
  let bookings = [];
  $$unsubscribe_updateUserLoading();
  return `${$$result.head += `<!-- HEAD_svelte-1nzo3ew_START -->${$$result.title = `<title>Min side</title>`, ""}<meta name="description" content="Dette er min side"><!-- HEAD_svelte-1nzo3ew_END -->`, ""} <div class="min-side-container"><section class="min-side-user"><h3 class="header" data-svelte-h="svelte-1c9kt2v">Din profil</h3> <form><div class="min-side-inputcolumn"><p class="profile-input-label" data-svelte-h="svelte-1kn12l1">Navn:</p> <input ${$updateUserLoading ? "disabled" : ""}${add_attribute("value", user.name, 0)}> <p class="profile-input-label" data-svelte-h="svelte-ktcbq8">Tlf:</p> <input ${$updateUserLoading ? "disabled" : ""}${add_attribute("value", user.phoneNumber, 0)}> <p class="profile-input-label" data-svelte-h="svelte-x26mff">Epost:</p> <input ${$updateUserLoading ? "disabled" : ""}${add_attribute("value", user.email, 0)}> <p class="profile-input-label" data-svelte-h="svelte-1uqrgzq">Leilighetsnummer:</p> <input ${$updateUserLoading ? "disabled" : ""}${add_attribute("value", user.apartmentNumber, 0)}></div> <div class="inputcolumn"><button type="submit" class="button" ${$updateUserLoading ? "disabled" : ""}>${$updateUserLoading ? `${validate_component(Spinner, "Spinner").$$render($$result, { size: "small", inline: true }, {}, {})}
						Lagrer...` : `Lagre endringer`}</button></div></form></section> <section class="min-side-bookings">${validate_component(MyBookings, "MineBookinger").$$render($$result, { userId: user.id, bookings }, {}, {})}</section></div>`;
});
export {
  Page as default
};
