// Complete EmailJS Forms Handler for BriTech
// Add this script tag to your pages: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

// Initialize EmailJS-brianwanderi123@gmail.com used 
emailjs.init("hw_wHsUiOZgfwfHrR");
emailjs.init("7cNwkfnpjn9HrmOdO");

// ===== UTILITY FUNCTIONS =====

// Device and Location Detection Functions
function getDeviceInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';
    
    // Detect Browser
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';
    
    // Detect OS
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    
    // Detect Device Type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const deviceType = isMobile ? 'Mobile' : 'Desktop';
    
    return `${browser} ${deviceType} on ${os}`;
}

async function getLocationInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        return {
            ip: data.ip || 'Unknown',
            city: data.city || 'Unknown',
            country: data.country_name || 'Unknown',
            region: data.region || 'Unknown'
        };
    } catch (error) {
        console.error('Location fetch error:', error);
        return {
            ip: 'Unable to detect',
            city: 'Unknown',
            country: 'Unknown',
            region: 'Unknown'
        };
    }
}

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'linear-gradient(135deg, #27ae60, #229954)' : 'linear-gradient(135deg, #e74c3c, #c0392b)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

// ===== FORM 1: SUBSCRIPTION FORM =====
async function handleSubscribe(event) {
    event.preventDefault();
    
    const form = event.target;
    const emailInput = form.querySelector('.email-input');
    const submitBtn = form.querySelector('.subscribe-btn');
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    const deviceInfo = getDeviceInfo();
    const locationInfo = await getLocationInfo();
    
    const templateParams = {
        to_email: 'brianwanderi123@gmail.com',
        subject: '🔔 New Subscriber Alert - BriTech Prime',
        subscriber_email: emailInput.value,
        subscription_date: new Date().toLocaleString('en-US', {
            timeZone: 'Africa/Nairobi',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        device_info: deviceInfo,
        ip_address: locationInfo.ip,
        city: locationInfo.city,
        country: locationInfo.country,
        location: `${locationInfo.city}, ${locationInfo.country}`,
        message: `🔔 NEW SUBSCRIBER ALERT 🔔

SUBSCRIBER DETAILS:
Email: ${emailInput.value}
Date: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}

SECURITY INFO:
📍 Location: ${locationInfo.city}, ${locationInfo.region}, ${locationInfo.country}
💻 Device: ${deviceInfo}
🌐 IP Address: ${locationInfo.ip}

This subscriber wants to receive updates about BriTech Prime services and industry insights.`
    };
    
    emailjs.send('service_rv4frip', 'template_le9edmq', templateParams)
        .then(function(response) {
            showNotification('🎉 Thank you for subscribing! Welcome to BriTech Prime!', 'success');
            form.reset();
        })
        .catch(function(error) {
            console.error('EmailJS error:', error);
            showNotification('❌ Something went wrong. Please try again.', 'error');
        })
        .finally(function() {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// ===== FORM 2: QUOTE REQUEST FORM =====
async function submitQuoteForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Get selected services
    const services = Array.from(form.querySelectorAll('input[name="services"]:checked'))
        .map(checkbox => checkbox.value)
        .join(', ') || 'None specified';
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const deviceInfo = getDeviceInfo();
    const locationInfo = await getLocationInfo();
    
    const templateParams = {
        to_email: 'brianwanderi123@gmail.com',
        subject: '💼 New Quote Request - BriTech Prime',
        first_name: formData.get('firstName'),
        last_name: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company') || 'Not provided',
        job_title: formData.get('jobTitle') || 'Not provided',
        country: formData.get('country'),
        city: formData.get('city'),
        address: formData.get('address') || 'Not provided',
        services: services,
        budget: formData.get('budget'),
        duration: formData.get('duration'),
        project_description: formData.get('projectDescription') || 'No description provided',
        referral: formData.get('referral') || 'Not specified',
        urgency: formData.get('urgency') || 'Not specified',
        submission_date: new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }),
        device_info: deviceInfo,
        ip_address: locationInfo.ip,
        client_location: `${locationInfo.city}, ${locationInfo.country}`,
        message: `💼 NEW QUOTE REQUEST 💼

CLIENT INFORMATION:
Name: ${formData.get('firstName')} ${formData.get('lastName')}
Email: ${formData.get('email')}
Phone: ${formData.get('phone')}
Company: ${formData.get('company') || 'Not provided'}
Job Title: ${formData.get('jobTitle') || 'Not provided'}

LOCATION:
Address: ${formData.get('address') || 'Not provided'}
City: ${formData.get('city')}
Country: ${formData.get('country')}

PROJECT DETAILS:
Services: ${services}
Budget: ${formData.get('budget')}
Duration: ${formData.get('duration')}
Urgency: ${formData.get('urgency') || 'Not specified'}

PROJECT DESCRIPTION:
${formData.get('projectDescription') || 'No description provided'}

ADDITIONAL INFO:
How they found us: ${formData.get('referral') || 'Not specified'}
Submission Date: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}

TECHNICAL INFO:
📍 Location: ${locationInfo.city}, ${locationInfo.country}
💻 Device: ${deviceInfo}
🌐 IP Address: ${locationInfo.ip}`
    };
    
    emailjs.send('service_rv4frip', 'template_96m8wti', templateParams)
        .then(function(response) {
            showNotification('🎉 Quote request sent successfully! We\'ll get back to you within 24 hours.', 'success');
            form.reset();
            if (typeof closeQuotePopup === 'function') {
                closeQuotePopup();
            }
        })
        .catch(function(error) {
            console.error('EmailJS error:', error);
            showNotification('❌ Failed to send quote request. Please try again.', 'error');
        })
        .finally(function() {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}



// Different email Js From here githuabrianwanderi123@gmail.com
// ===== FORM 3: CONTACT FORM =====
async function submitContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    const formData = new FormData(form);
    
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const deviceInfo = getDeviceInfo();
    const locationInfo = await getLocationInfo();
    
    const templateParams = {
        to_email: 'brianwanderi123@gmail.com',
        subject: '📧 New Contact Form Message - BriTech Prime',
        first_name: formData.get('firstName'),
        last_name: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone') || 'Not provided',
        company: formData.get('company') || 'Not provided',
        service: formData.get('service'),
        budget: formData.get('budget') || 'Not specified',
        project_message: formData.get('message'),
        newsletter: formData.get('newsletter') ? 'Yes' : 'No',
        submission_date: new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }),
        device_info: deviceInfo,
        ip_address: locationInfo.ip,
        client_location: `${locationInfo.city}, ${locationInfo.country}`,
        message: `📧 NEW CONTACT FORM MESSAGE 📧

CLIENT INFORMATION:
Name: ${formData.get('firstName')} ${formData.get('lastName')}
Email: ${formData.get('email')}
Phone: ${formData.get('phone') || 'Not provided'}
Company: ${formData.get('company') || 'Not provided'}

PROJECT DETAILS:
Service Interested: ${formData.get('service')}
Budget Range: ${formData.get('budget') || 'Not specified'}
Newsletter Subscription: ${formData.get('newsletter') ? 'Yes' : 'No'}

MESSAGE:
${formData.get('message')}

SUBMISSION INFO:
Date: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}

TECHNICAL INFO:
📍 Location: ${locationInfo.city}, ${locationInfo.country}
💻 Device: ${deviceInfo}
🌐 IP Address: ${locationInfo.ip}`
    };
    
    emailjs.send('service_1ljs2iz', 'template_cjyl6km', templateParams)
        .then(function(response) {
            showNotification('🎉 Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
        })
        .catch(function(error) {
            console.error('EmailJS error:', error);
            showNotification('❌ Failed to send message. Please try again.', 'error');
        })
        .finally(function() {
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.disabled = false;
        });
}

// Event listener for contact form
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', submitContactForm);
    }
});

// ===== FORM 4: JOB APPLICATION FORM =====
async function submitApplication(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    const formData = new FormData(form);
    
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.querySelector('.btn-text').textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    const deviceInfo = getDeviceInfo();
    const locationInfo = await getLocationInfo();
    
    // Handle file uploads (Note: EmailJS has file size limitations)
    const files = {
        nationalId: form.nationalId.files[0]?.name || 'Not uploaded',
        resume: form.resume.files[0]?.name || 'Not uploaded',
        portfolio: form.portfolio.files[0]?.name || 'Not uploaded',
        certificates: Array.from(form.certificates.files).map(f => f.name).join(', ') || 'Not uploaded'
    };
    
    const templateParams = {
        to_email: 'brianwanderi123@gmail.com',
        subject: '🎯 New Job Application - BriTech Prime',
        full_name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        date_of_birth: formData.get('dateOfBirth'),
        country: formData.get('country'),
        city: formData.get('city'),
        position: formData.get('position'),
        experience: formData.get('experience'),
        expected_salary: formData.get('expectedSalary'),
        cover_letter: formData.get('message') || 'No cover letter provided',
        portfolio_url: formData.get('portfolioUrl') || 'Not provided',
        data_consent: formData.get('dataConsent') ? 'Yes' : 'No',
        future_opportunities: formData.get('futureOpportunities') ? 'Yes' : 'No',
        files_uploaded: `National ID: ${files.nationalId}, Resume: ${files.resume}, Portfolio: ${files.portfolio}, Certificates: ${files.certificates}`,
        submission_date: new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }),
        device_info: deviceInfo,
        ip_address: locationInfo.ip,
        applicant_location: `${locationInfo.city}, ${locationInfo.country}`,
        message: `🎯 NEW JOB APPLICATION 🎯

APPLICANT INFORMATION:
Name: ${formData.get('fullName')}
Email: ${formData.get('email')}
Phone: ${formData.get('phone')}
Date of Birth: ${formData.get('dateOfBirth')}
Location: ${formData.get('city')}, ${formData.get('country')}

POSITION DETAILS:
Position: ${formData.get('position')}
Experience: ${formData.get('experience')}
Expected Salary: ${formData.get('expectedSalary')}

FILES UPLOADED:
📄 National ID/Passport: ${files.nationalId}
📋 Resume/CV: ${files.resume}
🎨 Portfolio: ${files.portfolio}
🎓 Certificates: ${files.certificates}

COVER LETTER:
${formData.get('message') || 'No cover letter provided'}

PORTFOLIO/LINKS:
${formData.get('portfolioUrl') || 'Not provided'}

CONSENT:
Data Processing Consent: ${formData.get('dataConsent') ? 'Yes' : 'No'}
Future Opportunities: ${formData.get('futureOpportunities') ? 'Yes' : 'No'}

SUBMISSION INFO:
Date: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}

TECHNICAL INFO:
📍 Location: ${locationInfo.city}, ${locationInfo.country}
💻 Device: ${deviceInfo}
🌐 IP Address: ${locationInfo.ip}

⚠️ NOTE: Uploaded files need to be downloaded from the form submission system.`
    };
    
    emailjs.send('service_1ljs2iz', 'template_113xash', templateParams)
        .then(function(response) {
            showNotification('🎉 Application submitted successfully! We\'ll review it and get back to you.', 'success');
            form.reset();
            // Clear file previews if they exist
            const previews = document.querySelectorAll('.upload-preview');
            previews.forEach(preview => preview.innerHTML = '');
        })
        .catch(function(error) {
            console.error('EmailJS error:', error);
            showNotification('❌ Failed to submit application. Please try again.', 'error');
        })
        .finally(function() {
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.disabled = false;
        });
}

// ===== CITY UPDATE FUNCTION FOR JOB APPLICATION =====
function updateCities() {
    const countrySelect = document.getElementById('country');
    const citySelect = document.getElementById('city');
    const selectedCountry = countrySelect.value;
    
    // Clear existing options
    citySelect.innerHTML = '<option value="">Select City</option>';
    
    const cities = {
        kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega'],
        uganda: ['Kampala', 'Gulu', 'Lira', 'Mbarara', 'Jinja', 'Bwizibwera', 'Mbale', 'Mukono', 'Kasese', 'Masaka'],
        tanzania: ['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 'Tanga', 'Kahama', 'Tabora', 'Kigoma'],
        rwanda: ['Kigali', 'Butare', 'Gitarama', 'Ruhengeri', 'Gisenyi', 'Byumba', 'Cyangugu', 'Kibungo', 'Kibuye', 'Gikongoro'],
        other: ['Other (Specify in message)']
    };
    
    if (cities[selectedCountry]) {
        cities[selectedCountry].forEach(city => {
            const option = document.createElement('option');
            option.value = city.toLowerCase().replace(/\s+/g, '-');
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// ===== POPUP FUNCTIONS =====
function closeQuotePopup() {
    const popup = document.getElementById('quotePopupOverlay');
    if (popup) {
        popup.style.display = 'none';
    }
}

function closeContactForm() {
    // Add your close contact form logic here
    console.log('Close contact form function called');
}