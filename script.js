// PropertyMatch JavaScript - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize banner (no complex animations needed)
    
    // Initialize active navbar states
    initActiveNavbar();
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Search form handling
    const searchForm = document.querySelector('form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const searchData = {
                location: document.getElementById('location').value,
                propertyType: document.getElementById('propertyType').value,
                minPrice: document.getElementById('minPrice').value,
                maxPrice: document.getElementById('maxPrice').value,
                bedrooms: document.getElementById('bedrooms').value
            };
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Searching...';
            submitBtn.disabled = true;
            
            // Simulate search (replace with actual API call)
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show results (in a real app, this would display actual results)
                showSearchResults(searchData);
            }, 2000);
        });
    }
    
    // Property card interactions
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        // Heart button toggle
        const heartBtn = card.querySelector('.btn-outline-primary');
        if (heartBtn) {
            heartBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('btn-primary');
                this.classList.toggle('btn-outline-primary');
                
                const icon = this.querySelector('i');
                if (this.classList.contains('btn-primary')) {
                    icon.classList.remove('bi-heart');
                    icon.classList.add('bi-heart-fill');
                    showToast('Added to favorites!', 'success');
                } else {
                    icon.classList.remove('bi-heart-fill');
                    icon.classList.add('bi-heart');
                    showToast('Removed from favorites', 'info');
                }
            });
        }
        
        // Card click to view details
        card.addEventListener('click', function() {
            const title = this.querySelector('.card-title').textContent;
            showPropertyDetails(title);
        });
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.property-card, .feature-card, .search-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Mobile menu enhancement
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a link
        const mobileNavLinks = navbarCollapse.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
    
    // Price range slider (if needed in future)
    function initPriceSlider() {
        // This would be implemented if we add a price range slider
        console.log('Price slider initialization would go here');
    }
    
    // Property filtering
    function filterProperties(criteria) {
        const properties = document.querySelectorAll('.property-card');
        properties.forEach(property => {
            const price = property.querySelector('.text-primary').textContent;
            const bedrooms = property.querySelector('.property-feature small').textContent;
            
            // Simple filtering logic (expand as needed)
            let show = true;
            
            if (criteria.maxPrice && price.includes('$')) {
                const propertyPrice = parseInt(price.replace(/[$,]/g, ''));
                if (propertyPrice > criteria.maxPrice) {
                    show = false;
                }
            }
            
            property.style.display = show ? 'block' : 'none';
        });
    }
    
    // Toast notification system
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="bi bi-${getToastIcon(type)} me-2"></i>
                ${message}
            </div>
        `;
        
        // Add toast styles
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${getToastColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    function getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    function getToastColor(type) {
        const colors = {
            success: '#198754',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#0d6efd'
        };
        return colors[type] || '#0d6efd';
    }
    
    // Search results display
    function showSearchResults(data) {
        showToast(`Found properties matching your criteria!`, 'success');
        
        // In a real application, this would:
        // 1. Make an API call with the search data
        // 2. Update the property cards with new results
        // 3. Show loading states and error handling
        
        console.log('Search criteria:', data);
    }
    
    // Property details modal
    function showPropertyDetails(title) {
        // In a real application, this would show a detailed modal
        // with more information about the property
        showToast(`Viewing details for: ${title}`, 'info');
    }
    
    // Initialize tooltips (if Bootstrap tooltips are used)
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Lazy loading for images (performance optimization)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key to close modals or clear search
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                const modal = bootstrap.Modal.getInstance(activeModal);
                if (modal) modal.hide();
            }
        }
    });
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Basic validation
            if (!formObject.firstName || !formObject.lastName || !formObject.email || !formObject.subject || !formObject.message) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formObject.email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showToast('Thank you for your message! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            }, 2000);
        });
    }
    
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Clear previous validation
            clearValidation();
            
            // Basic validation
            let isValid = true;
            
            if (!email) {
                showFieldError('email', 'Email address is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showFieldError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            if (!password) {
                showFieldError('password', 'Password is required');
                isValid = false;
            } else if (password.length < 6) {
                showFieldError('password', 'Password must be at least 6 characters');
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            // Show loading state
            const loginBtn = document.getElementById('loginBtn');
            const originalText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing In...';
            loginBtn.disabled = true;
            
            // Simulate login process
            setTimeout(() => {
                // Reset button
                loginBtn.innerHTML = originalText;
                loginBtn.disabled = false;
                
                // Simulate successful login
                showToast('Login successful! Redirecting...', 'success');
                
                // Store login state
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('userEmail', email);
                } else {
                    sessionStorage.setItem('userEmail', email);
                }
                
                // Redirect to dashboard or home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }, 2000);
        });
        
        // Password toggle functionality
        const passwordToggle = document.getElementById('passwordToggle');
        const passwordInput = document.getElementById('password');
        
        if (passwordToggle && passwordInput) {
            passwordToggle.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                icon.classList.toggle('bi-eye');
                icon.classList.toggle('bi-eye-slash');
            });
        }
        
        // Real-time validation
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value && !isValidEmail(this.value)) {
                    showFieldError('email', 'Please enter a valid email address');
                } else {
                    clearFieldError('email');
                }
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('blur', function() {
                if (this.value && this.value.length < 6) {
                    showFieldError('password', 'Password must be at least 6 characters');
                } else {
                    clearFieldError('password');
                }
            });
        }
    }
    
    // Forgot password functionality
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    if (forgotPasswordLink && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = new bootstrap.Modal(forgotPasswordModal);
            modal.show();
        });
    }
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('resetEmail').value;
            
            if (!email) {
                showToast('Please enter your email address.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            submitBtn.disabled = true;
            
            // Simulate password reset
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(forgotPasswordModal);
                modal.hide();
                
                // Show success message
                showToast('Password reset link sent to your email!', 'success');
                this.reset();
            }, 2000);
        });
    }
    
    // Social login buttons
    const googleLogin = document.getElementById('googleLogin');
    const facebookLogin = document.getElementById('facebookLogin');
    
    if (googleLogin) {
        googleLogin.addEventListener('click', function() {
            showToast('Google login would be implemented here', 'info');
        });
    }
    
    if (facebookLogin) {
        facebookLogin.addEventListener('click', function() {
            showToast('Facebook login would be implemented here', 'info');
        });
    }
    
    // Helper functions for login
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    function clearValidation() {
        const fields = ['email', 'password'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(fieldId + 'Error');
            
            field.classList.remove('is-invalid', 'is-valid');
            
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        });
    }
    
    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(registerForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Clear previous validation
            clearRegisterValidation();
            
            // Validation
            let isValid = true;
            
            // First Name validation
            if (!formObject.firstName || formObject.firstName.trim().length < 2) {
                showFieldError('firstName', 'First name must be at least 2 characters');
                isValid = false;
            }
            
            // Last Name validation
            if (!formObject.lastName || formObject.lastName.trim().length < 2) {
                showFieldError('lastName', 'Last name must be at least 2 characters');
                isValid = false;
            }
            
            // Email validation
            if (!formObject.email) {
                showFieldError('email', 'Email address is required');
                isValid = false;
            } else if (!isValidEmail(formObject.email)) {
                showFieldError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Phone validation (optional but if provided, should be valid)
            if (formObject.phone && !isValidPhone(formObject.phone)) {
                showFieldError('phone', 'Please enter a valid phone number');
                isValid = false;
            }
            
            // Password validation
            if (!formObject.password) {
                showFieldError('password', 'Password is required');
                isValid = false;
            } else if (formObject.password.length < 8) {
                showFieldError('password', 'Password must be at least 8 characters');
                isValid = false;
            } else if (!isStrongPassword(formObject.password)) {
                showFieldError('password', 'Password must contain uppercase, lowercase, number and special character');
                isValid = false;
            }
            
            // Confirm Password validation
            if (!formObject.confirmPassword) {
                showFieldError('confirmPassword', 'Please confirm your password');
                isValid = false;
            } else if (formObject.password !== formObject.confirmPassword) {
                showFieldError('confirmPassword', 'Passwords do not match');
                isValid = false;
            }
            
            // User Type validation
            if (!formObject.userType) {
                showFieldError('userType', 'Please select your role');
                isValid = false;
            }
            
            // Terms acceptance validation
            if (!formObject.termsAccepted) {
                showFieldError('terms', 'You must accept the Terms of Service and Privacy Policy');
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            // Show loading state
            const registerBtn = document.getElementById('registerBtn');
            const originalText = registerBtn.innerHTML;
            registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';
            registerBtn.disabled = true;
            
            // Simulate registration process
            setTimeout(() => {
                // Reset button
                registerBtn.innerHTML = originalText;
                registerBtn.disabled = false;
                
                // Simulate successful registration
                showToast('Account created successfully! Welcome to PropertyMatch!', 'success');
                
                // Store user data
                const userData = {
                    firstName: formObject.firstName,
                    lastName: formObject.lastName,
                    email: formObject.email,
                    phone: formObject.phone,
                    userType: formObject.userType,
                    newsletter: formObject.newsletter === 'on'
                };
                
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('userEmail', formObject.email);
                
                // Redirect to login or dashboard
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }, 3000);
        });
        
        // Password strength indicator
        const passwordInput = document.getElementById('password');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        if (passwordInput && strengthFill && strengthText) {
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                const strength = calculatePasswordStrength(password);
                
                // Reset classes
                strengthFill.className = 'strength-fill';
                strengthText.className = 'strength-text';
                
                if (password.length === 0) {
                    strengthFill.style.width = '0%';
                    strengthText.textContent = 'Password strength';
                    return;
                }
                
                // Apply strength classes
                if (strength.score < 2) {
                    strengthFill.classList.add('weak');
                    strengthText.classList.add('weak');
                    strengthText.textContent = 'Weak';
                } else if (strength.score < 3) {
                    strengthFill.classList.add('fair');
                    strengthText.classList.add('fair');
                    strengthText.textContent = 'Fair';
                } else if (strength.score < 4) {
                    strengthFill.classList.add('good');
                    strengthText.classList.add('good');
                    strengthText.textContent = 'Good';
                } else {
                    strengthFill.classList.add('strong');
                    strengthText.classList.add('strong');
                    strengthText.textContent = 'Strong';
                }
            });
        }
        
        // Password toggle functionality
        const passwordToggle = document.getElementById('passwordToggle');
        const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        
        if (passwordToggle) {
            passwordToggle.addEventListener('click', function() {
                const passwordInput = document.getElementById('password');
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                icon.classList.toggle('bi-eye');
                icon.classList.toggle('bi-eye-slash');
            });
        }
        
        if (confirmPasswordToggle) {
            confirmPasswordToggle.addEventListener('click', function() {
                const confirmPasswordInput = document.getElementById('confirmPassword');
                const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPasswordInput.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                icon.classList.toggle('bi-eye');
                icon.classList.toggle('bi-eye-slash');
            });
        }
        
        // Real-time validation
        const inputs = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword', 'userType'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('blur', function() {
                    validateField(inputId, this.value);
                });
            }
        });
    }
    
    // Social registration buttons
    const googleRegister = document.getElementById('googleRegister');
    const facebookRegister = document.getElementById('facebookRegister');
    
    if (googleRegister) {
        googleRegister.addEventListener('click', function() {
            showToast('Google registration would be implemented here', 'info');
        });
    }
    
    if (facebookRegister) {
        facebookRegister.addEventListener('click', function() {
            showToast('Facebook registration would be implemented here', 'info');
        });
    }
    
    // Helper functions for registration
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    function isStrongPassword(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;
        
        return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
    }
    
    function calculatePasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        Object.values(checks).forEach(check => {
            if (check) score++;
        });
        
        return { score, checks };
    }
    
    function validateField(fieldId, value) {
        switch (fieldId) {
            case 'firstName':
            case 'lastName':
                if (value && value.trim().length < 2) {
                    showFieldError(fieldId, `${fieldId === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`);
                } else {
                    clearFieldError(fieldId);
                }
                break;
            case 'email':
                if (value && !isValidEmail(value)) {
                    showFieldError(fieldId, 'Please enter a valid email address');
                } else {
                    clearFieldError(fieldId);
                }
                break;
            case 'phone':
                if (value && !isValidPhone(value)) {
                    showFieldError(fieldId, 'Please enter a valid phone number');
                } else {
                    clearFieldError(fieldId);
                }
                break;
            case 'password':
                if (value && value.length < 8) {
                    showFieldError(fieldId, 'Password must be at least 8 characters');
                } else if (value && !isStrongPassword(value)) {
                    showFieldError(fieldId, 'Password must contain uppercase, lowercase, number and special character');
                } else {
                    clearFieldError(fieldId);
                }
                break;
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (value && value !== password) {
                    showFieldError(fieldId, 'Passwords do not match');
                } else {
                    clearFieldError(fieldId);
                }
                break;
            case 'userType':
                if (!value) {
                    showFieldError(fieldId, 'Please select your role');
                } else {
                    clearFieldError(fieldId);
                }
                break;
        }
    }
    
    function clearRegisterValidation() {
        const fields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword', 'userType', 'terms'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(fieldId + 'Error');
            
            if (field) {
                field.classList.remove('is-invalid', 'is-valid');
            }
            
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        });
    }
    
    console.log('PropertyMatch initialized successfully!');
});

// Simple banner initialization (no complex animations)

// Utility functions
const PropertyMatch = {
    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },
    
    // Format date
    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    // Debounce function for search
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Initialize Active Navbar States
function initActiveNavbar() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Check if current page matches the link
        const linkHref = link.getAttribute('href');
        
        if (currentPage === '/' || currentPage === '/index.html') {
            if (linkHref === '/' || linkHref === '/index.html' || linkHref === 'index.html') {
                link.classList.add('active');
            }
        } else if (currentPage.includes(linkHref.replace('/', ''))) {
            link.classList.add('active');
        }
    });
}
