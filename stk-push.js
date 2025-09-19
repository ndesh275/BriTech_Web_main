// Global variable to store original invoice amount
let originalInvoiceAmount = 2450.00;

// M-Pesa payment processing
function processMpesaPayment() {
    const phoneNumber = document.getElementById('mpesaPhone').value;
    const amount = document.getElementById('mpesaAmount').value;

    if (!phoneNumber || !amount) {
        alert('Please enter your phone number and amount.');
        return;
    }

    if (!phoneNumber.match(/^254[0-9]{9}$/)) {
        alert('Please enter a valid Kenyan phone number (format: 254XXXXXXXXX).');
        return;
    }

    // Simulate M-Pesa STK push
    alert(`M-Pesa payment request sent to ${phoneNumber} for KES ${amount}. Please check your phone and enter your M-Pesa PIN to complete the transaction.`);
    
    // Simulate successful payment after a delay
    setTimeout(() => {
        showPaymentSuccess(phoneNumber, 'M-Pesa');
        // Send confirmation SMS simulation
        console.log(`SMS: Payment of KES ${amount} received from ${phoneNumber}. Transaction ID: MP${Date.now()}`);
    }, 3000);
}

// Update payment amount and remaining balance
function updatePaymentAmount(value) {
    const amount = parseFloat(value) || 0;
    const remaining = Math.max(0, originalInvoiceAmount - amount);
    
    // Update all remaining balance displays
    document.querySelectorAll('.remaining-balance').forEach(el => {
        el.textContent = `Remaining: $${remaining.toFixed(2)}`;
        
        if (remaining === 0) {
            el.style.color = '#27ae60';
            el.textContent = 'Fully Paid';
        } else if (amount > originalInvoiceAmount) {
            el.style.color = '#e74c3c';
            el.textContent = `Overpay: $${(amount - originalInvoiceAmount).toFixed(2)}`;
        } else {
            el.style.color = '#666';
        }
    });
    
    // Update M-Pesa display amount
    const displayAmount = document.getElementById('displayAmount');
    if (displayAmount) {
        // Convert USD to KES (assuming 1 USD = 150 KES)
        const kesAmount = amount * 150;
        displayAmount.textContent = `KES ${kesAmount.toFixed(2)}`;
    }
    
    // Update pay button text
    const payButton = document.querySelector('.btn-pay-now');
    if (payButton && amount > 0) {
        payButton.innerHTML = `<i class="fas fa-lock"></i> Pay $${amount.toFixed(2)}`;
    }
}

// Updated process payment function
function processPayment() {
    const activePaymentForm = document.querySelector('.payment-form.active');
    const paymentMethod = activePaymentForm.id;
    
    // Show loading state
    const payButton = document.querySelector('.btn-pay-now');
    const originalText = payButton.innerHTML;
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    payButton.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        if (paymentMethod === 'cardPayment') {
            processCardPayment();
        } else if (paymentMethod === 'paypalPayment') {
            processPayPalPayment();
        } else if (paymentMethod === 'bankPayment') {
            processBankTransfer();
        } else if (paymentMethod === 'mpesaPayment') {
            processMpesaPayment();
        }
        
        // Reset button
        payButton.innerHTML = originalText;
        payButton.disabled = false;
    }, 2000);
}

// Enhanced M-Pesa phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const mpesaPhoneInput = document.getElementById('mpesaPhone');
    if (mpesaPhoneInput) {
        mpesaPhoneInput.addEventListener('input', function() {
            let value = this.value.replace(/[^0-9]/g, '');
            
            // Auto-add 254 prefix for Kenyan numbers
            if (value.length > 0 && !value.startsWith('254')) {
                if (value.startsWith('0')) {
                    value = '254' + value.substring(1);
                } else if (value.startsWith('7') || value.startsWith('1')) {
                    value = '254' + value;
                }
            }
            
            this.value = value;
        });
    }

    // Auto-update amount display for M-Pesa
    const mpesaAmountInput = document.getElementById('mpesaAmount');
    if (mpesaAmountInput) {
        mpesaAmountInput.addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            updatePaymentAmount(amount);
        });
    }
});

// Initialize amounts when modal opens
function openPayInvoiceModal(invoiceId, amount) {
    const modal = document.getElementById('payInvoiceModal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Update modal with invoice details
    if (invoiceId && amount) {
        originalInvoiceAmount = parseFloat(amount.replace('$', '').replace(',', ''));
        document.getElementById('invoiceTitle').textContent = invoiceId;
        document.getElementById('totalAmount').textContent = amount;
        
        // Set default amounts in all payment forms
        document.getElementById('cardAmount').value = originalInvoiceAmount.toFixed(2);
        document.getElementById('paypalAmount').value = originalInvoiceAmount.toFixed(2);
        document.getElementById('mpesaAmount').value = originalInvoiceAmount.toFixed(2);
        
        updatePaymentAmount(originalInvoiceAmount);
        
        document.querySelector('.btn-pay-now').innerHTML = `<i class="fas fa-lock"></i> Pay ${amount}`;
    }
}