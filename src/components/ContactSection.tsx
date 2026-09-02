'use client';

import { useState, type FormEvent } from 'react';

/**
 * Contact section with contact details and an enquiry form.
 *
 * Uses the built-in HTML form validation and manages its own submit state.
 *
 * Single Responsibility: contact information display + form submission UI.
 * The actual submission is handled via the API route.
 */
export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          message: data.get('message'),
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error || 'Something went wrong.');
        setLoading(false);
        return;
      }

      setSent(true);
      setError(null);
      setLoading(false);
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact" data-od-id="contact">
      <div className="contact-grid">
        <div>
          <h2>Corvus team.</h2>
          <p className="lead">
            Tell us about your deployment — cameras, scale, and constraints.
          </p>
          <div className="contact-lines">
            <a
              className="contact-line"
              href="mailto:corvus@openpic.in"
              data-od-id="contact-email"
            >
              <span className="k">Email</span>
              <span className="v">corvus@openpic.in</span>
            </a>
            <div className="contact-line" data-od-id="contact-location">
              <span className="k">Office</span>
              <span className="v">India</span>
            </div>
            <div className="contact-line" data-od-id="contact-hours">
              <span className="k">Response time</span>
              <span className="v">Within one business day</span>
            </div>
          </div>
        </div>
        <form
          className="contact-form"
          onSubmit={onSubmit}
          noValidate
          data-od-id="contact-form"
        >
          <div className="field">
            <label htmlFor="cf-name">Name</label>
            <input
              id="cf-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="cf-email">Email</label>
            <input
              id="cf-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="cf-company">Company</label>
            <input
              id="cf-company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="Company (optional)"
            />
          </div>
          <div className="field">
            <label htmlFor="cf-message">Message</label>
            <textarea
              id="cf-message"
              name="message"
              placeholder="What are you building?"
              required
            />
          </div>
          <button
            className="submit-btn"
            type="submit"
            data-od-id="contact-submit"
            disabled={loading || sent}
          >
            {loading ? 'Sending…' : sent ? 'Sent' : 'Send message'}
          </button>
          <p className={`form-note${sent ? ' ok' : error ? ' err' : ''}`} role="status">
            {loading
              ? 'Sending your message…'
              : sent
                ? 'Thanks — we received your message and will reply shortly.'
                : error || 'We only use these details to reply to your enquiry.'}
          </p>
        </form>
      </div>
    </section>
  );
}