(() => {
  const targets = document.querySelectorAll("#solutions, .about, #clients");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotion.matches) {
    const finalLines = [
      { x1: 600, y1: 120, x2: 600, y2: 780 },
      { x1: 100, y1: 120, x2: 100, y2: 780 },
      { x1: 170, y1: 120, x2: 530, y2: 780 },
    ];
    document.querySelectorAll(".geometry-line").forEach((line, index) => {
      line.querySelectorAll("animate").forEach((animation) => animation.remove());
      Object.entries(finalLines[index] || {}).forEach(([attribute, value]) => line.setAttribute(attribute, value));
      line.setAttribute("stroke-width", "5.5");
    });
    document.querySelectorAll(".hero-node").forEach((node) => {
      node.style.animation = "none";
      node.style.opacity = "1";
      node.style.transform = "none";
    });
    document.querySelectorAll(".node-ring").forEach((ring) => {
      ring.style.animation = "none";
      ring.style.strokeDasharray = "none";
      ring.style.strokeDashoffset = "0";
    });
    document.querySelectorAll(".node-icon").forEach((icon) => {
      icon.style.animation = "none";
      icon.style.opacity = "1";
      icon.style.transform = "none";
    });
  }

  if (!targets.length || reduceMotion.matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  targets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    observer.observe(target);
  });

  const benefitTimeline = document.querySelector(".benefit-timeline");
  if (benefitTimeline) {
    const timelineObserver = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    timelineObserver.observe(benefitTimeline);
  }
})();

(() => {
  const role = document.querySelector("[data-about-role]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!role || reducedMotion.matches) return;

  const roles = ["software developers", "designers", "coders", "data analysts", "engineers"];
  let roleIndex = 0;
  let characterIndex = roles[0].length;
  let deleting = true;

  const typeNextRole = () => {
    const currentRole = roles[roleIndex];
    if (!deleting) {
      characterIndex += 1;
      role.textContent = currentRole.slice(0, characterIndex);
      if (characterIndex === currentRole.length) {
        deleting = true;
        window.setTimeout(typeNextRole, 1400);
        return;
      }
    } else {
      characterIndex -= 1;
      role.textContent = currentRole.slice(0, characterIndex);
      if (characterIndex === 0) {
        roleIndex = (roleIndex + 1) % roles.length;
        deleting = false;
        window.setTimeout(typeNextRole, 220);
        return;
      }
    }

    window.setTimeout(typeNextRole, deleting ? 48 : 88);
  };

  window.setTimeout(typeNextRole, 1400);
})();

(() => {
  const serviceButtons = document.querySelectorAll(".pricing-service-button");
  const cards = document.querySelectorAll(".pricing-card");
  if (!serviceButtons.length || !cards.length) return;

  const offerings = {
    flow: {
      name: "NEXA Flow",
      plans: {
        personal: { description: "For an individual looking to simplify everyday work.", features: ["One personal workspace", "Ready-to-use workflow templates", "Task tracking and reminders"] },
        business: { description: "For teams coordinating repeatable processes.", features: ["Shared team workspaces", "Workflow automation tools", "Team roles and approvals"] },
        enterprise: { description: "For organizations managing complex operations.", features: ["Advanced workflow routing", "Custom roles and controls", "Guided rollout and support"] },
      },
    },
    connect: {
      name: "NEXA Connect",
      plans: {
        personal: { description: "For individuals keeping work notes and updates together.", features: ["Personal information hub", "Organized notes and files", "Quick search"] },
        business: { description: "For teams sharing updates and useful knowledge.", features: ["Shared team channels", "Searchable conversations and files", "Team workspace controls"] },
        enterprise: { description: "For organizations connecting information across teams.", features: ["Organization-wide workspaces", "Advanced access controls", "Guided rollout and support"] },
      },
    },
    insight: {
      name: "NEXA Insight",
      plans: {
        personal: { description: "For individuals who want a clearer view of their work.", features: ["Personal operations dashboard", "Weekly activity snapshots", "Saved report views"] },
        business: { description: "For teams following performance and workload trends.", features: ["Shared team dashboards", "Custom report views", "Trend comparisons"] },
        enterprise: { description: "For organizations measuring operations across teams.", features: ["Multi-team analytics", "Advanced reporting views", "Guided rollout and support"] },
      },
    },
  };

  const setService = (serviceKey) => {
    const service = offerings[serviceKey];
    serviceButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.pricingService === serviceKey)));
    cards.forEach((card) => {
      const plan = service.plans[card.dataset.plan];
      card.querySelector(".pricing-service-name").textContent = service.name;
      card.querySelector(".pricing-plan-description").textContent = plan.description;
      const featureList = card.querySelector(".pricing-features");
      featureList.replaceChildren(...plan.features.map((feature) => {
        const item = document.createElement("li");
        item.textContent = feature;
        return item;
      }));
    });
  };

  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => setService(button.dataset.pricingService));
  });
})();

(() => {
  const progressRing = document.querySelector(".back-to-top-progress");
  if (!progressRing) return;

  const circumference = 2 * Math.PI * 26;
  const updateProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
    progressRing.style.strokeDashoffset = String(circumference * (1 - progress));
    document.querySelector(".back-to-top")?.classList.toggle("is-at-top", window.scrollY <= 40);
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
})();

(() => {
  document.querySelectorAll(".services-dot-field").forEach((canvas) => {
    const context = canvas.getContext("2d");
    const surface = canvas.parentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let points = [];

    const resize = () => {
      const bounds = surface.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const count = Math.max(30, Math.min(105, Math.round((width * height) / 9000)));
      points = Array.from({ length: count }, (_, index) => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return { x, y, homeX: x, homeY: y, phase: index * 1.7, radius: 1 + Math.random() * 1.1 };
      });
    };

    const draw = (time) => {
      context.clearRect(0, 0, width, height);
      const seconds = time * .00025;
      points.forEach((point) => {
        const floatX = point.homeX + Math.sin(seconds + point.phase) * 5;
        const floatY = point.homeY + Math.cos(seconds * .9 + point.phase) * 5;
        point.x += (floatX - point.x) * .035;
        point.y += (floatY - point.y) * .035;
        if (pointer.active) {
          const dx = point.x - pointer.x;
          const dy = point.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 150 && distance > 0) {
            const force = (1 - distance / 150) * 1.8;
            point.x += (dx / distance) * force;
            point.y += (dy / distance) * force;
          }
        }
      });
      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const a = points[i];
          const b = points[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > 115) continue;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.strokeStyle = `rgba(220, 214, 255, ${(1 - distance / 115) * .2})`;
          context.lineWidth = .7;
          context.stroke();
        }
      }
      points.forEach((point) => {
        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255,255,255,.76)";
        context.fill();
      });
      if (!reducedMotion.matches) window.requestAnimationFrame(draw);
    };

    surface.addEventListener("pointermove", (event) => {
      const bounds = surface.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    });
    surface.addEventListener("pointerleave", () => { pointer.active = false; });
    window.addEventListener("resize", resize, { passive: true });
    resize();
    if (reducedMotion.matches) draw(0);
    else window.requestAnimationFrame(draw);
  });
})();

(() => {
  const tabs = Array.from(document.querySelectorAll(".service-explore-button"));
  if (!tabs.length) return;

  const selectTab = (selectedTab, moveFocus = false) => {
    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !isSelected;
    });
    if (moveFocus) selectedTab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      else return;
      event.preventDefault();
      selectTab(tabs[nextIndex], true);
    });
  });

  const requestedService = new URLSearchParams(window.location.search).get("service");
  const initialTab = tabs.find((tab) => tab.getAttribute("aria-controls") === requestedService);
  if (initialTab) selectTab(initialTab);
})();

(() => {
  document.querySelectorAll(".service-detail").forEach((panel) => {
    const buttons = Array.from(panel.querySelectorAll(".flow-feature-button"));
    let player = panel.id === "connect"
      ? null
      : panel.querySelector(".flow-animation-stage lottie-player");
    const note = panel.querySelector(".flow-animation-note");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        if (panel.id === "connect") {
          const featureTitle = panel.querySelector("[data-connect-feature-title]");
          const featureCopy = panel.querySelector("[data-connect-feature-copy]");
          const featureIcon = panel.querySelector("[data-connect-feature-icon]");
          if (featureTitle) featureTitle.textContent = button.dataset.featureTitle;
          if (featureCopy) featureCopy.textContent = button.dataset.featureCopy;
          if (featureIcon) featureIcon.textContent = button.dataset.featureIcon;
        } else if (panel.id === "insight") {
          const featureTitle = panel.querySelector("[data-insight-feature-title]");
          const featureCopy = panel.querySelector("[data-insight-feature-copy]");
          const featureIcon = panel.querySelector("[data-insight-feature-icon]");
          if (featureTitle) featureTitle.textContent = button.dataset.featureTitle;
          if (featureCopy) featureCopy.textContent = button.dataset.featureCopy;
          if (featureIcon) featureIcon.textContent = button.dataset.featureIcon;
        }
        const source = button.dataset.lottie;
        if (source && player) {
          const nextPlayer = document.createElement("lottie-player");
          nextPlayer.className = player.className;
          nextPlayer.setAttribute("src", source);
          nextPlayer.setAttribute("background", "transparent");
          nextPlayer.setAttribute("speed", "1");
          nextPlayer.setAttribute("loop", "");
          nextPlayer.setAttribute("autoplay", "");
          nextPlayer.setAttribute("aria-label", `${panel.dataset.serviceName} ${button.dataset.flowFeature.toLowerCase()} animation`);
          if (panel.id === "connect") nextPlayer.setAttribute("aria-hidden", "true");
          player.replaceWith(nextPlayer);
          player = nextPlayer;
          if (note) note.hidden = true;
        } else if (note) {
          if (player) player.hidden = true;
          note.textContent = `${button.dataset.flowFeature} animation preview coming soon.`;
          note.hidden = false;
        }
      });
    });
  });
})();

(() => {
  const slider = document.querySelector("#insight-carousel-range");
  const track = document.querySelector("[data-insight-carousel-track]");
  if (!slider || !track) return;

  const slides = Array.from(track.querySelectorAll(".insight-carousel-slide"));
  const updateComparison = () => {
    const firstSlidePercent = Number(slider.value);
    track.style.setProperty("--insight-compare", `${firstSlidePercent}%`);
    slider.setAttribute(
      "aria-valuetext",
      `${100 - firstSlidePercent}% performance trend, ${firstSlidePercent}% operations overview`,
    );
    slides.forEach((slide, index) => {
      const inactive = index === 0 ? firstSlidePercent === 0 : firstSlidePercent === 100;
      slide.setAttribute("aria-hidden", String(inactive));
      slide.inert = inactive;
    });
  };

  slider.addEventListener("input", updateComparison);
  updateComparison();
})();

(() => {
  const sections = Array.from(document.querySelectorAll(".service-detail .flow-intro, .service-detail .flow-proof, .service-detail .flow-people, .service-detail .connect-screen-section, .service-detail .insight-highlights, .service-detail .connect-features, .service-detail .flow-demo"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!sections.length || reduceMotion.matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("reveal-on-scroll", "flow-reveal", "is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: "0px 0px -10% 0px" });

  sections.forEach((section, index) => {
    section.style.setProperty("--flow-reveal-delay", `${index * 110}ms`);
    section.classList.add("reveal-on-scroll", "flow-reveal");
    observer.observe(section);
  });
})();

(() => {
  const stats = Array.from(document.querySelectorAll("[data-count-to]"));
  if (!stats.length) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animateStat = (element) => {
    const target = Number(element.dataset.countTo);
    const decimals = Number(element.dataset.decimals || 0);
    const suffix = element.dataset.suffix || "";
    if (reducedMotion) {
      element.textContent = `${target.toFixed(decimals)}${suffix}`;
      return;
    }
    const start = performance.now();
    const duration = 1500;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      element.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };
  if (!("IntersectionObserver" in window)) {
    stats.forEach(animateStat);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateStat(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: .55 });
  stats.forEach((stat) => observer.observe(stat));
})();

(() => {
  document.querySelectorAll(".service-detail").forEach((panel) => {
    const buttons = Array.from(panel.querySelectorAll(".flow-career-buttons button"));
    const name = panel.querySelector("[data-person-name]");
    const career = panel.querySelector("[data-person-career]");
    const image = panel.querySelector("[data-person-image]");
    const placeholder = panel.querySelector("[data-person-placeholder]");

    buttons.forEach((button) => {
      const portrait = new Image();
      portrait.src = button.dataset.image;
    });
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        if (name) name.textContent = button.dataset.name;
        if (career) career.textContent = button.dataset.career;
        const source = button.dataset.image;
        if (image && source) {
          image.src = source;
          image.alt = `${button.dataset.name}, ${button.dataset.career}`;
          image.hidden = false;
          if (placeholder) placeholder.hidden = true;
        } else if (image) {
          image.removeAttribute("src");
          image.hidden = true;
          if (placeholder) placeholder.hidden = false;
        }
      });
    });
  });
})();

(() => {
  const toggle = document.querySelector(".services-menu-toggle");
  const drawer = document.querySelector(".services-menu-drawer");
  const backdrop = document.querySelector(".services-menu-backdrop");
  const closeButton = document.querySelector(".services-menu-close");
  if (!toggle || !drawer || !backdrop || !closeButton) return;

  const setMenuOpen = (isOpen, returnFocus = false) => {
    toggle.setAttribute("aria-expanded", String(isOpen));
    drawer.setAttribute("aria-hidden", String(!isOpen));
    drawer.inert = !isOpen;
    drawer.classList.toggle("is-open", isOpen);
    backdrop.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    if (isOpen) closeButton.focus();
    else if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => setMenuOpen(true));
  closeButton.addEventListener("click", () => setMenuOpen(false, true));
  backdrop.addEventListener("click", () => setMenuOpen(false, true));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenuOpen(false, true);
  });

  drawer.querySelectorAll("[data-close-menu]").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
})();

(() => {
  const header = document.querySelector(".home-page .site-header");
  if (!header) return;

  const updateHeaderOnScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 64);
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) header.classList.add("is-hero-ready");
  else window.setTimeout(() => header.classList.add("is-hero-ready"), 3050);

  window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
  window.addEventListener("resize", updateHeaderOnScroll);
  updateHeaderOnScroll();
})();

(() => {
  document.querySelectorAll(".client-logo-track").forEach((track) => {
    const logoSets = track.querySelectorAll(".client-logo-set");
    if (logoSets.length === 2) logoSets[1].innerHTML = logoSets[0].innerHTML;
  });

  const buttons = document.querySelectorAll(".problem-button");
  const panels = document.querySelectorAll(".service-software-panel");

  const activateOnKeyboard = (control, action) => {
    control.addEventListener("click", action);
    control.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      action();
    });
  };

  document.querySelectorAll(".flow-nav-control").forEach((control) => {
    activateOnKeyboard(control, () => {
      document.querySelector("#flow-view-title").textContent = control.dataset.flowView;
      document.querySelector("#flow-view-description").textContent = control.dataset.flowDescription;
      document.querySelector("#flow-table-title").textContent = control.dataset.flowTableTitle;
      document.querySelector("#flow-nav-selection").setAttribute("transform", `translate(0 ${control.dataset.navOffset})`);
      document.querySelectorAll(".flow-nav-control").forEach((item) => item.setAttribute("aria-pressed", String(item === control)));
      document.querySelectorAll(".flow-screen").forEach((screen) => {
        screen.style.display = screen.dataset.flowScreen === control.dataset.flowView ? "inline" : "none";
      });
      document.querySelectorAll("#software-flow svg text").forEach((label) => {
        if (!["My workflows", "Approvals", "Automations", "Team tasks"].includes(label.textContent)) return;
        const active = label.textContent === control.dataset.flowView;
        label.setAttribute("fill", active ? "#5030d2" : "#696473");
        label.setAttribute("font-weight", active ? "600" : "400");
      });
    });
  });

  document.querySelectorAll(".connect-channel-control").forEach((control) => {
    activateOnKeyboard(control, () => {
      document.querySelector("#connect-channel-title").textContent = control.dataset.channel;
      document.querySelector("#connect-channel-subtitle").textContent = control.dataset.summary;
      document.querySelector("#connect-channel-selection").setAttribute("transform", `translate(0 ${control.dataset.channelOffset})`);
      document.querySelector("#connect-message-content").textContent = `You’re viewing updates in ${control.dataset.channel}.`;
      document.querySelectorAll(".connect-channel-control").forEach((item) => item.setAttribute("aria-pressed", String(item === control)));
      document.querySelectorAll(".connect-screen").forEach((screen) => {
        screen.style.display = screen.dataset.connectScreen === control.dataset.channel ? "inline" : "none";
      });
      document.querySelectorAll("#software-connect svg text").forEach((label) => {
        if (!label.textContent.startsWith("# ")) return;
        const active = label.textContent.replace("# ", "#") === control.dataset.channel;
        label.setAttribute("fill", active ? "#5030d2" : "#696473");
        label.setAttribute("font-weight", active ? "600" : "400");
      });
    });
  });

  document.querySelectorAll(".mockup-card-control").forEach((control) => {
    activateOnKeyboard(control, () => {
      const svg = control.closest("svg");
      const detailScreen = control.parentElement.querySelector(".insight-detail-screen");
      detailScreen.hidden = false;
      detailScreen.querySelector("h3").textContent = control.dataset.metricTitle;
      detailScreen.querySelector("p").textContent = control.dataset.metricNote;
      const barSets = [
        [58, 69, 64, 76, 86, 92],
        [88, 76, 82, 64, 58, 48],
        [42, 55, 48, 72, 61, 86],
        [80, 74, 92, 67, 86, 78],
      ];
      const metricIndex = Array.from(document.querySelectorAll(".mockup-card-control")).indexOf(control);
      detailScreen.querySelectorAll(".insight-demo-chart span").forEach((bar, index) => {
        bar.style.setProperty("--bar", `${barSets[metricIndex][index]}%`);
      });
      let note = svg.querySelector("#insight-chart-note");
      let title = svg.querySelector("#insight-chart-title");
      if (!note) {
        note = document.createElementNS("http://www.w3.org/2000/svg", "text");
        note.setAttribute("id", "insight-chart-note");
        note.setAttribute("x", "355");
        note.setAttribute("y", "301");
        note.setAttribute("fill", "#8a8593");
        note.setAttribute("font-size", "10");
        svg.append(note);
      }
      if (!title) {
        title = Array.from(svg.querySelectorAll("text")).find((item) => item.textContent === "Weekly task completion");
        title?.setAttribute("id", "insight-chart-title");
      }
      if (title) title.textContent = control.dataset.metricTitle;
      note.textContent = control.dataset.metricNote;
      document.querySelectorAll(".mockup-card-control").forEach((item) => item.setAttribute("aria-pressed", String(item === control)));
    });
  });

  if (!buttons.length || !panels.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedService = button.dataset.service;

      buttons.forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });

      panels.forEach((panel) => {
        panel.hidden = panel.id !== `software-${selectedService}`;
      });
    });
  });
})();
