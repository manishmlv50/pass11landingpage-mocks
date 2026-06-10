(function () {
  /* FAQ accordion */
  document.querySelectorAll('.lp-faq-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.nextElementSibling;
      var chevron = btn.querySelector('.lp-faq-chevron');
      var isOpen = !panel.classList.contains('hidden');
      document.querySelectorAll('.lp-faq-panel').forEach(function (p) {
        p.classList.add('hidden');
      });
      document.querySelectorAll('.lp-faq-chevron').forEach(function (c) {
        c.classList.remove('rotate-180');
      });
      if (!isOpen) {
        panel.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
      }
    });
  });

  /* Hero form → POST /api/forms/submit (contact-us) */
  var apiMeta = document.querySelector('meta[name="lp-form-api"]');
  var submitUrl = (apiMeta && apiMeta.getAttribute('content')) || 'https://admin.pass11plusgrammar.co.uk/api/forms/submit';

  document.querySelectorAll('[data-lp-hero-form]').forEach(function (form) {
    var statusEl = form.querySelector('[data-lp-form-status]');
    var fieldsEl = form.querySelector('[data-lp-form-fields]');
    var successEl = form.querySelector('[data-lp-form-success]');
    var submitBtn = form.querySelector('[data-lp-submit]');
    var formId = form.getAttribute('data-form-id') || 'contact-us';
    var subject = form.getAttribute('data-subject') || '11plus';
    var secondaryKey = form.getAttribute('data-secondary-key') || 'details';

    function showError(msg) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.classList.remove('hidden', 'is-error');
      statusEl.classList.add('is-error');
    }

    function clearStatus() {
      if (!statusEl) return;
      statusEl.textContent = '';
      statusEl.classList.add('hidden');
      statusEl.classList.remove('is-error');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearStatus();

      if (!form.reportValidity()) return;

      var fd = new FormData(form);
      var firstName = String(fd.get('firstName') || '').trim();
      var lastName = String(fd.get('lastName') || '').trim();
      var email = String(fd.get('email') || '').trim();
      var contact = String(fd.get('contact') || '').trim();
      var yearGroup = String(fd.get('yearGroup') || '').trim();
      var secondary = String(fd.get('secondary') || '').trim();

      var pageUrl = window.location.href;

      var messageParts = [];
      if (yearGroup) messageParts.push("Child's year group: " + yearGroup);
      if (secondary) {
        var label = secondaryKey === 'mockFormat' ? 'Mock format' : 'Course';
        messageParts.push(label + ': ' + secondary);
      }
      messageParts.push('Page URL: ' + pageUrl);
      var message = messageParts.join('. ');

      var payload = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        contact: contact,
        subject: subject,
        location: '',
        bestTime: '',
        grammarSchool: '',
        tasterSession: 'yes',
        slowPayments: 'yes',
        message: message,
        pageUrl: pageUrl,
        terms: true,
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      fetch(submitUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId: formId, payload: payload }),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            throw new Error(result.data && result.data.error ? result.data.error : 'Something went wrong. Please try again.');
          }
          if (fieldsEl) fieldsEl.classList.add('hidden');
          if (successEl) {
            var textEl = successEl.querySelector('.lp-form-success-text');
            if (textEl && result.data && result.data.message) {
              textEl.textContent = result.data.message;
            }
            successEl.classList.remove('hidden');
          }
          form.reset();
        })
        .catch(function (err) {
          showError(err.message || 'Network error. Please try again.');
        })
        .finally(function () {
          if (!submitBtn) return;
          if (successEl && !successEl.classList.contains('hidden')) return;
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.getAttribute('data-label') || "Secure My Child's Place";
        });
    });

    if (submitBtn && !submitBtn.getAttribute('data-label')) {
      submitBtn.setAttribute('data-label', submitBtn.textContent);
    }
  });
})();
