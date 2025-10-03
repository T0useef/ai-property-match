// Buyer Profile Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize buyer profile form functionality
    initBuyerProfileForm();
    initConditionalFields();
    initFormValidation();
    initFormSubmission();
    
    console.log('Buyer profile form initialized successfully!');
});

// Initialize Buyer Profile Form
function initBuyerProfileForm() {
    const form = document.getElementById('buyerProfileForm');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const saveDraftFormBtn = document.getElementById('saveDraftFormBtn');
    const resetFormBtn = document.getElementById('resetFormBtn');
    const previewBtn = document.getElementById('previewBtn');
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
    }
    
    // Save draft functionality
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            saveDraft();
        });
    }
    
    if (saveDraftFormBtn) {
        saveDraftFormBtn.addEventListener('click', function() {
            saveDraft();
        });
    }
    
    // Reset form
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
                resetForm();
            }
        });
    }
    
    // Preview functionality
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            previewBuyerProfile();
        });
    }
}

// Initialize Conditional Fields
function initConditionalFields() {
    const purposeSelect = document.getElementById('purpose');
    const timelineContainer = document.getElementById('timelineContainer');
    const needToSellSelect = document.getElementById('needToSellCurrent');
    const currentHomeStatusContainer = document.getElementById('currentHomeStatusContainer');
    
    // Purpose change handler
    if (purposeSelect && timelineContainer) {
        purposeSelect.addEventListener('change', function() {
            if (this.value === 'Own Stay') {
                timelineContainer.style.display = 'block';
                document.getElementById('timelineToMoveIn').setAttribute('required', 'required');
            } else {
                timelineContainer.style.display = 'none';
                document.getElementById('timelineToMoveIn').removeAttribute('required');
                document.getElementById('timelineToMoveIn').value = '';
            }
        });
    }
    
    // Need to sell current property handler
    if (needToSellSelect && currentHomeStatusContainer) {
        needToSellSelect.addEventListener('change', function() {
            if (this.value === 'Yes') {
                currentHomeStatusContainer.style.display = 'block';
                document.getElementById('currentHomeSellingStatus').setAttribute('required', 'required');
            } else {
                currentHomeStatusContainer.style.display = 'none';
                document.getElementById('currentHomeSellingStatus').removeAttribute('required');
                document.getElementById('currentHomeSellingStatus').value = '';
            }
        });
    }
}

// Form Validation
function initFormValidation() {
    const form = document.getElementById('buyerProfileForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear validation on input
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                clearFieldValidation(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required.`;
    }
    
    // Specific field validations
    if (value && fieldName === 'buyerName') {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Buyer name must be at least 2 characters long.';
        }
    }
    
    if (value && (fieldName === 'minBudget' || fieldName === 'maxBudget')) {
        const budget = parseFloat(value);
        if (isNaN(budget) || budget <= 0) {
            isValid = false;
            errorMessage = 'Please enter a valid budget amount.';
        }
    }
    
    if (value && (fieldName === 'landSize' || fieldName === 'builtUpSize')) {
        const size = parseFloat(value);
        if (isNaN(size) || size <= 0) {
            isValid = false;
            errorMessage = 'Please enter a valid size.';
        }
    }
    
    if (value && fieldName === 'familySize') {
        const familySize = parseInt(value);
        if (isNaN(familySize) || familySize < 1 || familySize > 20) {
            isValid = false;
            errorMessage = 'Family size must be between 1 and 20.';
        }
    }
    
    // Budget range validation
    if (fieldName === 'maxBudget' && value) {
        const minBudget = parseFloat(document.getElementById('minBudget').value);
        const maxBudget = parseFloat(value);
        if (!isNaN(minBudget) && !isNaN(maxBudget) && maxBudget <= minBudget) {
            isValid = false;
            errorMessage = 'Maximum budget must be greater than minimum budget.';
        }
    }
    
    // Apply validation result
    if (isValid) {
        clearFieldValidation(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearFieldValidation(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = '';
    }
}

function showFieldError(field, message) {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = message;
    }
}

function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : 'This field';
}

// Form Submission
function initFormSubmission() {
    // This will be called by the form submission handler
}

function handleFormSubmission() {
    const form = document.getElementById('buyerProfileForm');
    const formData = new FormData(form);
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showToast('Please fix all validation errors before submitting.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Adding Buyer Profile...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Process form data
        const buyerData = processFormData(formData);
        
        // Save to localStorage (in a real app, this would be sent to a server)
        saveBuyerData(buyerData);
        
        showToast('Buyer profile added successfully!', 'success');
        
        // Reset form or redirect
        setTimeout(() => {
            resetForm();
            // In a real app, you might redirect to the buyer profiles list
            // window.location.href = 'buyer-profiles.html';
        }, 2000);
    }, 3000);
}

function processFormData(formData) {
    const data = {};
    
    // Basic information
    data.buyerName = formData.get('buyerName');
    
    // Location preferences
    data.preferredLocations = formData.get('preferredLocations');
    
    // Property requirements
    data.landSize = formData.get('landSize');
    data.builtUpSize = formData.get('builtUpSize');
    data.minBudget = formData.get('minBudget');
    data.maxBudget = formData.get('maxBudget');
    data.bedroomsNeeded = formData.get('bedroomsNeeded');
    data.tenurePreference = formData.get('tenurePreference');
    data.resaleOrNew = formData.get('resaleOrNew');
    
    // Purpose and timeline
    data.purpose = formData.get('purpose');
    data.timelineToMoveIn = formData.get('timelineToMoveIn');
    data.familySize = formData.get('familySize');
    data.helperRoomRequired = formData.get('helperRoomRequired');
    
    // Features and preferences
    data.mustHaveFeatures = formData.get('mustHaveFeatures');
    data.dontWantCriteria = formData.get('dontWantCriteria');
    
    // Financial information
    data.absdLiability = formData.get('absdLiability');
    data.needToSellCurrent = formData.get('needToSellCurrent');
    data.currentHomeSellingStatus = formData.get('currentHomeSellingStatus');
    data.currentResidence = formData.get('currentResidence');
    
    // Availability
    data.availableViewingSchedule = formData.get('availableViewingSchedule');
    data.scheduledZoomDate = formData.get('scheduledZoomDate');
    
    // Additional information
    data.remarks = formData.get('remarks');
    data.requiredAction = formData.get('requiredAction');
    
    return data;
}

function saveBuyerData(buyerData) {
    // Get existing buyers from localStorage
    const existingBuyers = JSON.parse(localStorage.getItem('buyers') || '[]');
    
    // Add new buyer
    buyerData.id = Date.now();
    buyerData.createdAt = new Date().toISOString();
    buyerData.status = 'Active';
    existingBuyers.push(buyerData);
    
    // Save back to localStorage
    localStorage.setItem('buyers', JSON.stringify(existingBuyers));
    
    console.log('Buyer profile saved:', buyerData);
}

// Save Draft
function saveDraft() {
    const form = document.getElementById('buyerProfileForm');
    const formData = new FormData(form);
    const draftData = processFormData(formData);
    
    // Save as draft
    draftData.isDraft = true;
    draftData.savedAt = new Date().toISOString();
    
    localStorage.setItem('buyerProfileDraft', JSON.stringify(draftData));
    
    showToast('Draft saved successfully!', 'success');
}

// Reset Form
function resetForm() {
    const form = document.getElementById('buyerProfileForm');
    form.reset();
    
    // Clear validation states
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });
    
    // Reset conditional fields
    const timelineContainer = document.getElementById('timelineContainer');
    const currentHomeStatusContainer = document.getElementById('currentHomeStatusContainer');
    
    if (timelineContainer) {
        timelineContainer.style.display = 'none';
    }
    
    if (currentHomeStatusContainer) {
        currentHomeStatusContainer.style.display = 'none';
    }
    
    showToast('Form reset successfully!', 'info');
}

// Preview Buyer Profile
function previewBuyerProfile() {
    const form = document.getElementById('buyerProfileForm');
    const formData = new FormData(form);
    const buyerData = processFormData(formData);
    
    // Create preview modal or redirect to preview page
    showToast('Preview functionality would open here', 'info');
    console.log('Buyer profile preview data:', buyerData);
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Toast Notification System
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="bi bi-${getToastIcon(type)} me-2"></i>
            ${message}
        </div>
    `;
    
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
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
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
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}
