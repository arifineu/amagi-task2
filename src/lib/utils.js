const phpFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export const formatPHP = (amount) => phpFormatter.format(amount);

export const getInitials = (fullName) => {
  if (!fullName) return 'PT';
  const parts = fullName.split(',').map((s) => s.trim());
  if (parts.length >= 2) {
    return `${parts[1][0] || ''}${parts[0][0] || ''}`.toUpperCase();
  }
  return fullName.slice(0, 2).toUpperCase();
};

/** Enter/Space handler for clickable elements that aren't <button>s. */
export const onEnterOrSpace = (action) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    action();
  }
};
