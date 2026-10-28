/* IP Scan: a short adaptive questionnaire that produces a prioritized IP brief.
   Used on the homepage (interactive) and the contact page (to carry the brief into the form).
   General information only; the wording is deliberately hedged. */
(() => {
  const STEPS = [
    { id: "what", multi: true, q: "What are you looking to protect?", hint: "Choose all that apply.",
      opts: [["brand", "A name, logo or slogan"], ["invention", "An invention, process or machine"], ["design", "The look or shape of a product"], ["creative", "Software, content or creative work"], ["secret", "A formula, method or know-how"]] },
    { id: "stage", q: "Where is the business today?",
      opts: [["idea", "Still at the idea stage"], ["launch", "Getting ready to launch"], ["selling", "Already selling"], ["raising", "Raising money or preparing to sell"], ["dispute", "Dealing with a copycat or dispute"]] },
    { id: "use", q: "Are you already using the name or logo?", when: (a) => has(a, "brand"),
      opts: [["none", "Not yet; we’re still choosing"], ["local", "Yes, in one city or region"], ["wide", "Yes, in several states or online"]] },
    { id: "shown", q: "Has the invention or design been shown, sold or published?", hint: "Include pitches, crowdfunding, trade shows and online posts.", when: (a) => has(a, "invention") || has(a, "design"),
      opts: [["no", "Not yet"], ["recent", "Yes, within the past year"], ["old", "Yes, more than a year ago"], ["unsure", "I’m not sure"]] },
    { id: "mkt", q: "Where do you sell, or plan to?",
      opts: [["us", "The United States only"], ["intl", "The U.S. and other countries"], ["unsure", "Not sure yet"]] },
  ];
  const has = (a, v) => (a.what || []).includes(v);
  const TOPIC = { brand: "Trademark", invention: "Utility patent", design: "Design patent", creative: "Copyright", secret: "Trade secret" };

  function recommend(a) {
    const r = [];
    const add = (pri, title, text) => r.push({ pri, title, text });
    if (has(a, "brand")) {
      if (a.use === "local") add("now", "Register to take your name nationwide", "Using a name builds rights only where you do business. A federal registration extends them across the U.S. and keeps a newcomer from boxing you in.");
      else if (a.use === "wide") add("now", "Register the brand you’ve already built", "You likely have common-law rights, but they’re harder to prove and enforce. Registration adds nationwide priority, the ® symbol and a legal presumption that the mark is yours.");
      else add("now", "Clear the name before you invest in it", "A clearance search shows whether someone already has rights to the name. If it’s clear, an intent-to-use application can reserve it before you launch.");
    }
    const tech = has(a, "invention"), look = has(a, "design");
    if (tech || look) {
      const what = tech && look ? "invention and design" : tech ? "invention" : "design";
      if (a.shown === "recent") add("urgent", `File before your one-year window closes`, `In the U.S., you generally have one year from your own public disclosure to file for the ${what}. Many other countries allow no grace period, so foreign rights may already be at risk.`);
      else if (a.shown === "old") add("urgent", "Find out what’s still protectable", `A disclosure more than a year ago can bar a U.S. patent on that version of the ${what}. Improvements, new features and other forms of protection may still be available. This is worth a conversation soon.`);
      else if (a.shown === "unsure") add("now", "Pin down your disclosure dates", "Whether, and when, you’ve shown or sold it shapes your patent options. We’ll help you reconstruct the timeline before anything else.");
      else add("now", "Keep it confidential, then lock in a filing date", "Use NDAs for outside conversations, and consider a provisional application to secure a filing date and “patent pending” status before you pitch or launch.");
      if (tech) add("next", "Run a patentability search", "See what’s already out there before you invest in a full application, so the claims focus on what’s genuinely new.");
      if (look) add("next", "Protect the look with a design patent", "Design patents cover a product’s ornamental appearance for 15 years from grant, a strong tool against knock-offs.");
    }
    if (a.stage === "dispute") add("urgent", "Get advice before you respond", "Gather your registrations, first-use dates and examples of the copying. Deadlines can apply, and a hasty public response can weaken your position.");
    if (a.stage === "raising") add("now", "Make your IP diligence-ready", "Investors and buyers will ask who owns what. Confirm that founders, employees and contractors have assigned their IP to the company.");
    if (has(a, "creative")) add(a.stage === "dispute" ? "now" : "next", "Register your key copyrights", "Copyright is automatic, but registration is generally required before you can sue over a U.S. work, and registering early unlocks statutory damages and attorney’s fees.");
    if (has(a, "secret")) add("next", "Put a trade secret program in place", "Secrets stay protectable only if you take reasonable steps to keep them secret: NDAs, access controls, and employee and contractor agreements.");
    if (a.mkt === "intl") add("next", "Plan your international filings", tech || look
      ? "Filing abroad within 12 months of your first patent application (6 months for designs and trademarks) generally lets you keep your original filing date."
      : "Filing abroad within 6 months of your U.S. trademark application generally lets you keep your original filing date.");
    if (a.mkt === "unsure") add("later", "Decide where you’ll need protection", "IP rights are country by country. Knowing your likely markets early keeps your options open.");
    if (has(a, "brand") || tech || look) add("later", "Maintain and monitor", "Calendared renewals and watch services keep your rights alive and catch copycats early.");
    const order = { urgent: 0, now: 1, next: 2, later: 3 };
    return r.sort((x, y) => order[x.pri] - order[y.pri]);
  }

  function summary(a) {
    const nouns = { brand: "a brand", invention: "an invention", design: "a product design", creative: "creative work or software", secret: "know-how" };
    const list = (a.what || []).map((w) => nouns[w]);
    const things = list.length > 1 ? list.slice(0, -1).join(", ") + " and " + list[list.length - 1] : list[0] || "your ideas";
    const stage = { idea: "at the idea stage", launch: "getting ready to launch", selling: "already selling", raising: "raising money or preparing to sell", dispute: "dealing with a dispute" }[a.stage] || "";
    const mkt = { us: "in the U.S.", intl: "in the U.S. and abroad" }[a.mkt] || "";
    return `Protecting ${things}${stage ? ", " + stage : ""}${mkt ? ", " + mkt : ""}.`;
  }

  const visible = (a) => STEPS.filter((s) => !s.when || s.when(a));
  const encode = (a, ref) => { const p = new URLSearchParams(); STEPS.forEach((s) => { const v = a[s.id]; if (v && v.length) p.set(s.id, [].concat(v).join(".")); }); p.set("ref", ref); return p; };
  const decode = (p) => { const a = {}; STEPS.forEach((s) => { const v = p.get(s.id); if (v) a[s.id] = s.multi ? v.split(".").filter((x) => s.opts.some((o) => o[0] === x)) : (s.opts.some((o) => o[0] === v) ? v : undefined); }); return a; };
  const PRI = { urgent: "Urgent", now: "Now", next: "Next", later: "Later" };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Homepage widget ---------- */
  const root = document.querySelector("[data-scan]");
  if (root) {
    const body = root.querySelector("[data-scan-body]");
    const status = root.querySelector("[data-scan-status]");
    const bar = root.querySelector("[data-scan-progress]");
    const live = root.querySelector("[data-scan-live]");
    const contact = root.dataset.contact;
    let a = {}, i = 0, cur = null, pointer = false;

    const progress = (n, total) => { bar.innerHTML = Array.from({ length: total }, (_, k) => `<i class="${k < n ? "done" : ""}"></i>`).join(""); };

    function renderStep() {
      const steps = visible(a), s = steps[i], multi = !!s.multi, val = a[s.id];
      status.textContent = `Step ${i + 1} / ${steps.length}`;
      progress(i, steps.length + 1);
      body.innerHTML = `
        <fieldset>
          <legend class="scan-q">${esc(s.q)}</legend>
          <p class="scan-hint">${esc(s.hint || (multi ? "Choose all that apply." : "Choose one."))}</p>
          <div class="scan-opts">${s.opts.map(([v, l], k) => `
            <label class="scan-opt${multi ? "" : " radio"}"><input type="${multi ? "checkbox" : "radio"}" name="scan-${s.id}" value="${v}"${(multi ? (val || []).includes(v) : val === v) ? " checked" : ""}><kbd aria-hidden="true">${k + 1}</kbd><span>${esc(l)}</span><i class="box" aria-hidden="true"></i></label>`).join("")}
          </div>
        </fieldset>
        <div class="scan-nav">
          <button type="button" class="scan-back${i ? "" : " off"}" data-back${i ? "" : ' tabindex="-1" aria-hidden="true"'}>← Back</button>
          <button type="button" class="btn btn--blue btn--sm" data-next>${i === steps.length - 1 ? "See my brief" : "Continue"} <span class="arr" aria-hidden="true">→</span></button>
        </div>`;
      cur = { s, multi };
      sync();
      live.textContent = `Step ${i + 1} of ${steps.length}. ${s.q}`;
      const first = body.querySelector("input:checked") || body.querySelector("input");
      first && first.focus({ preventScroll: true });
    }

    function sync() {
      const checked = [...body.querySelectorAll(".scan-opt input:checked")].map((x) => x.value);
      a[cur.s.id] = cur.multi ? checked : checked[0];
      const next = body.querySelector("[data-next]");
      if (next) next.disabled = !checked.length;
    }

    function renderBrief() {
      cur = null;
      const recs = recommend(a), urgent = recs.filter((r) => r.pri === "urgent").length;
      const d = new Date(), ref = "JIP-" + d.toISOString().slice(2, 10).replace(/-/g, "") + "-" + Math.random().toString(16).slice(2, 6).toUpperCase();
      status.textContent = "Brief ready";
      progress(1, 1);
      const href = contact + "?" + encode(a, ref).toString();
      body.innerHTML = `
        <div class="brief-head"><span>Ref. ${ref}</span><span>${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
        <p class="brief-sum" tabindex="-1">${esc(summary(a))} ${recs.length} recommendation${recs.length === 1 ? "" : "s"}${urgent ? `, ${urgent} time-sensitive` : ""}.</p>
        <ol class="brief-list">${recs.map((r, k) => `<li><details${k ? "" : " open"}><summary><span class="pri ${r.pri}">${PRI[r.pri]}</span><b>${esc(r.title)}</b></summary><p>${esc(r.text)}</p></details></li>`).join("")}</ol>
        <div class="brief-cta"><a class="btn btn--blue" href="${esc(href)}">Review this brief in a free session <span class="arr" aria-hidden="true">→</span></a></div>
        <div class="brief-foot"><span>General information, not legal advice.</span><button type="button" class="scan-back" data-restart>Start over</button></div>`;
      live.textContent = "Your IP brief is ready.";
      body.querySelector(".brief-sum").focus({ preventScroll: true });
      root.dispatchEvent(new CustomEvent("ipscan:complete", { bubbles: true, detail: { answers: a, ref } }));
    }

    function go(dir) {
      const steps = visible(a);
      if (dir > 0 && !(a[steps[i].id] && a[steps[i].id].length)) return;
      i += dir;
      // Drop answers to questions that no longer apply
      STEPS.forEach((s) => { if (s.when && !s.when(a)) delete a[s.id]; });
      if (i >= visible(a).length) renderBrief(); else renderStep();
    }

    function start() { a = {}; i = 0; root.classList.add("is-running"); renderStep(); }

    root.addEventListener("pointerdown", () => { pointer = true; });
    root.addEventListener("change", (e) => {
      if (!cur || !e.target.matches(".scan-opt input")) return;
      sync();
      // A tap on a single-choice answer moves on; keyboard users press Enter or Continue
      if (!cur.multi && pointer && e.target.checked) { const at = i; setTimeout(() => { if (i === at && cur) go(1); }, 240); }
    });
    root.addEventListener("click", (e) => {
      if (e.target.closest("[data-start]")) { e.preventDefault(); start(); }
      else if (e.target.closest("[data-next]")) go(1);
      else if (e.target.closest("[data-back]")) go(-1);
      else if (e.target.closest("[data-restart]")) start();
    });
    // Number keys pick options; Enter continues (only while focus is inside the scan)
    root.addEventListener("keydown", (e) => {
      pointer = false;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const n = parseInt(e.key, 10), inputs = body.querySelectorAll(".scan-opt input");
      if (n >= 1 && n <= inputs.length) {
        const el = inputs[n - 1]; el.checked = el.type === "checkbox" ? !el.checked : true;
        el.dispatchEvent(new Event("change", { bubbles: true })); el.focus(); e.preventDefault();
      } else if (e.key === "Enter" && e.target.matches(".scan-opt input")) {
        e.preventDefault(); go(1);
      }
    });
  }

  /* ---------- Contact page: bring the brief into the form ---------- */
  const card = document.querySelector("[data-brief-card]");
  if (card) {
    const p = new URLSearchParams(location.search);
    const a = decode(p), ref = (p.get("ref") || "").replace(/[^A-Z0-9-]/gi, "").slice(0, 24);
    if (a.what && a.what.length) {
      const recs = recommend(a), sum = summary(a);
      card.querySelector("[data-brief-ref]").textContent = "Your IP brief" + (ref ? " · Ref. " + ref : "");
      card.querySelector("[data-brief-sum]").textContent = sum;
      card.querySelector("[data-brief-list]").innerHTML = recs.map((r) => `<li><strong>${PRI[r.pri]}:</strong> ${esc(r.title)}</li>`).join("");
      card.hidden = false;
      const form = card.closest("form");
      a.what.forEach((w) => { const box = form.querySelector(`input[name="topic"][value="${TOPIC[w]}"]`); if (box) box.checked = true; });
      const hidden = form.querySelector('input[name="ip_scan"]');
      if (hidden) hidden.value = `${ref} | ${sum} | ` + recs.map((r) => `${PRI[r.pri]}: ${r.title}`).join("; ");
    }
  }
})();
