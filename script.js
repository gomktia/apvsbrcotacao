document.addEventListener('DOMContentLoaded', function () {

    // ===== POPUP COTACAO =====
    const popupCotacao = document.getElementById('popup-cotacao');
    const popupClose = document.getElementById('popup-close');
    const openPopupBtns = document.querySelectorAll('.open-popup');

    function openCotacaoPopup(e) {
        if (e) e.preventDefault();
        popupCotacao.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCotacaoPopup() {
        popupCotacao.classList.remove('active');
        document.body.style.overflow = '';
    }

    openPopupBtns.forEach(function (btn) {
        btn.addEventListener('click', openCotacaoPopup);
    });

    if (popupClose) {
        popupClose.addEventListener('click', closeCotacaoPopup);
    }

    if (popupCotacao) {
        popupCotacao.addEventListener('click', function (e) {
            if (e.target === popupCotacao) {
                closeCotacaoPopup();
            }
        });
    }

    // ===== POPUP SUPORTE =====
    const popupSuporteEl = document.getElementById('popup-suporte');
    const btnOpenSuporteEl = document.getElementById('btn-open-suporte');
    const popupSuporteCloseBtn = document.querySelector('.popup-suporte-close');
    const openPopupFromSuporteBtn = document.querySelector('.open-popup-from-suporte');

    if (btnOpenSuporteEl) {
        btnOpenSuporteEl.addEventListener('click', function () {
            popupSuporteEl.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (popupSuporteCloseBtn) {
        popupSuporteCloseBtn.addEventListener('click', function () {
            popupSuporteEl.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (popupSuporteEl) {
        popupSuporteEl.addEventListener('click', function (e) {
            if (e.target === popupSuporteEl) {
                popupSuporteEl.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (openPopupFromSuporteBtn) {
        openPopupFromSuporteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            popupSuporteEl.classList.remove('active');
            openCotacaoPopup();
        });
    }

    // ===== SERVICOS ACCORDION (Cobertura) =====
    var servicoBtns = document.querySelectorAll('.servico-btn');
    servicoBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tabId = this.getAttribute('data-tab');
            var content = document.querySelector('.servico-content[data-tab-content="' + tabId + '"]');

            // Toggle current
            var isActive = this.classList.contains('active');

            // Close all
            servicoBtns.forEach(function (b) { b.classList.remove('active'); });
            document.querySelectorAll('.servico-content').forEach(function (c) { c.classList.remove('active'); });

            // Open if wasn't active
            if (!isActive) {
                this.classList.add('active');
                if (content) content.classList.add('active');
            }
        });
    });

    // ===== FAQ ACCORDION =====
    var faqBtns = document.querySelectorAll('.faq-btn');
    faqBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var content = this.nextElementSibling;
            var isActive = this.classList.contains('active');

            // Close all
            faqBtns.forEach(function (b) { b.classList.remove('active'); });
            document.querySelectorAll('.faq-content').forEach(function (c) { c.classList.remove('active'); });

            // Open if wasn't active
            if (!isActive) {
                this.classList.add('active');
                if (content) content.classList.add('active');
            }
        });
    });

    // ===== PHONE VALIDATION =====
    function enforceNumericOnly(inputElement) {
        var value = inputElement.value.replace(/[^0-9]/g, '');
        var maxLength = 11;
        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }
        inputElement.value = value;
        if (value.length === maxLength) {
            clearLengthError(inputElement);
        }
    }

    function showLengthError(inputElement, message) {
        var errorDiv = inputElement.parentNode.querySelector('.phone-length-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'phone-length-error';
            inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
        }
        errorDiv.textContent = message;
        inputElement.style.borderColor = '#dc3545';
    }

    function clearLengthError(inputElement) {
        var errorDiv = inputElement.parentNode.querySelector('.phone-length-error');
        if (errorDiv) {
            errorDiv.textContent = '';
        }
        inputElement.style.borderColor = '';
    }

    // Setup validation for all phone inputs
    var phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(function (phoneInput) {
        phoneInput.setAttribute('maxlength', '11');
        phoneInput.setAttribute('inputmode', 'numeric');
        phoneInput.removeAttribute('pattern');

        phoneInput.addEventListener('input', function () {
            enforceNumericOnly(this);
        });

        phoneInput.addEventListener('blur', function () {
            var phoneNumber = this.value.replace(/[^0-9]/g, '');
            if (phoneNumber.length > 0 && phoneNumber.length < 11) {
                showLengthError(this, 'O telefone deve ter exatamente 11 dígitos.');
            }
        });
    });

    // ===== ENVIO DE FORMULARIO POR EMAIL =====
    function enviarFormulario(nome, telefone, origem) {
        var now = new Date();
        return fetch('https://formsubmit.co/ajax/aldirgsindra@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                Nome: nome || 'Não informado',
                Telefone: telefone,
                Origem: origem,
                Data: now.toLocaleDateString('pt-BR'),
                Horario: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                _subject: 'Nova Cotação APVS - ' + (nome || telefone),
                _template: 'table'
            })
        });
    }

    // ===== FORM SUBMISSION (Popup) =====
    var popupForm = document.getElementById('popup-form');
    if (popupForm) {
        popupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var phoneInput = document.getElementById('popup-phone');
            var nameInput = document.getElementById('popup-name');
            var phoneNumber = phoneInput.value.replace(/[^0-9]/g, '');

            if (phoneNumber.length !== 11) {
                e.stopPropagation();
                showLengthError(phoneInput, 'O telefone deve ter exatamente 11 dígitos (DDD + Número).');
                return;
            }

            clearLengthError(phoneInput);

            var nome = nameInput ? nameInput.value : '';
            var telefone = phoneInput.value;

            enviarFormulario(nome, telefone, 'Popup Cotação').finally(function () {
                popupForm.reset();
                window.location.href = 'obrigado.html';
            });
        });
    }

    // ===== FORM SUBMISSION (Contact / About section) =====
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var phoneInput = document.getElementById('contact-phone');
            var nameInput = document.getElementById('contact-name');
            var phoneNumber = phoneInput.value.replace(/[^0-9]/g, '');

            if (phoneNumber.length !== 11) {
                e.stopPropagation();
                showLengthError(phoneInput, 'O telefone deve ter exatamente 11 dígitos (DDD + Número).');
                return;
            }

            clearLengthError(phoneInput);

            var nome = nameInput ? nameInput.value : '';
            var telefone = phoneInput.value;

            enviarFormulario(nome, telefone, 'Formulário Quem Somos').finally(function () {
                contactForm.reset();
                window.location.href = 'obrigado.html';
            });
        });
    }

    // ===== COOKIE NOTICE =====
    var cookieNotice = document.getElementById('cookie-notice');
    var cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieNotice) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieNotice.classList.add('active');
        }

        if (cookieAcceptBtn) {
            cookieAcceptBtn.addEventListener('click', function () {
                cookieNotice.classList.remove('active');
                localStorage.setItem('cookiesAccepted', 'true');
            });
        }
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                var headerOffset = 20;
                var elementPosition = targetElement.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
