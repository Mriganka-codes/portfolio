// Enhanced Portfolio Website JavaScript
console.log("🚀 Enhanced Portfolio Website Loading...")

// Global state management
const PortfolioApp = {
  theme: localStorage.getItem("theme") || "light",
  isLoading: true,
  animations: {
    observer: null,
    counters: new Map(),
  },
  navigation: {
    isMenuOpen: false,
    activeSection: "hero",
  },
}

// Enhanced global state with persistent component tracking
window.EditingSystem = {
  selectedComponent: null,
  selectedComponentData: null, // Store component data separately
  editPanel: null,
  isEditPanelOpen: false,
  editingInitialized: false,
  componentRegistry: new Map(),
  // Add backup reference system
  lastSelectedComponent: null,
  componentSelectionTime: null,
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎯 DOM loaded - initializing enhanced systems...")

  initializeLoading()
  initializeTheme()
  initializeNavigation()
  initializeAnimations()
  initializeSkillBars()
  initializeCounters()
  initializeContactForm()
  initializeMobileMenu()
  initializeEditingSystem()

  console.log("✅ All systems initialized successfully")
})

// Loading Screen
function initializeLoading() {
  console.log("⏳ Initializing loading screen...")

  const loadingScreen = document.getElementById("loadingScreen")
  const loadingProgress = document.querySelector(".loading-progress")

  if (!loadingScreen || !loadingProgress) return

  // Simulate loading progress
  let progress = 0
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 15
    if (progress >= 100) {
      progress = 100
      clearInterval(loadingInterval)

      // Hide loading screen after a short delay
      setTimeout(() => {
        loadingScreen.classList.add("hidden")
        PortfolioApp.isLoading = false

        // Trigger entrance animations
        triggerEntranceAnimations()
      }, 500)
    }

    loadingProgress.style.width = `${progress}%`
  }, 100)
}

// Theme Management
function initializeTheme() {
  console.log("🎨 Initializing theme system...")

  const themeToggle = document.getElementById("themeToggle")
  const body = document.body

  // Set initial theme
  body.setAttribute("data-theme", PortfolioApp.theme)

  if (!themeToggle) return

  themeToggle.addEventListener("click", () => {
    PortfolioApp.theme = PortfolioApp.theme === "light" ? "dark" : "light"
    body.setAttribute("data-theme", PortfolioApp.theme)
    localStorage.setItem("theme", PortfolioApp.theme)

    // Add animation class
    body.style.transition = "background-color 0.3s ease, color 0.3s ease"

    console.log(`🌓 Theme switched to: ${PortfolioApp.theme}`)
  })
}

// Enhanced Navigation
function initializeNavigation() {
  console.log("🧭 Initializing enhanced navigation...")

  const navbar = document.getElementById("navbar")
  const navLinks = document.querySelectorAll(".nav-link")
  const sections = document.querySelectorAll(".section, .hero")

  if (!navbar) return

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })

        // Close mobile menu if open
        if (PortfolioApp.navigation.isMenuOpen) {
          toggleMobileMenu()
        }
      }
    })
  })

  // Navbar scroll effect and active section highlighting
  let ticking = false

  function updateNavigation() {
    const scrollY = window.scrollY

    // Add scrolled class to navbar
    if (scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }

    // Update active navigation link
    let current = ""
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.offsetHeight

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id")
      }
    })

    if (current && current !== PortfolioApp.navigation.activeSection) {
      PortfolioApp.navigation.activeSection = current

      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === "#" + current) {
          link.classList.add("active")
        }
      })
    }

    ticking = false
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateNavigation)
      ticking = true
    }
  })
}

// Mobile Menu
function initializeMobileMenu() {
  console.log("📱 Initializing mobile menu...")

  const navToggle = document.getElementById("navToggle")
  const mobileMenu = document.getElementById("mobileMenu")
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")

  if (!navToggle || !mobileMenu) return

  navToggle.addEventListener("click", toggleMobileMenu)

  // Close menu when clicking on links
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        toggleMobileMenu()

        setTimeout(() => {
          const offsetTop = targetSection.offsetTop - 80
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }, 300)
      }
    })
  })

  // Close menu when clicking outside
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      toggleMobileMenu()
    }
  })
}

function toggleMobileMenu() {
  const navToggle = document.getElementById("navToggle")
  const mobileMenu = document.getElementById("mobileMenu")

  if (!navToggle || !mobileMenu) return

  PortfolioApp.navigation.isMenuOpen = !PortfolioApp.navigation.isMenuOpen

  navToggle.classList.toggle("active")
  mobileMenu.classList.toggle("active")

  // Prevent body scroll when menu is open
  document.body.style.overflow = PortfolioApp.navigation.isMenuOpen ? "hidden" : ""
}

// Enhanced Animations
function initializeAnimations() {
  console.log("✨ Initializing enhanced animations...")

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  PortfolioApp.animations.observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")

        // Trigger specific animations based on element type
        if (entry.target.classList.contains("stat-number")) {
          animateCounter(entry.target)
        }

        if (entry.target.classList.contains("skill-progress")) {
          animateSkillBar(entry.target)
        }
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(`
        .section,
        .project-card,
        .timeline-item,
        .skill-category,
        .stat-item,
        .contact-item
    `)

  animatedElements.forEach((el) => {
    el.classList.add("fade-in")
    PortfolioApp.animations.observer.observe(el)
  })
}

// Counter Animation
function initializeCounters() {
  console.log("🔢 Initializing counter animations...")

  const counters = document.querySelectorAll(".stat-number[data-count]")
  counters.forEach((counter) => {
    PortfolioApp.animations.observer.observe(counter)
  })
}

function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-count"))
  const duration = 2000
  const start = performance.now()

  if (PortfolioApp.animations.counters.has(element)) return
  PortfolioApp.animations.counters.set(element, true)

  function updateCounter(currentTime) {
    const elapsed = currentTime - start
    const progress = Math.min(elapsed / duration, 1)

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const current = Math.floor(easeOutQuart * target)

    element.textContent = current

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = target
    }
  }

  requestAnimationFrame(updateCounter)
}

// Skill Bars Animation
function initializeSkillBars() {
  console.log("📊 Initializing skill bar animations...")

  const skillBars = document.querySelectorAll(".skill-progress[data-width]")
  skillBars.forEach((bar) => {
    PortfolioApp.animations.observer.observe(bar)
  })
}

function animateSkillBar(element) {
  const targetWidth = element.getAttribute("data-width")
  if (targetWidth) {
    setTimeout(() => {
      element.style.width = `${targetWidth}%`
    }, 200)
  }
}

// Contact Form
function initializeContactForm() {
  console.log("📧 Initializing contact form...")

  const contactForm = document.getElementById("contactForm")

  if (!contactForm) return

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const formData = new FormData(this)
    const data = Object.fromEntries(formData)

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
    submitBtn.disabled = true

    // Simulate form submission
    setTimeout(() => {
      showNotification("Thank you for your message! I will get back to you soon.", "success")
      contactForm.reset()

      // Reset button
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
    }, 2000)

    console.log("📨 Form submitted:", data)
  })

  // Form validation
  const inputs = contactForm.querySelectorAll("input, textarea")
  inputs.forEach((input) => {
    input.addEventListener("blur", validateField)
    input.addEventListener("input", clearValidation)
  })
}

function validateField(e) {
  const field = e.target
  const value = field.value.trim()

  // Remove existing validation
  clearValidation(e)

  let isValid = true
  let message = ""

  if (field.hasAttribute("required") && !value) {
    isValid = false
    message = "This field is required"
  } else if (field.type === "email" && value && !isValidEmail(value)) {
    isValid = false
    message = "Please enter a valid email address"
  }

  if (!isValid) {
    showFieldError(field, message)
  }
}

function clearValidation(e) {
  const field = e.target
  const errorElement = field.parentNode.querySelector(".field-error")

  if (errorElement) {
    errorElement.remove()
  }

  field.classList.remove("error")
}

function showFieldError(field, message) {
  field.classList.add("error")

  const errorElement = document.createElement("div")
  errorElement.className = "field-error"
  errorElement.textContent = message
  errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.5rem;
    `

  field.parentNode.appendChild(errorElement)
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Notification System
function showNotification(message, type = "info") {
  console.log(`📢 Notification: ${message} (${type})`)

  // Remove existing notifications
  document.querySelectorAll(".notification").forEach((n) => n.remove())

  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${getNotificationIcon(type)}"></i>
            </div>
            <span class="notification-message">${message}</span>
            <button class="notification-close" type="button">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid var(--border-color);
        border-radius: 15px;
        padding: 1rem 1.5rem;
        box-shadow: var(--shadow-heavy);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `

  const content = notification.querySelector(".notification-content")
  content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
    `

  const icon = notification.querySelector(".notification-icon")
  icon.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        background: ${getNotificationColor(type)};
    `

  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.style.cssText = `
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Add close listener
  closeBtn.addEventListener("click", () => {
    removeNotification(notification)
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      removeNotification(notification)
    }
  }, 5000)
}

function removeNotification(notification) {
  notification.style.transform = "translateX(100%)"
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 300)
}

function getNotificationIcon(type) {
  const icons = {
    success: "fa-check",
    error: "fa-exclamation-triangle",
    warning: "fa-exclamation",
    info: "fa-info",
  }
  return icons[type] || icons.info
}

function getNotificationColor(type) {
  const colors = {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  }
  return colors[type] || colors.info
}

// Entrance Animations
function triggerEntranceAnimations() {
  console.log("🎭 Triggering entrance animations...")

  // Animate hero elements
  const heroElements = document.querySelectorAll(".hero-text, .hero-image")
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = "1"
      el.style.transform = "translateY(0)"
    }, index * 200)
  })
}

// Utility Functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  // Escape key closes mobile menu
  if (e.key === "Escape" && PortfolioApp.navigation.isMenuOpen) {
    toggleMobileMenu()
  }

  // Arrow keys for section navigation
  if (e.ctrlKey || e.metaKey) {
    const sections = ["hero", "about", "experience", "projects", "skills", "contact"]
    const currentIndex = sections.indexOf(PortfolioApp.navigation.activeSection)

    if (e.key === "ArrowUp" && currentIndex > 0) {
      e.preventDefault()
      navigateToSection(sections[currentIndex - 1])
    } else if (e.key === "ArrowDown" && currentIndex < sections.length - 1) {
      e.preventDefault()
      navigateToSection(sections[currentIndex + 1])
    }
  }

  // Escape key handler for editing system
  if (e.key === "Escape" && window.EditingSystem.isEditPanelOpen) {
    console.log("Closing edit panel due to Escape key")
    closeEditPanelSafely()
  }
})

function navigateToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    const offsetTop = section.offsetTop - 80
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
}

// Performance Monitoring
function logPerformance() {
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing
    const loadTime = timing.loadEventEnd - timing.navigationStart
    console.log(`⚡ Page load time: ${loadTime}ms`)
  }
}

// Initialize performance monitoring
window.addEventListener("load", logPerformance)

// Error Handling
window.addEventListener("error", (e) => {
  console.error("❌ JavaScript Error:", e.error)
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("❌ Unhandled Promise Rejection:", e.reason)
})

// Setup enhanced global event handlers
function setupEnhancedGlobalEventHandlers() {
  console.log("Setting up enhanced global event handlers...")

  // Global click handler with enhanced protection
  document.addEventListener("click", (e) => {
    // Don't close if clicking inside the edit panel
    if (window.EditingSystem.editPanel && window.EditingSystem.editPanel.contains(e.target)) {
      console.log("Click inside edit panel - maintaining selection")
      return
    }

    // Don't close if clicking on an editable component
    if (e.target.closest("[data-component]")) {
      console.log("Click on editable component - maintaining selection")
      return
    }

    // Only close if we're clicking outside everything and panel is open
    if (window.EditingSystem.isEditPanelOpen) {
      console.log("Closing edit panel due to outside click")
      closeEditPanelSafely()
    }
  })

  console.log("Enhanced global event handlers setup complete")
}

// Setup single component with persistence
function setupSingleComponentWithPersistence(component) {
  console.log(`Setting up single component with persistence: ${component.dataset.component}`)

  // Generate unique ID
  const componentId = `edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  component.setAttribute("data-edit-id", componentId)

  // Store comprehensive data in registry
  const componentData = {
    element: component,
    type: component.dataset.component,
    originalHTML: component.outerHTML,
    id: componentId,
    timestamp: Date.now(),
  }

  window.EditingSystem.componentRegistry.set(componentId, componentData)

  // Setup visual indicators
  component.style.cursor = "pointer"
  component.title = `Click to edit: ${component.dataset.component}`

  // Add event listeners with persistence
  component.addEventListener("click", function (e) {
    e.stopPropagation()
    e.preventDefault()
    console.log(`Component clicked: ${this.dataset.component} (ID: ${componentId})`)
    selectComponentForEditingWithPersistence(this, componentId, componentData)
  })

  component.addEventListener("mouseenter", function () {
    if (window.EditingSystem.selectedComponent !== this) {
      this.classList.add("hover-editable")
    }
  })

  component.addEventListener("mouseleave", function () {
    this.classList.remove("hover-editable")
  })

  console.log(`Single component setup with persistence complete: ${component.dataset.component}`)
}

// Format component name
function formatComponentName(componentName) {
  return componentName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Initialize editing system
function initializeEditingSystem() {
  console.log("Initializing editing system...")

  // Setup global event handlers
  setupEnhancedGlobalEventHandlers()

  // Setup components with persistence
  const components = document.querySelectorAll("[data-component]")
  components.forEach((component) => {
    setupSingleComponentWithPersistence(component)
  })

  console.log("Editing system initialized")
}

// Close edit panel safely
function closeEditPanelSafely() {
  if (window.EditingSystem.editPanel) {
    window.EditingSystem.editPanel.classList.add("hidden")
    window.EditingSystem.isEditPanelOpen = false
    window.EditingSystem.selectedComponent = null
    window.EditingSystem.selectedComponentData = null
  }
}

// Select component for editing with persistence
function selectComponentForEditingWithPersistence(component, componentId, componentData) {
  console.log(`Selecting component for editing: ${component.dataset.component} (ID: ${componentId})`)

  // Store last selected component and time
  window.EditingSystem.lastSelectedComponent = window.EditingSystem.selectedComponent
  window.EditingSystem.componentSelectionTime = Date.now()

  // Update selected component
  window.EditingSystem.selectedComponent = component
  window.EditingSystem.selectedComponentData = componentData

  // Show edit panel
  window.EditingSystem.editPanel = document.getElementById("editPanel")
  if (window.EditingSystem.editPanel) {
    window.EditingSystem.editPanel.classList.remove("hidden")
    window.EditingSystem.isEditPanelOpen = true
  }

  console.log(`Component selected for editing: ${component.dataset.component} (ID: ${componentId})`)
}

console.log("🎉 Enhanced Portfolio Website JavaScript Loaded Successfully!")
console.log("🔧 Available commands: PortfolioApp, showNotification(), navigateToSection()")
