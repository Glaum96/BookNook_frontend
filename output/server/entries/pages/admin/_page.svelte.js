import { c as create_ssr_component, a as subscribe, f as each, v as validate_component, e as escape } from "../../../chunks/ssr.js";
import "../../../chunks/client.js";
import { i as isLoading } from "../../../chunks/Spinner.svelte_svelte_type_style_lang.js";
import { g as getDate, a as getTime } from "../../../chunks/dateFunctions.js";
import { S as Spinner } from "../../../chunks/Spinner.js";
const css = {
  code: ".loading-container.svelte-um2rbj{display:flex;justify-content:center;padding:2rem}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { onMount } from \\"svelte\\";\\nimport \\"./admin.css\\";\\nimport { globalOnMount } from \\"$lib/api/globalOnMount\\";\\nimport { getDate, getTime } from \\"$lib/functions/dateFunctions.js\\";\\nimport { deleteBooking, fetchAllBookings } from \\"$lib/api/bookings\\";\\nimport { deleteUser, fetchAllUsers } from \\"$lib/api/users\\";\\nimport { isLoading } from \\"../../stores/loading\\";\\nimport Spinner from \\"$lib/components/spinner/Spinner.svelte\\";\\nconst usersLoading = isLoading(\\"users\\");\\nconst bookingsLoading = isLoading(\\"bookings\\");\\nconst deleteBookingLoading = isLoading(\\"deleteBooking\\");\\nconst deleteUserLoading = isLoading(\\"deleteUser\\");\\nlet deletingBookingId = null;\\nlet deletingUserId = null;\\nonMount(() => {\\n  globalOnMount();\\n});\\nlet users = [];\\nlet bookings = [];\\nonMount(async () => {\\n  bookings = await fetchAllBookings();\\n  users = await fetchAllUsers();\\n});\\nconst handleDeleteBooking = async (bookingId) => {\\n  deletingBookingId = bookingId;\\n  await deleteBooking(bookingId);\\n  bookings = await fetchAllBookings();\\n  deletingBookingId = null;\\n};\\nconst handleDeleteUser = async (userId) => {\\n  deletingUserId = userId;\\n  await deleteUser(userId);\\n  users = await fetchAllUsers();\\n  deletingUserId = null;\\n};\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>Admin</title>\\n\\t<meta name=\\"description\\" content=\\"Dette er admin-siden\\" />\\n</svelte:head>\\n\\n<div class=\\"admin-container\\">\\n\\t<section class=\\"users-admin-panel\\">\\n\\t\\t<h3 class=\\"admin-heading\\">Alle brukere:</h3>\\n\\t\\t{#if $usersLoading && users.length === 0}\\n\\t\\t\\t<div class=\\"loading-container\\">\\n\\t\\t\\t\\t<Spinner size=\\"medium\\" label=\\"Laster brukere...\\" />\\n\\t\\t\\t</div>\\n\\t\\t{:else}\\n\\t\\t\\t<table class=\\"admin-user-table\\">\\n\\t\\t\\t\\t<thead>\\n\\t\\t\\t\\t\\t<tr>\\n\\t\\t\\t\\t\\t\\t<th>Navn</th>\\n\\t\\t\\t\\t\\t\\t<th>Epost</th>\\n\\t\\t\\t\\t\\t\\t<th>Leilighetsnummer</th>\\n\\t\\t\\t\\t\\t\\t<th>Bruker-id</th>\\n\\t\\t\\t\\t\\t\\t<th></th>\\n\\t\\t\\t\\t\\t</tr>\\n\\t\\t\\t\\t</thead>\\n\\t\\t\\t\\t<tbody>\\n\\t\\t\\t\\t\\t{#each users as user (user.id)}\\n\\t\\t\\t\\t\\t\\t<tr>\\n\\t\\t\\t\\t\\t\\t\\t<td>{user.name}</td>\\n\\t\\t\\t\\t\\t\\t\\t<td>{user.email}</td>\\n\\t\\t\\t\\t\\t\\t\\t<td>{user.apartmentNumber}</td>\\n\\t\\t\\t\\t\\t\\t\\t<td>{user.id}</td>\\n\\t\\t\\t\\t\\t\\t\\t<td class=\\"button-container\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"delete-button\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() => handleDeleteUser(user.id)}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tdisabled={$deleteUserLoading && deletingUserId === user.id}\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if $deleteUserLoading && deletingUserId === user.id}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<Spinner size=\\"small\\" inline />\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tSlett\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t\\t\\t\\t</td>\\n\\t\\t\\t\\t\\t\\t</tr>\\n\\t\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t\\t<tr>\\n\\t\\t\\t\\t\\t\\t\\t<td colspan=\\"5\\" class=\\"no-users\\">Ingen brukere funnet</td>\\n\\t\\t\\t\\t\\t\\t</tr>\\n\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t</tbody>\\n\\t\\t\\t</table>\\n\\t\\t{/if}\\n\\t</section>\\n\\t<section class=\\"bookings\\">\\n\\t\\t<h3 class=\\"heading\\">Alle bookinger:</h3>\\n\\t\\t{#if $bookingsLoading && bookings.length === 0}\\n\\t\\t\\t<div class=\\"loading-container\\">\\n\\t\\t\\t\\t<Spinner size=\\"medium\\" label=\\"Laster bookinger...\\" />\\n\\t\\t\\t</div>\\n\\t\\t{:else}\\n\\t\\t\\t<table class=\\"admin-booking-table\\">\\n\\t\\t\\t\\t<thead>\\n\\t\\t\\t\\t\\t<tr>\\n\\t\\t\\t\\t\\t\\t<th>Dato</th>\\n\\t\\t\\t\\t\\t\\t<th>Tidspunkt</th>\\n\\t\\t\\t\\t\\t\\t<th>Ansvarlig</th>\\n\\t\\t\\t\\t\\t\\t<th>Telefonnummer</th>\\n\\t\\t\\t\\t\\t\\t<th></th>\\n\\t\\t\\t\\t\\t</tr>\\n\\t\\t\\t\\t</thead>\\n\\t\\t\\t\\t<tbody>\\n\\t\\t\\t\\t\\t{#each bookings as booking (booking.id)}\\n\\t\\t\\t\\t\\t\\t<tr>\\n\\t\\t\\t\\t\\t\\t\\t<td>{getDate(booking.startTime)}</td>\\n\\t\\t\\t\\t\\t\\t\\t<td>{getTime(booking.startTime)} - {getTime(booking.endTime)}</td>\\n\\t\\t\\t\\t\\t\\t\\t<td>{booking.responsibleName}</td>\\n\\t\\t\\t\\t\\t\\t\\t<td>{booking.responsibleNumber}</td>\\n\\t\\t\\t\\t\\t\\t\\t<td class=\\"button-container\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"delete-button\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() => handleDeleteBooking(booking.id)}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tdisabled={$deleteBookingLoading && deletingBookingId === booking.id}\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if $deleteBookingLoading && deletingBookingId === booking.id}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<Spinner size=\\"small\\" inline />\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tSlett\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t\\t\\t\\t</td>\\n\\t\\t\\t\\t\\t\\t</tr>\\n\\t\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t\\t<tr>\\n\\t\\t\\t\\t\\t\\t\\t<td colspan=\\"5\\" class=\\"no-bookings\\">Ingen bookinger funnet</td>\\n\\t\\t\\t\\t\\t\\t</tr>\\n\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t</tbody>\\n\\t\\t\\t</table>\\n\\t\\t{/if}\\n\\t</section>\\n</div>\\n\\n<style>\\n\\t.loading-container {\\n\\t\\tdisplay: flex;\\n\\t\\tjustify-content: center;\\n\\t\\tpadding: 2rem;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA4IC,gCAAmB,CAClB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,OAAO,CAAE,IACV"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $usersLoading, $$unsubscribe_usersLoading;
  let $deleteUserLoading, $$unsubscribe_deleteUserLoading;
  let $bookingsLoading, $$unsubscribe_bookingsLoading;
  let $deleteBookingLoading, $$unsubscribe_deleteBookingLoading;
  const usersLoading = isLoading("users");
  $$unsubscribe_usersLoading = subscribe(usersLoading, (value) => $usersLoading = value);
  const bookingsLoading = isLoading("bookings");
  $$unsubscribe_bookingsLoading = subscribe(bookingsLoading, (value) => $bookingsLoading = value);
  const deleteBookingLoading = isLoading("deleteBooking");
  $$unsubscribe_deleteBookingLoading = subscribe(deleteBookingLoading, (value) => $deleteBookingLoading = value);
  const deleteUserLoading = isLoading("deleteUser");
  $$unsubscribe_deleteUserLoading = subscribe(deleteUserLoading, (value) => $deleteUserLoading = value);
  let deletingBookingId = null;
  let deletingUserId = null;
  let users = [];
  let bookings = [];
  $$result.css.add(css);
  $$unsubscribe_usersLoading();
  $$unsubscribe_deleteUserLoading();
  $$unsubscribe_bookingsLoading();
  $$unsubscribe_deleteBookingLoading();
  return `${$$result.head += `<!-- HEAD_svelte-1sbg15o_START -->${$$result.title = `<title>Admin</title>`, ""}<meta name="description" content="Dette er admin-siden"><!-- HEAD_svelte-1sbg15o_END -->`, ""} <div class="admin-container"><section class="users-admin-panel"><h3 class="admin-heading" data-svelte-h="svelte-10g4dfn">Alle brukere:</h3> ${$usersLoading && users.length === 0 ? `<div class="loading-container svelte-um2rbj">${validate_component(Spinner, "Spinner").$$render(
    $$result,
    {
      size: "medium",
      label: "Laster brukere..."
    },
    {},
    {}
  )}</div>` : `<table class="admin-user-table"><thead data-svelte-h="svelte-1u2oc9p"><tr><th>Navn</th> <th>Epost</th> <th>Leilighetsnummer</th> <th>Bruker-id</th> <th></th></tr></thead> <tbody>${users.length ? each(users, (user) => {
    return `<tr><td>${escape(user.name)}</td> <td>${escape(user.email)}</td> <td>${escape(user.apartmentNumber)}</td> <td>${escape(user.id)}</td> <td class="button-container"><button class="delete-button" ${$deleteUserLoading && deletingUserId === user.id ? "disabled" : ""}>${$deleteUserLoading && deletingUserId === user.id ? `${validate_component(Spinner, "Spinner").$$render($$result, { size: "small", inline: true }, {}, {})}` : `Slett`} </button></td> </tr>`;
  }) : `<tr data-svelte-h="svelte-b9onbw"><td colspan="5" class="no-users">Ingen brukere funnet</td> </tr>`}</tbody></table>`}</section> <section class="bookings"><h3 class="heading" data-svelte-h="svelte-8joc5v">Alle bookinger:</h3> ${$bookingsLoading && bookings.length === 0 ? `<div class="loading-container svelte-um2rbj">${validate_component(Spinner, "Spinner").$$render(
    $$result,
    {
      size: "medium",
      label: "Laster bookinger..."
    },
    {},
    {}
  )}</div>` : `<table class="admin-booking-table"><thead data-svelte-h="svelte-18voguk"><tr><th>Dato</th> <th>Tidspunkt</th> <th>Ansvarlig</th> <th>Telefonnummer</th> <th></th></tr></thead> <tbody>${bookings.length ? each(bookings, (booking) => {
    return `<tr><td>${escape(getDate(booking.startTime))}</td> <td>${escape(getTime(booking.startTime))} - ${escape(getTime(booking.endTime))}</td> <td>${escape(booking.responsibleName)}</td> <td>${escape(booking.responsibleNumber)}</td> <td class="button-container"><button class="delete-button" ${$deleteBookingLoading && deletingBookingId === booking.id ? "disabled" : ""}>${$deleteBookingLoading && deletingBookingId === booking.id ? `${validate_component(Spinner, "Spinner").$$render($$result, { size: "small", inline: true }, {}, {})}` : `Slett`} </button></td> </tr>`;
  }) : `<tr data-svelte-h="svelte-6yrrjq"><td colspan="5" class="no-bookings">Ingen bookinger funnet</td> </tr>`}</tbody></table>`}</section> </div>`;
});
export {
  Page as default
};
