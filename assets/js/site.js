/* Johnston IP Law — progressive enhancements. The site works fully without this file. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Mobile menu
  const btn = $("[data-menu]");
  const nav = $("#site-nav");
  if (btn && nav) {
    const setOpen = (open) => {
      btn.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      btn.querySelector(".sr-only").textContent = open ? "Close menu" : "Menu";
    };
    btn.addEventListener("click", () => setOpen(btn.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); btn.focus(); }
    });
    matchMedia("(min-width: 921px)").addEventListener("change", (e) => e.matches && setOpen(false));
  }

  // Reveal on scroll
  const items = $$(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }

  // Mobile sticky CTA appears once the hero's own buttons have scrolled away
  const bar = $("[data-mobile-cta]");
  if (bar) {
    const onScroll = () => bar.classList.toggle("show", scrollY > 560);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  // IP Navigator: announce the recommendation to screen readers
  const live = $("[data-nav-live]");
  $$('.navigator input[name="protect"]').forEach((r) => r.addEventListener("change", () => {
    const ans = document.getElementById("ans-" + r.value);
    if (live && ans) live.textContent = ans.querySelector("h3").textContent;
  }));

  // Contact form
  const form = $("[data-contact-form]");
  if (form) {
    const topic = new URLSearchParams(location.search).get("topic");
    if (topic) { const box = $(`[data-topic="${CSS.escape(topic)}"]`, form); if (box) box.checked = true; }

    const status = $("[data-form-status]", form);
    const say = (msg) => { status.hidden = false; status.textContent = msg; };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (form.hasAttribute("data-preview")) {
        say("Thanks! This preview isn’t connected to email yet — please call (214) 220-9900 to book your free session.");
        return;
      }
      const submit = $('button[type="submit"]', form);
      submit.disabled = true;
      try {
        const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        say("Thank you — we’ve received your request and will be in touch to schedule your free discovery session.");
      } catch {
        say("Sorry, something went wrong sending your request. Please call (214) 220-9900 and we’ll get you scheduled.");
      } finally {
        submit.disabled = false;
      }
    });
  }
})();
