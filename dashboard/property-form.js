// Property Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize form functionality
    initPropertyForm();
    initAgentManagement();
    initImageUpload();
    initFormValidation();
    initStatusHandling();
    
    console.log('Property form initialized successfully!');
});

// Initialize Property Form
function initPropertyForm() {
    const form = document.getElementById('propertyForm');
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
            previewProperty();
        });
    }
}

// Agent Management
function initAgentManagement() {
    const addAgentBtn = document.getElementById('addAgentBtn');
    const agentsContainer = document.getElementById('agentsContainer');
    let agentCount = 1;
    
    if (addAgentBtn) {
        addAgentBtn.addEventListener('click', function() {
            addNewAgent();
        });
    }
    
    // Add new agent function
    window.addNewAgent = function() {
        const agentCard = document.createElement('div');
        agentCard.className = 'agent-card';
        agentCard.setAttribute('data-agent-index', agentCount);
        
        agentCard.innerHTML = `
            <div class="agent-header">
                <h5 class="agent-title">Agent ${agentCount + 1}</h5>
                <button type="button" class="btn btn-sm btn-outline-danger remove-agent">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="agentName_${agentCount}" class="form-label">Agent Name *</label>
                    <input type="text" class="form-control" id="agentName_${agentCount}" name="agentName[]" 
                           placeholder="e.g., John Doe" required>
                    <div class="invalid-feedback"></div>
                </div>
                
                <div class="col-md-6">
                    <label for="agentContact_${agentCount}" class="form-label">Contact Number *</label>
                    <input type="tel" class="form-control" id="agentContact_${agentCount}" name="agentContact[]" 
                           placeholder="e.g., +65 9123 4567" required>
                    <div class="invalid-feedback"></div>
                </div>
                
                <div class="col-12">
                    <label for="agentAgency_${agentCount}" class="form-label">Agency *</label>
                    <input type="text" class="form-control" id="agentAgency_${agentCount}" name="agentAgency[]" 
                           placeholder="e.g., PropNex Realty" required>
                    <div class="invalid-feedback"></div>
                </div>
            </div>
        `;
        
        agentsContainer.appendChild(agentCard);
        agentCount++;
        
        // Update remove buttons visibility
        updateRemoveButtons();
        
        // Add event listener to new remove button
        const removeBtn = agentCard.querySelector('.remove-agent');
        removeBtn.addEventListener('click', function() {
            agentCard.remove();
            updateRemoveButtons();
        });
        
        showToast('New agent added successfully!', 'success');
    }
    
    // Update remove buttons visibility
    function updateRemoveButtons() {
        const agentCards = document.querySelectorAll('.agent-card');
        const removeButtons = document.querySelectorAll('.remove-agent');
        
        if (agentCards.length > 1) {
            removeButtons.forEach(btn => btn.style.display = 'inline-block');
        } else {
            removeButtons.forEach(btn => btn.style.display = 'none');
        }
    }
    
    // Add event listeners to existing remove buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-agent')) {
            const agentCard = e.target.closest('.agent-card');
            if (agentCard) {
                agentCard.remove();
                updateRemoveButtons();
                showToast('Agent removed successfully!', 'info');
            }
        }
    });
    
    // Initialize remove buttons visibility
    updateRemoveButtons();
}

// Image Upload Functionality
function initImageUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('propertyImages');
    const imagePreview = document.getElementById('imagePreview');
    const previewGrid = document.getElementById('previewGrid');
    let uploadedFiles = [];
    
    if (uploadZone && fileInput) {
        // Click to upload
        uploadZone.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Drag and drop
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        });
        
        // File input change
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        });
    }
    
    function handleFiles(files) {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            showToast('Please select only image files.', 'error');
            return;
        }
        
        imageFiles.forEach(file => {
            if (uploadedFiles.length >= 10) {
                showToast('Maximum 10 images allowed.', 'warning');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = {
                    file: file,
                    url: e.target.result,
                    id: Date.now() + Math.random()
                };
                
                uploadedFiles.push(imageData);
                displayImagePreview(imageData);
            };
            reader.readAsDataURL(file);
        });
        
        if (uploadedFiles.length > 0) {
            imagePreview.style.display = 'block';
        }
    }
    
    function displayImagePreview(imageData) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.setAttribute('data-image-id', imageData.id);
        
        previewItem.innerHTML = `
            <img src="${imageData.url}" alt="Property Image" class="preview-image">
            <button type="button" class="preview-remove" data-image-id="${imageData.id}">
                <i class="bi bi-x"></i>
            </button>
        `;
        
        previewGrid.appendChild(previewItem);
        
        // Add remove functionality
        const removeBtn = previewItem.querySelector('.preview-remove');
        removeBtn.addEventListener('click', function() {
            removeImage(imageData.id);
        });
    }
    
    function removeImage(imageId) {
        uploadedFiles = uploadedFiles.filter(img => img.id !== imageId);
        const previewItem = document.querySelector(`[data-image-id="${imageId}"]`);
        if (previewItem) {
            previewItem.remove();
        }
        
        if (uploadedFiles.length === 0) {
            imagePreview.style.display = 'none';
        }
    }
}

// Form Validation
function initFormValidation() {
    const form = document.getElementById('propertyForm');
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
    if (value && fieldName === 'propertyGuruUrl') {
        if (!isValidUrl(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid PropertyGuru URL.';
        }
    }
    
    if (value && fieldName === 'askingPrice') {
        const price = parseFloat(value);
        if (isNaN(price) || price <= 0) {
            isValid = false;
            errorMessage = 'Please enter a valid asking price.';
        }
    }
    
    if (value && (fieldName === 'landSize' || fieldName === 'builtUp')) {
        const size = parseFloat(value);
        if (isNaN(size) || size <= 0) {
            isValid = false;
            errorMessage = 'Please enter a valid size.';
        }
    }
    
    if (value && fieldName === 'mrtDistance') {
        const distance = parseFloat(value);
        if (isNaN(distance) || distance <= 0) {
            isValid = false;
            errorMessage = 'Please enter a valid distance.';
        }
    }
    
    if (value && fieldName === 'agentContact') {
        if (!isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
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

// Status Handling
function initStatusHandling() {
    const statusSelect = document.getElementById('status');
    const soldDateContainer = document.getElementById('soldDateContainer');
    const soldDateInput = document.getElementById('soldDate');
    
    if (statusSelect && soldDateContainer) {
        statusSelect.addEventListener('change', function() {
            if (this.value === 'Sold') {
                soldDateContainer.style.display = 'block';
                soldDateInput.setAttribute('required', 'required');
            } else {
                soldDateContainer.style.display = 'none';
                soldDateInput.removeAttribute('required');
                soldDateInput.value = '';
            }
        });
    }
}

// Form Submission
function handleFormSubmission() {
    const form = document.getElementById('propertyForm');
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
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Adding Property...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Add listing date
        const listingDate = new Date().toISOString().split('T')[0];
        formData.append('listingDate', listingDate);
        
        // Process form data
        const propertyData = processFormData(formData);
        
        // Save to localStorage (in a real app, this would be sent to a server)
        savePropertyData(propertyData);
        
        showToast('Property added successfully!', 'success');
        
        // Reset form or redirect
        setTimeout(() => {
            resetForm();
            // In a real app, you might redirect to the properties list
            // window.location.href = 'properties.html';
        }, 2000);
    }, 3000);
}

function processFormData(formData) {
    const data = {};
    
    // Basic information
    data.propertyGuruUrl = formData.get('propertyGuruUrl');
    data.fullAddress = formData.get('fullAddress');
    data.district = formData.get('district');
    data.tenure = formData.get('tenure');
    data.storeys = formData.get('storeys');
    data.condition = formData.get('condition');
    
    // Property details
    data.facing = formData.get('facing');
    data.landSize = formData.get('landSize');
    data.builtUp = formData.get('builtUp');
    data.askingPrice = formData.get('askingPrice');
    data.bedrooms = formData.get('bedrooms');
    data.bathrooms = formData.get('bathrooms');
    data.helperRoom = formData.get('helperRoom');
    
    // Location details
    data.nearestMrt = formData.get('nearestMrt');
    data.mrtDistance = formData.get('mrtDistance');
    data.nearbySchools = formData.get('nearbySchools');
    
    // Agent information
    data.agents = [];
    const agentNames = formData.getAll('agentName[]');
    const agentContacts = formData.getAll('agentContact[]');
    const agentAgencies = formData.getAll('agentAgency[]');
    
    for (let i = 0; i < agentNames.length; i++) {
        if (agentNames[i] && agentContacts[i] && agentAgencies[i]) {
            data.agents.push({
                name: agentNames[i],
                contact: agentContacts[i],
                agency: agentAgencies[i]
            });
        }
    }
    
    // Property analysis
    data.pros = formData.get('pros');
    data.cons = formData.get('cons');
    data.notes = formData.get('notes');
    
    // Status
    data.status = formData.get('status');
    data.soldDate = formData.get('soldDate');
    data.listingDate = formData.get('listingDate');
    
    return data;
}

function savePropertyData(propertyData) {
    // Get existing properties from localStorage
    const existingProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    // Add new property
    propertyData.id = Date.now();
    propertyData.createdAt = new Date().toISOString();
    existingProperties.push(propertyData);
    
    // Save back to localStorage
    localStorage.setItem('properties', JSON.stringify(existingProperties));
    
    console.log('Property saved:', propertyData);
}

// Save Draft
function saveDraft() {
    const form = document.getElementById('propertyForm');
    const formData = new FormData(form);
    const draftData = processFormData(formData);
    
    // Save as draft
    draftData.isDraft = true;
    draftData.savedAt = new Date().toISOString();
    
    localStorage.setItem('propertyDraft', JSON.stringify(draftData));
    
    showToast('Draft saved successfully!', 'success');
}

// Reset Form
function resetForm() {
    const form = document.getElementById('propertyForm');
    form.reset();
    
    // Clear validation states
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });
    
    // Reset agent management
    const agentsContainer = document.getElementById('agentsContainer');
    const agentCards = agentsContainer.querySelectorAll('.agent-card');
    for (let i = 1; i < agentCards.length; i++) {
        agentCards[i].remove();
    }
    
    // Reset image upload
    const imagePreview = document.getElementById('imagePreview');
    const previewGrid = document.getElementById('previewGrid');
    if (imagePreview && previewGrid) {
        imagePreview.style.display = 'none';
        previewGrid.innerHTML = '';
    }
    
    // Reset status
    const soldDateContainer = document.getElementById('soldDateContainer');
    if (soldDateContainer) {
        soldDateContainer.style.display = 'none';
    }
    
    showToast('Form reset successfully!', 'info');
}

// Preview Property
function previewProperty() {
    const form = document.getElementById('propertyForm');
    const formData = new FormData(form);
    const propertyData = processFormData(formData);
    
    // Create preview modal or redirect to preview page
    showToast('Preview functionality would open here', 'info');
    console.log('Property preview data:', propertyData);
}

// Utility Functions
function isValidUrl(string) {
    try {
        new URL(string);
        return string.includes('propertyguru.com.sg');
    } catch (_) {
        return false;
    }
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
