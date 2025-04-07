// Utility function to wait for a given time (in milliseconds)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to handle responsive navigation menu
const toggleMenu = (menuId) => {
  const menu = document.getElementById(menuId);
  if (menu) {
    menu.classList.toggle('active');
  }
};

// Function to display a loading spinner
const showLoading = (spinnerId, show = true) => {
  const spinner = document.getElementById(spinnerId);
  if (spinner) {
    spinner.style.display = show ? 'block' : 'none';
  }
};

// Function to validate an email format
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Function to show an alert message
const showAlert = (message, type = 'success') => {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.classList.add(type === 'success' ? 'success' : 'error');
  alert.textContent = message;

  document.body.appendChild(alert);
  setTimeout(() => {
    alert.classList.add('hide');
    setTimeout(() => alert.remove(), 300);
  }, 3000);
};

// Function to get a random number between min and max
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to toggle an element's visibility
const toggleVisibility = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = (element.style.display === 'none' || element.style.display === '') ? 'block' : 'none';
  }
};

// Function to format date to a human-readable format
const formatDate = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// Function to initialize tooltips
const initTooltips = () => {
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseover', () => {
      const tooltipText = tooltip.getAttribute('data-tooltip');
      const tooltipElement = document.createElement('div');
      tooltipElement.classList.add('tooltip');
      tooltipElement.textContent = tooltipText;

      document.body.appendChild(tooltipElement);
      const rect = tooltip.getBoundingClientRect();
      tooltipElement.style.left = `${rect.left + window.pageXOffset}px`;
      tooltipElement.style.top = `${rect.top + window.pageYOffset - tooltipElement.offsetHeight - 8}px`;
    });

    tooltip.addEventListener('mouseout', () => {
      document.querySelectorAll('.tooltip').forEach(t => t.remove());
    });
  });
};

// Optional: Debounce and Throttle
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Initialize tooltips on DOM ready
document.addEventListener('DOMContentLoaded', initTooltips);
