import { c as create_ssr_component, a as subscribe, e as escape, d as add_attribute, v as validate_component, f as each } from "./ssr.js";
import { b as base } from "./paths.js";
import { g as getDate, a as getTime } from "./dateFunctions.js";
import { w as writable } from "./index.js";
import { i as isLoading } from "./Spinner.svelte_svelte_type_style_lang.js";
import { S as Spinner } from "./Spinner.js";
const includePastBookings = writable(false);
const css = {
  code: ".loading-container.svelte-um2rbj{display:flex;justify-content:center;padding:2rem}",
  map: '{"version":3,"file":"myBookings.svelte","sources":["myBookings.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { base } from \\"$app/paths\\";\\nimport \\"./myBookings.css\\";\\nimport { getDate, getTime } from \\"$lib/functions/dateFunctions\\";\\nimport { fetchMyBookings, deleteBooking } from \\"$lib/api/bookings\\";\\nimport { includePastBookings, setIncludePastBookings } from \\"../../../stores/includePastBookings\\";\\nimport { isLoading } from \\"../../../stores/loading\\";\\nimport Spinner from \\"../spinner/Spinner.svelte\\";\\nexport let userId;\\nexport let bookings;\\nconst myBookingsLoading = isLoading(\\"myBookings\\");\\nconst deleteBookingLoading = isLoading(\\"deleteBooking\\");\\nlet deletingBookingId = null;\\nconst handleDeleteBooking = async (bookingId) => {\\n  if (!bookingId) return;\\n  deletingBookingId = bookingId;\\n  await deleteBooking(bookingId);\\n  bookings = await fetchMyBookings(userId, $includePastBookings);\\n  deletingBookingId = null;\\n};\\nconst handleIncludePastBookingsChange = async (event) => {\\n  const target = event.target;\\n  setIncludePastBookings(target.checked);\\n  bookings = await fetchMyBookings(userId, $includePastBookings);\\n};\\n<\/script>\\n\\n<div class=\\"booking-cards\\">\\n\\t<div class=\\"my-bookings-header\\">\\n\\t\\t<h3 class=\\"header\\">Dine bookinger</h3>\\n\\t\\t<div class=\\"past-bookings\\">\\n\\t\\t\\t<img src=\\"{base}/include_past.png\\" alt=\\"Inkluder tidligere bookinger\\" />\\n\\t\\t\\t<input\\n\\t\\t\\t\\ttype=\\"checkbox\\"\\n\\t\\t\\t\\tid=\\"includePastBookingsCheckBox\\"\\n\\t\\t\\t\\tbind:checked={$includePastBookings}\\n\\t\\t\\t\\ton:change={handleIncludePastBookingsChange}\\n\\t\\t\\t\\tdisabled={$myBookingsLoading}\\n\\t\\t\\t/>\\n\\t\\t</div>\\n\\t</div>\\n\\n\\t{#if $myBookingsLoading && !deletingBookingId}\\n\\t\\t<div class=\\"loading-container\\">\\n\\t\\t\\t<Spinner size=\\"medium\\" label=\\"Laster bookinger...\\" />\\n\\t\\t</div>\\n\\t{:else}\\n\\t\\t{#each bookings ?? [] as booking (booking.id)}\\n\\t\\t\\t<div class=\\"booking-card\\">\\n\\t\\t\\t\\t<p><strong>Dato: </strong> {getDate(booking.startTime)}</p>\\n\\t\\t\\t\\t<p><strong>Tidsperiode: </strong> {getTime(booking.startTime)} - {getTime(booking.endTime)}</p>\\n\\t\\t\\t\\t<p><strong>Ansvarlig: </strong> {booking.responsibleName}</p>\\n\\t\\t\\t\\t<p><strong>Telefonnummer: </strong> {booking.responsibleNumber}</p>\\n\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\tclass=\\"delete-button\\"\\n\\t\\t\\t\\t\\ton:click={() => handleDeleteBooking(booking.id)}\\n\\t\\t\\t\\t\\tdisabled={$deleteBookingLoading && deletingBookingId === booking.id}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{#if $deleteBookingLoading && deletingBookingId === booking.id}\\n\\t\\t\\t\\t\\t\\t<Spinner size=\\"small\\" inline />\\n\\t\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t\\tSlett booking\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t</button>\\n\\t\\t\\t</div>\\n\\t\\t{:else}\\n\\t\\t\\t<p class=\\"no-bookings\\">Ingen bookinger funnet.</p>\\n\\t\\t{/each}\\n\\t{/if}\\n</div>\\n\\n<style>\\n\\t.loading-container {\\n\\t\\tdisplay: flex;\\n\\t\\tjustify-content: center;\\n\\t\\tpadding: 2rem;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAuEC,gCAAmB,CAClB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,OAAO,CAAE,IACV"}'
};
const MyBookings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $includePastBookings, $$unsubscribe_includePastBookings;
  let $myBookingsLoading, $$unsubscribe_myBookingsLoading;
  let $deleteBookingLoading, $$unsubscribe_deleteBookingLoading;
  $$unsubscribe_includePastBookings = subscribe(includePastBookings, (value) => $includePastBookings = value);
  let { userId } = $$props;
  let { bookings } = $$props;
  const myBookingsLoading = isLoading("myBookings");
  $$unsubscribe_myBookingsLoading = subscribe(myBookingsLoading, (value) => $myBookingsLoading = value);
  const deleteBookingLoading = isLoading("deleteBooking");
  $$unsubscribe_deleteBookingLoading = subscribe(deleteBookingLoading, (value) => $deleteBookingLoading = value);
  let deletingBookingId = null;
  if ($$props.userId === void 0 && $$bindings.userId && userId !== void 0) $$bindings.userId(userId);
  if ($$props.bookings === void 0 && $$bindings.bookings && bookings !== void 0) $$bindings.bookings(bookings);
  $$result.css.add(css);
  $$unsubscribe_includePastBookings();
  $$unsubscribe_myBookingsLoading();
  $$unsubscribe_deleteBookingLoading();
  return `<div class="booking-cards"><div class="my-bookings-header"><h3 class="header" data-svelte-h="svelte-140fvn8">Dine bookinger</h3> <div class="past-bookings"><img src="${escape(base, true) + "/include_past.png"}" alt="Inkluder tidligere bookinger"> <input type="checkbox" id="includePastBookingsCheckBox" ${$myBookingsLoading ? "disabled" : ""}${add_attribute("checked", $includePastBookings, 1)}></div></div> ${$myBookingsLoading && !deletingBookingId ? `<div class="loading-container svelte-um2rbj">${validate_component(Spinner, "Spinner").$$render(
    $$result,
    {
      size: "medium",
      label: "Laster bookinger..."
    },
    {},
    {}
  )}</div>` : `${(bookings ?? []).length ? each(bookings ?? [], (booking) => {
    return `<div class="booking-card"><p><strong data-svelte-h="svelte-1ecltn8">Dato:</strong> ${escape(getDate(booking.startTime))}</p> <p><strong data-svelte-h="svelte-g67kku">Tidsperiode:</strong> ${escape(getTime(booking.startTime))} - ${escape(getTime(booking.endTime))}</p> <p><strong data-svelte-h="svelte-2e59sx">Ansvarlig:</strong> ${escape(booking.responsibleName)}</p> <p><strong data-svelte-h="svelte-106de69">Telefonnummer:</strong> ${escape(booking.responsibleNumber)}</p> <button class="delete-button" ${$deleteBookingLoading && deletingBookingId === booking.id ? "disabled" : ""}>${$deleteBookingLoading && deletingBookingId === booking.id ? `${validate_component(Spinner, "Spinner").$$render($$result, { size: "small", inline: true }, {}, {})}` : `Slett booking`}</button> </div>`;
  }) : `<p class="no-bookings" data-svelte-h="svelte-2e42fa">Ingen bookinger funnet.</p>`}`} </div>`;
});
export {
  MyBookings as M
};
