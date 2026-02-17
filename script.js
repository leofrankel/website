/*
  ===================================================
  script.js — Three features:
    1. Smooth scrolling for nav links
    2. Active nav link highlighting on scroll
    3. Dark mode toggle with localStorage persistence
  ===================================================
*/

/*
  FEATURE 1: SMOOTH SCROLLING
  -----------------------------------------------------------
  By default, clicking <a href="#about"> makes the browser
  instantly jump to the element with id="about". We override
  that with a smooth animated scroll.

  KEY CONCEPTS:
  - querySelectorAll: Returns a NodeList of all elements
    matching a CSS selector. Here, we grab every <a> whose
    href starts with "#" (the [href^="#"] is an "attribute
    selector" borrowed from CSS).
  - forEach: Iterates over each element in the list.
  - addEventListener: Attaches a function that runs when
    a specific event (here, "click") occurs on the element.
  - preventDefault: Stops the browser's default behavior
    (the instant jump) so we can do our own thing instead.
  - scrollIntoView: A built-in method on DOM elements that
    scrolls the page to make that element visible. The
    { behavior: "smooth" } option animates it.
*/

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
        var targetId = this.getAttribute("href");

        // If href is just "#" (the logo link), scroll to the top
        if (targetId === "#") {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        var targetElement = document.querySelector(targetId);
        if (targetElement) {
            event.preventDefault();
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    });
});

/*
  FEATURE 2: ACTIVE NAV LINK HIGHLIGHTING
  -----------------------------------------------------------
  As the user scrolls, we want to highlight whichever nav
  link corresponds to the section currently visible on screen.

  KEY CONCEPTS:
  - IntersectionObserver: A browser API that watches elements
    and tells you when they enter or leave the viewport (the
    visible area of the page). It's much more efficient than
    listening to the "scroll" event on every frame.
  - The constructor takes a callback function and an options
    object. The callback receives an array of "entries" —
    one for each observed element that changed visibility.
  - rootMargin: Adjusts the "viewport" used for detection.
    "-30% 0px -70% 0px" means: shrink the detection zone to
    a narrow band near the top of the screen. This way, a
    section is considered "active" when it reaches the upper
    portion of the viewport, which feels natural while
    scrolling.
  - threshold: 0 means the callback fires as soon as even
    1px of the element enters the detection zone.
  - entry.isIntersecting: true when the element is inside
    the (adjusted) viewport.
  - classList.add / classList.remove: Add or remove CSS
    classes from an element. We toggle an "active" class
    on nav links, which CSS styles with a visual indicator.
*/

var sections = document.querySelectorAll("section, header#hero");
var navLinks = document.querySelectorAll(".nav-links a");

var observerOptions = {
    rootMargin: "-30% 0px -70% 0px",
    threshold: 0,
};

var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");

            // Remove "active" from all nav links
            navLinks.forEach(function (link) {
                link.classList.remove("active");
            });

            // Add "active" to the matching nav link
            var matchingLink = document.querySelector(
                '.nav-links a[href="#' + id + '"]'
            );
            if (matchingLink) {
                matchingLink.classList.add("active");
            }
        }
    });
}, observerOptions);

// Tell the observer to watch each section
sections.forEach(function (section) {
    sectionObserver.observe(section);
});

/*
  FEATURE 3: DARK MODE TOGGLE
  -----------------------------------------------------------
  We toggle a "dark" class on the <body> element. In CSS,
  we define a body.dark { } rule that overrides the color
  variables — so the entire theme changes with one class.

  KEY CONCEPTS:
  - localStorage: A browser API that stores key-value pairs
    persistently (survives page reloads and browser restarts).
    It only stores strings. We use it to remember whether the
    user chose dark mode.
  - classList.toggle: Adds the class if it's absent, removes
    it if it's present. Returns true if the class was added.
  - getElementById: Finds a single element by its id attribute.
    Faster than querySelector for id lookups.
  - The script runs after the DOM is loaded (because the
    <script> tag is at the bottom of <body>), so all elements
    are available to query.
*/

var darkModeToggle = document.getElementById("dark-mode-toggle");

// On page load, check if the user previously chose dark mode
if (localStorage.getItem("darkMode") === "on") {
    document.body.classList.add("dark");
}

darkModeToggle.addEventListener("click", function () {
    var isDark = document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark ? "on" : "off");
});
