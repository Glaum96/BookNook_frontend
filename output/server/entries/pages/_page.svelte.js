import { c as create_ssr_component, b as compute_rest_props, d as add_attribute, f as each, v as validate_component, m as missing_component, a as subscribe } from "../../chunks/ssr.js";
import { M as MyBookings } from "../../chunks/myBookings.js";
import "../../chunks/client.js";
import { b as base } from "../../chunks/paths.js";
import { i as isAuthenticated } from "../../chunks/auth.js";
import { i as isLoading } from "../../chunks/Spinner.svelte_svelte_type_style_lang.js";
import { createViewDay, createViewWeek, createViewMonthGrid, createViewList, viewWeek, createCalendar } from "@schedule-x/calendar";
import { S as Spinner } from "../../chunks/Spinner.js";
const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);
const randomStringId = () => "s" + Math.random().toString(36).substring(2, 11);
const Portal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { target = "body" } = $$props;
  if ($$props.target === void 0 && $$bindings.target && target !== void 0) $$bindings.target(target);
  return `<div style="height: 100%; width: 100%" hidden>${slots.default ? slots.default({}) : ``}</div>`;
});
const { Object: Object_1 } = globals;
const Schedule_x_calendar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let wrapperId;
  compute_rest_props($$props, ["calendarApp"]);
  let { calendarApp } = $$props;
  let customComponentsMeta = [];
  if ($$props.calendarApp === void 0 && $$bindings.calendarApp && calendarApp !== void 0) $$bindings.calendarApp(calendarApp);
  wrapperId = randomStringId();
  return `<div><div class="sx-svelte-calendar-wrapper"${add_attribute("id", wrapperId, 0)}></div> ${each(customComponentsMeta, (customComponent) => {
    return `${customComponent.Component ? `${validate_component(Portal, "Portal").$$render($$result, { target: customComponent.wrapperElement }, {}, {
      default: () => {
        return `${validate_component(customComponent.Component || missing_component, "svelte:component").$$render($$result, Object_1.assign({}, customComponent.props), {}, {})} `;
      }
    })}` : ``}`;
  })}</div>`;
});
const getFormattedDateOfFirstDayOfPreviousMonth = () => {
  const dateOfFirstDayOfPreviousMonth = /* @__PURE__ */ new Date();
  dateOfFirstDayOfPreviousMonth.setDate(1);
  dateOfFirstDayOfPreviousMonth.setMonth(dateOfFirstDayOfPreviousMonth.getMonth() - 1);
  dateOfFirstDayOfPreviousMonth.setHours(0, 0, 0, 0);
  return dateOfFirstDayOfPreviousMonth.toISOString().split("T")[0];
};
const getFormattedDateOfDayOneMonthFromToday = () => {
  const dateOfDayOneMonthFromToday = /* @__PURE__ */ new Date();
  dateOfDayOneMonthFromToday.setDate(1);
  dateOfDayOneMonthFromToday.setMonth(dateOfDayOneMonthFromToday.getMonth() + 1);
  dateOfDayOneMonthFromToday.setHours(0, 0, 0, 0);
  return dateOfDayOneMonthFromToday.toISOString().split("T")[0];
};
const getTimeOfDayConstraints = () => ({
  start: "06:00",
  end: "23:00"
});
const getViews = () => {
  const views = [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewList()];
  if (!isNonEmptyArray(views)) {
    throw new Error("No views provided to the calendar");
  } else {
    return views;
  }
};
const isNonEmptyArray = (arr) => {
  return Array.isArray(arr) && arr.length > 0;
};
const css = {
  code: ".loading-container.svelte-1s2q5yp{display:flex;justify-content:center;align-items:center;min-height:400px}.sx__time-grid-event{border-radius:8px;box-shadow:0 2px 4px rgba(0, 0, 0, 0.15)}.booking-event{background-color:#002776 !important;border-left:4px solid #0056b3}.sx__time-grid-event-title{font-size:0.95rem;font-weight:600}.sx__time-grid-event-people{font-size:0.8rem;opacity:0.85;margin-top:2px}.sx__time-grid-event-location{font-size:0.75rem;opacity:0.7}.sx__month-grid-event{border-radius:4px}.sx__month-grid-event.booking-event{background-color:#002776 !important}.sx__date-grid-event.booking-event{background-color:#002776 !important;border-radius:4px}",
  map: '{"version":3,"file":"calendar.svelte","sources":["calendar.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { ScheduleXCalendar } from \\"@schedule-x/svelte\\";\\nimport {\\n  createCalendar,\\n  createViewDay,\\n  createViewList,\\n  createViewMonthGrid,\\n  createViewWeek,\\n  viewWeek\\n} from \\"@schedule-x/calendar\\";\\nimport \\"@schedule-x/theme-default/dist/index.css\\";\\nimport {\\n  getFormattedDateOfDayOneMonthFromToday,\\n  getFormattedDateOfFirstDayOfPreviousMonth,\\n  getTimeOfDayConstraints,\\n  getViews\\n} from \\"./utils\\";\\nimport { getBookings } from \\"./getBookings\\";\\nimport { onMount } from \\"svelte\\";\\nimport Spinner from \\"../spinner/Spinner.svelte\\";\\nimport { isLoading } from \\"../../../stores/loading\\";\\nconst calendarLoading = isLoading(\\"bookings\\");\\nlet initialLoadComplete = false;\\nlet bookings = [\\n  {\\n    id: \\"1\\",\\n    title: \\"Event 1\\",\\n    start: \\"2025-07-17\\",\\n    end: \\"2025-07-17\\"\\n  },\\n  {\\n    id: \\"2\\",\\n    title: \\"Event 2\\",\\n    start: \\"2025-07-18 15:00\\",\\n    end: \\"2025-07-18 18:00\\"\\n  }\\n];\\nconst darkMode = false;\\nlet calendarConfig = {\\n  views: getViews(),\\n  locale: \\"nb-NO\\",\\n  isDark: darkMode,\\n  defaultView: viewWeek.name,\\n  showWeekNumbers: true,\\n  dayBoundaries: getTimeOfDayConstraints(),\\n  minDate: getFormattedDateOfFirstDayOfPreviousMonth(),\\n  maxDate: getFormattedDateOfDayOneMonthFromToday(),\\n  weekOptions: {\\n    eventWidth: 100,\\n    nDays: 7,\\n    eventOverlap: false\\n  },\\n  events: bookings\\n};\\nlet calendarApp = createCalendar(calendarConfig);\\nonMount(async () => {\\n  try {\\n    const bookingsFromServer = await getBookings();\\n    bookings = [...bookings, ...bookingsFromServer];\\n    calendarConfig = { ...calendarConfig, events: bookings };\\n    calendarApp = createCalendar(calendarConfig);\\n    initialLoadComplete = true;\\n  } catch (error) {\\n    console.error(\\"Error fetching bookings:\\", error);\\n    initialLoadComplete = true;\\n  }\\n});\\n<\/script>\\n\\n{#if $calendarLoading || !initialLoadComplete}\\n\\t<div class=\\"loading-container\\">\\n\\t\\t<Spinner size=\\"large\\" label=\\"Laster kalender...\\" />\\n\\t</div>\\n{:else}\\n\\t<div>\\n\\t\\t<ScheduleXCalendar {calendarApp} />\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t.loading-container {\\n\\t\\tdisplay: flex;\\n\\t\\tjustify-content: center;\\n\\t\\talign-items: center;\\n\\t\\tmin-height: 400px;\\n\\t}\\n\\n\\t/* ScheduleX event styling - must use :global() for library classes */\\n\\t:global(.sx__time-grid-event) {\\n\\t\\tborder-radius: 8px;\\n\\t\\tbox-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);\\n\\t}\\n\\n\\t:global(.booking-event) {\\n\\t\\tbackground-color: #002776 !important;\\n\\t\\tborder-left: 4px solid #0056b3;\\n\\t}\\n\\n\\t:global(.sx__time-grid-event-title) {\\n\\t\\tfont-size: 0.95rem;\\n\\t\\tfont-weight: 600;\\n\\t}\\n\\n\\t:global(.sx__time-grid-event-people) {\\n\\t\\tfont-size: 0.8rem;\\n\\t\\topacity: 0.85;\\n\\t\\tmargin-top: 2px;\\n\\t}\\n\\n\\t:global(.sx__time-grid-event-location) {\\n\\t\\tfont-size: 0.75rem;\\n\\t\\topacity: 0.7;\\n\\t}\\n\\n\\t/* Month grid events */\\n\\t:global(.sx__month-grid-event) {\\n\\t\\tborder-radius: 4px;\\n\\t}\\n\\n\\t:global(.sx__month-grid-event.booking-event) {\\n\\t\\tbackground-color: #002776 !important;\\n\\t}\\n\\n\\t/* Date grid events */\\n\\t:global(.sx__date-grid-event.booking-event) {\\n\\t\\tbackground-color: #002776 !important;\\n\\t\\tborder-radius: 4px;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA+EC,iCAAmB,CAClB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,KACb,CAGQ,oBAAsB,CAC7B,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CACzC,CAEQ,cAAgB,CACvB,gBAAgB,CAAE,OAAO,CAAC,UAAU,CACpC,WAAW,CAAE,GAAG,CAAC,KAAK,CAAC,OACxB,CAEQ,0BAA4B,CACnC,SAAS,CAAE,OAAO,CAClB,WAAW,CAAE,GACd,CAEQ,2BAA6B,CACpC,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,GACb,CAEQ,6BAA+B,CACtC,SAAS,CAAE,OAAO,CAClB,OAAO,CAAE,GACV,CAGQ,qBAAuB,CAC9B,aAAa,CAAE,GAChB,CAEQ,mCAAqC,CAC5C,gBAAgB,CAAE,OAAO,CAAC,UAC3B,CAGQ,kCAAoC,CAC3C,gBAAgB,CAAE,OAAO,CAAC,UAAU,CACpC,aAAa,CAAE,GAChB"}'
};
const darkMode = false;
const Calendar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $calendarLoading, $$unsubscribe_calendarLoading;
  const calendarLoading = isLoading("bookings");
  $$unsubscribe_calendarLoading = subscribe(calendarLoading, (value) => $calendarLoading = value);
  let initialLoadComplete = false;
  let bookings = [
    {
      id: "1",
      title: "Event 1",
      start: "2025-07-17",
      end: "2025-07-17"
    },
    {
      id: "2",
      title: "Event 2",
      start: "2025-07-18 15:00",
      end: "2025-07-18 18:00"
    }
  ];
  let calendarConfig = {
    views: getViews(),
    locale: "nb-NO",
    isDark: darkMode,
    defaultView: viewWeek.name,
    showWeekNumbers: true,
    dayBoundaries: getTimeOfDayConstraints(),
    minDate: getFormattedDateOfFirstDayOfPreviousMonth(),
    maxDate: getFormattedDateOfDayOneMonthFromToday(),
    weekOptions: {
      eventWidth: 100,
      nDays: 7,
      eventOverlap: false
    },
    events: bookings
  };
  let calendarApp = createCalendar(calendarConfig);
  $$result.css.add(css);
  $$unsubscribe_calendarLoading();
  return `${$calendarLoading || !initialLoadComplete ? `<div class="loading-container svelte-1s2q5yp">${validate_component(Spinner, "Spinner").$$render(
    $$result,
    {
      size: "large",
      label: "Laster kalender..."
    },
    {},
    {}
  )}</div>` : `<div>${validate_component(Schedule_x_calendar, "ScheduleXCalendar").$$render($$result, { calendarApp }, {}, {})}</div>`}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  let user = {
    id: "",
    name: "",
    phoneNumber: "",
    email: "",
    apartmentNumber: ""
  };
  let bookings = [];
  $$unsubscribe_isAuthenticated();
  return `${$$result.head += `<!-- HEAD_svelte-1no832r_START -->${$$result.title = `<title>BookNook</title>`, ""}<a${add_attribute("href", base, 0)} data-svelte-h="svelte-1fwv34j">Home-test</a><meta name="description" content="Svelte demo app"><!-- HEAD_svelte-1no832r_END -->`, ""} ${$isAuthenticated ? `<div class="main-container"><section class="calendar-section">${validate_component(Calendar, "Calendar").$$render($$result, {}, {}, {})}</section> <section class="your-bookings">${validate_component(MyBookings, "MineBookinger").$$render($$result, { userId: user.id, bookings }, {}, {})}</section></div>` : ``}`;
});
export {
  Page as default
};
