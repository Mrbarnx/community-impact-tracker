<template>
  <footer class="site-footer" id="about">
    <div class="footer-inner">
      <section class="footer-brand">
        <div class="brand-mark">
          <span class="logo-icon" aria-hidden="true">CI</span>
          <h3>Civic Impact</h3>
        </div>
        <p>
          Building trust through transparency. We are dedicated to providing clear, real-time data on how public funds
          are utilized to improve our community.
        </p>
      </section>

      <nav class="footer-links" aria-label="Platform links">
        <h4>Platform</h4>
        <a href="#projects">Browse Projects</a>
        <a href="#open-data">Open Data Sets</a>
        <a href="#open-data">API Documentation</a>
        <a href="#open-data">Submit a Proposal</a>
      </nav>

      <nav class="footer-links" aria-label="Organization links">
        <h4>Organization</h4>
        <a href="#about">About Us</a>
        <a href="#reports">Annual Reports</a>
        <a href="#careers">Careers</a>
        <a href="#contact">Contact</a>
      </nav>

      <section class="footer-signup" aria-label="Email updates">
        <h4>Stay Updated</h4>
        <p>Subscribe to our monthly transparency report.</p>
        <form class="email-field" @submit.prevent>
          <input type="email" name="email" placeholder="Email address" autocomplete="email" required />
          <button type="submit" aria-label="Submit email">
            <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
              />
            </svg>
          </button>
        </form>
      </section>
    </div>

    <div class="footer-meta">
      <p>© 2024 Civic Impact Dashboard. All rights reserved.</p>
      <div>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#cookies">Cookie Settings</a>
      </div>
    </div>
  </footer>
</template>
