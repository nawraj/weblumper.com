// src/scripts/contact-form.js
document.getElementById('contact-form')?.addEventListener('submit', async e => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  if (formData.get('honeypot')) return; // spam

  const payload = Object.fromEntries(formData);
  const msgEl = document.getElementById('form-message');

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      msgEl.innerHTML = `<p class="text-green-600 bg-green-100 p-3 rounded">Thank you! We’ll reply soon.</p>`;
      form.reset();
    } else {
      throw new Error(data.error || 'Submission failed');
    }
  } catch (err) {
    msgEl.innerHTML = `<p class="text-red-600 bg-red-100 p-3 rounded">Error: ${err.message}</p>`;
  }

  msgEl.classList.remove('hidden');
});