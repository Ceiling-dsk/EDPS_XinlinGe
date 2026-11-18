(() => {
  "use strict";

  const dayLength = 86400000;
  const utcFormat = (options) => new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" });
  const dateLabel = utcFormat({ year: "numeric", month: "short", day: "numeric" });
  const monthLabel = utcFormat({ month: "short" });
  const iso = (time) => new Date(time).toISOString().slice(0, 10);
  const fromIso = (date) => Date.parse(date + "T00:00:00Z");
  const todayInDenver = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Denver", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const field = (type) => parts.find((item) => item.type === type).value;
    return [field("year"), field("month"), field("day")].join("-");
  };

  function element(tag, name, content) {
    const node = document.createElement(tag);
    node.className = name;
    if (content !== undefined) node.textContent = content;
    return node;
  }

  function density(count) {
    if (!count) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  }

  function validActivity(value) {
    function date(value) {
      if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      const time = fromIso(value);
      return Number.isFinite(time) && iso(time) === value;
    }
    return value && typeof value === "object" && Object.keys(value).sort().join(",") === "asOf,days" &&
      date(value.asOf) && value.days && typeof value.days === "object" && !Array.isArray(value.days) &&
      Object.entries(value.days).every(([day, count]) => date(day) && day <= value.asOf &&
        Number.isSafeInteger(count) && count >= 0);
  }

  function mount(host) {
    let snapshot;
    let counts;
    let recorded;
    let today;
    const card = element("div", "work-activity");
    const top = element("div", "work-activity-head");
    const summary = element("div", "work-activity-summary");
    const headline = element("p", "work-activity-metric");
    const updated = element("p", "work-activity-updated");
    updated.setAttribute("aria-live", "polite");
    summary.append(headline, updated);
    const picker = element("select", "work-activity-picker");
    picker.setAttribute("aria-label", "Work activity date range");
    top.append(summary, picker);

    const scroller = element("div", "work-activity-scroll");
    const calendar = element("div", "work-activity-calendar");
    calendar.setAttribute("role", "group");
    calendar.setAttribute("aria-label", "Daily work entries. Use the arrow keys to explore dates.");
    scroller.append(calendar);
    const foot = element("div", "work-activity-foot");
    const detail = element("p", "work-activity-detail");
    detail.setAttribute("aria-live", "polite");
    detail.setAttribute("aria-atomic", "true");
    const legend = element("div", "work-activity-legend");
    legend.setAttribute("role", "img");
    legend.setAttribute("aria-label", "Intensity scale: 0, 1, 2 to 3, 4 to 5, and 6 or more entries.");
    legend.append(element("span", "", "Less"));
    for (let level = 0; level <= 4; level++) {
      legend.append(element("i", "work-activity-swatch work-level-" + level));
    }
    legend.append(element("span", "", "More"));
    foot.append(detail, legend);
    card.append(top, scroller, foot);
    host.replaceChildren(card);

    let buttons;
    let selected;

    function select(button) {
      if (selected) {
        selected.tabIndex = -1;
        selected.removeAttribute("data-selected");
      }
      button.tabIndex = 0;
      button.setAttribute("data-selected", "");
      detail.textContent = button.getAttribute("aria-label");
      selected = button;
    }

    function draw(preserve = false) {
      const previousDate = preserve && selected?.dataset.date;
      const restoreFocus = preserve && calendar.contains(document.activeElement);
      const previousScroll = scroller.scrollLeft;
      const isRolling = picker.value === "rolling";
      const end = isRolling ? fromIso(today) : Date.UTC(Number(picker.value), 11, 31);
      // An inclusive 12-month window handles leap years as calendar dates.
      const anniversary = new Date(end + dayLength);
      anniversary.setUTCFullYear(anniversary.getUTCFullYear() - 1);
      const start = isRolling ? anniversary.getTime() : Date.UTC(Number(picker.value), 0, 1);
      const firstDay = iso(start);
      const lastDay = iso(end);
      const active = recorded.filter((date) => date >= firstDay && date <= lastDay && counts[date] > 0);
      const total = active.reduce((sum, date) => sum + counts[date], 0);
      headline.textContent = total + (total === 1 ? " entry on " : " entries on ") +
        active.length + (active.length === 1 ? " day" : " days");
      const origin = start - new Date(start).getUTCDay() * dayLength;
      const weeks = Math.floor((end - origin) / (dayLength * 7)) + 1;
      calendar.style.setProperty("--work-weeks", String(weeks));
      const fragment = document.createDocumentFragment();
      [["Mon", 1], ["Wed", 3], ["Fri", 5]].forEach(([name, weekday]) => {
        const label = element("span", "work-activity-weekday", name);
        label.style.gridArea = (weekday + 2) + " / 1";
        label.setAttribute("aria-hidden", "true");
        fragment.append(label);
      });
      const lastSelectable = lastDay > today ? today : lastDay;
      const latest = previousDate && previousDate >= firstDay && previousDate <= lastSelectable ? previousDate :
        active.at(-1) || (snapshot.asOf < lastSelectable && snapshot.asOf >= firstDay ? snapshot.asOf : lastSelectable);
      const chosen = fromIso(latest);
      selected = null;
      buttons = [];
      for (let time = start; time <= end; time += dayLength) {
        const date = new Date(time);
        const key = iso(time);
        const count = counts[key] || 0;
        const week = Math.floor((time - origin) / (dayLength * 7));
        if ((time === start && date.getUTCDate() <= 14) || date.getUTCDate() === 1) {
          const label = element("span", "work-activity-month", monthLabel.format(time));
          label.style.gridArea = "1 / " + (week + 2) + " / 2 / span " + Math.min(3, weeks - week);
          label.setAttribute("aria-hidden", "true");
          fragment.append(label);
        }
        if (key > today) continue;
        const unknown = key > snapshot.asOf;
        const button = element("button", "work-activity-day " + (unknown ? "work-level-unknown" : "work-level-" + density(count)));
        button.type = "button";
        button.tabIndex = -1;
        button.style.gridArea = (date.getUTCDay() + 2) + " / " + (week + 2);
        const quantity = unknown ? "awaiting next update" : count + (count === 1 ? " entry" : " entries");
        button.title = dateLabel.format(time) + " · " + quantity;
        button.setAttribute("aria-label", button.title);
        button.dataset.index = buttons.length;
        button.dataset.date = key;
        buttons.push(button);
        fragment.append(button);
        if (time === chosen) select(button);
      }
      calendar.replaceChildren(fragment);
      // Start the narrow-screen view at the most recent months while keeping all weeks reachable.
      scroller.scrollLeft = preserve ? previousScroll : scroller.scrollWidth;
      if (restoreFocus && selected) selected.focus({ preventScroll: true });
    }

    calendar.addEventListener("focusin", (event) => {
      if (event.target.matches("button")) select(event.target);
    });
    calendar.addEventListener("click", (event) => {
      if (event.target.matches("button")) select(event.target);
    });
    calendar.addEventListener("pointerover", (event) => {
      if (event.target.matches("button") && event.pointerType !== "touch") {
        detail.textContent = event.target.getAttribute("aria-label");
      }
    });
    calendar.addEventListener("pointerleave", () => {
      if (selected) detail.textContent = selected.getAttribute("aria-label");
    });
    calendar.addEventListener("keydown", (event) => {
      const index = Number(event.target.dataset.index);
      if (!Number.isInteger(index)) return;
      const steps = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7, Home: -index, End: buttons.length - 1 - index };
      if (!(event.key in steps)) return;
      event.preventDefault();
      const next = Math.max(0, Math.min(index + steps[event.key], buttons.length - 1));
      buttons[next].focus();
    });
    picker.addEventListener("change", () => draw());

    return (next, label) => {
      updated.textContent = label + dateLabel.format(fromIso(next.asOf));
      const localDay = todayInDenver();
      if (next === snapshot && today === localDay) return;
      const hasPrevious = Boolean(snapshot);
      const range = picker.value || "rolling";
      snapshot = next;
      counts = next.days;
      recorded = Object.keys(counts).sort();
      today = localDay;
      const year = Number(today.slice(0, 4));
      let firstYear = recorded.length ? Number(recorded[0].slice(0, 4)) : year;
      if (range !== "rolling") firstYear = Math.min(firstYear, Number(range));
      picker.replaceChildren(new Option("Past 12 months", "rolling"));
      for (let option = year; option >= firstYear; option--) picker.add(new Option(option, option));
      picker.value = range;
      draw(hasPrevious);
    };
  }

  function connect(host) {
    let last = validActivity(window.workLogActivity) ? window.workLogActivity : null;
    let render;
    let receivedLive = false;
    let pending = false;
    function show(data, label) {
      if (!render) render = mount(host);
      render(data, label);
    }
    if (last) show(last, "Checking live counts · Saved snapshot through ");
    else host.textContent = "Loading work activity…";

    async function refresh() {
      if (pending) return;
      pending = true;
      const timeout = new AbortController();
      const timer = setTimeout(() => timeout.abort(), 8000);
      try {
        const feed = new URL(host.dataset.activityFeed);
        if (feed.protocol !== "https:") throw new Error();
        const result = await fetch(feed, { cache: "no-store", credentials: "omit", signal: timeout.signal });
        if (!result.ok) throw new Error();
        const data = await result.json();
        if (!validActivity(data)) throw new Error();
        last = data;
        receivedLive = true;
        show(last, "Online work log · Counts through ");
      } catch {
        if (last) show(last, receivedLive ? "Live refresh unavailable · Last known counts through " :
          "Live counts unavailable · Saved snapshot through ");
        else host.textContent = "Work activity is currently unavailable.";
      } finally {
        clearTimeout(timer);
        pending = false;
      }
    }
    refresh();
    window.addEventListener("pageshow", event => { if (event.persisted) refresh(); });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
    window.addEventListener("online", refresh);
  }
  document.querySelectorAll("[data-activity]").forEach(connect);
})();
