document.addEventListener('DOMContentLoaded', () => {
  const acc = document.getElementById('kasAccordion');
  const btn = document.getElementById('kasAccordionToggle');
  const body = document.getElementById('kasAccordionBody');
  if (acc && btn && body) {
    const setState = (open) => {
      acc.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    setState(false);
    btn.addEventListener('click', () => {
      setState(!acc.classList.contains('open'));
    });
  }
});
