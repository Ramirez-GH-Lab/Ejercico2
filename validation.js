// ============================================================================
// VALIDACIÓN DE CAMPOS
// ============================================================================

const validationRules = {
    nombre: {
        validate: (value) => {
            if (!value || value.trim().length === 0) {
                return { valid: false, message: 'El nombre es requerido.' };
            }
            if (value.length < 3) {
                return { valid: false, message: 'El nombre debe tener al menos 3 caracteres.' };
            }
            if (value.length > 100) {
                return { valid: false, message: 'El nombre no puede exceder 100 caracteres.' };
            }
            if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s'-]+$/.test(value)) {
                return { valid: false, message: 'El nombre solo puede contener letras, espacios, apóstrofes y guiones.' };
            }
            return { valid: true, message: '' };
        }
    },

    email: {
        validate: (value) => {
            if (!value || value.trim().length === 0) {
                return { valid: false, message: 'El correo electrónico es requerido.' };
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return { valid: false, message: 'Por favor ingrese un correo electrónico válido.' };
            }
            if (value.length > 254) {
                return { valid: false, message: 'El correo electrónico no puede exceder 254 caracteres.' };
            }
            return { valid: true, message: '' };
        }
    },

    telefono: {
        validate: (value) => {
            if (value.trim().length === 0) {
                return { valid: true, message: '' }; // Opcional
            }
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                return { valid: false, message: 'El teléfono contiene caracteres inválidos.' };
            }
            const digitsOnly = value.replace(/\D/g, '');
            if (digitsOnly.length < 7) {
                return { valid: false, message: 'El teléfono debe tener al menos 7 dígitos.' };
            }
            return { valid: true, message: '' };
        }
    },

    fechaNacimiento: {
        validate: (value) => {
            if (!value) {
                return { valid: false, message: 'La fecha de nacimiento es requerida.' };
            }
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 5) {
                return { valid: false, message: 'El alumno debe tener al menos 5 años.' };
            }
            if (age > 30) {
                return { valid: false, message: 'Por favor verifique la fecha de nacimiento.' };
            }
            return { valid: true, message: '' };
        }
    },

    grado: {
        validate: (value) => {
            if (!value) {
                return { valid: false, message: 'Por favor seleccione un grado.' };
            }
            return { valid: true, message: '' };
        }
    },

    seccion: {
        validate: (value) => {
            if (!value || value.trim().length === 0) {
                return { valid: false, message: 'La sección es requerida.' };
            }
            if (value.length > 10) {
                return { valid: false, message: 'La sección no puede exceder 10 caracteres.' };
            }
            return { valid: true, message: '' };
        }
    },

    numeroMatricula: {
        validate: (value) => {
            if (!value || value.trim().length === 0) {
                return { valid: false, message: 'El número de matrícula es requerido.' };
            }
            if (value.length < 3 || value.length > 20) {
                return { valid: false, message: 'El número de matrícula debe tener entre 3 y 20 caracteres.' };
            }
            if (!/^[a-zA-Z0-9\-]+$/.test(value)) {
                return { valid: false, message: 'El número de matrícula solo puede contener letras, números y guiones.' };
            }
            return { valid: true, message: '' };
        }
    },

    nombreEmergencia: {
        validate: (value) => {
            if (!value || value.trim().length === 0) {
                return { valid: false, message: 'El nombre del contacto de emergencia es requerido.' };
            }
            if (value.length < 3) {
                return { valid: false, message: 'El nombre debe tener al menos 3 caracteres.' };
            }
            if (value.length > 100) {
                return { valid: false, message: 'El nombre no puede exceder 100 caracteres.' };
            }
            if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s'-]+$/.test(value)) {
                return { valid: false, message: 'El nombre solo puede contener letras, espacios, apóstrofes y guiones.' };
            }
            return { valid: true, message: '' };
        }
    },

    relacionEmergencia: {
        validate: (value) => {
            if (!value) {
                return { valid: false, message: 'Por favor seleccione una relación.' };
            }
            return { valid: true, message: '' };
        }
    },

    telefonoEmergencia: {
        validate: (value) => {
            if (!value || value.trim().length === 0) {
                return { valid: false, message: 'El teléfono de emergencia es requerido.' };
            }
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                return { valid: false, message: 'El teléfono contiene caracteres inválidos.' };
            }
            const digitsOnly = value.replace(/\D/g, '');
            if (digitsOnly.length < 7) {
                return { valid: false, message: 'El teléfono debe tener al menos 7 dígitos.' };
            }
            return { valid: true, message: '' };
        }
    },

    aceptoTerminos: {
        validate: (value) => {
            if (!value) {
                return { valid: false, message: 'Debe aceptar los términos y condiciones.' };
            }
            return { valid: true, message: '' };
        }
    },

    aceptoPrivacidad: {
        validate: (value) => {
            if (!value) {
                return { valid: false, message: 'Debe aceptar la política de privacidad.' };
            }
            return { valid: true, message: '' };
        }
    }
};

// ============================================================================
// FUNCIONES DE VALIDACIÓN INDIVIDUALES
// ============================================================================

function validateField(fieldName, value) {
    const rule = validationRules[fieldName];
    if (!rule) {
        console.warn(`No existe regla de validación para: ${fieldName}`);
        return { valid: true, message: '' };
    }

    const result = rule.validate(value);
    updateFieldUI(fieldName, result.valid);
    updateErrorMessage(fieldName, result.message);
    return result;
}

function validateCheckbox(fieldName, isChecked) {
    const rule = validationRules[fieldName];
    const result = rule.validate(isChecked);
    updateFieldUI(fieldName, result.valid, true);
    updateErrorMessage(fieldName, result.message);
    return result;
}

// ============================================================================
// ACTUALIZACIÓN DE INTERFAZ DE USUARIO
// ============================================================================

function updateFieldUI(fieldName, isValid, isCheckbox = false) {
    let element;
    
    if (isCheckbox) {
        element = document.getElementById(fieldName);
    } else {
        element = document.getElementById(fieldName);
    }

    if (!element) return;

    if (isValid) {
        element.classList.remove('error');
        element.classList.add('valid');
    } else {
        element.classList.remove('valid');
        element.classList.add('error');
    }
}

function updateErrorMessage(fieldName, message) {
    const errorElement = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
    
    if (!errorElement) return;

    if (message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// ============================================================================
// VALIDACIÓN COMPLETA DEL FORMULARIO
// ============================================================================

function validateForm(formData) {
    const errors = {};
    let isFormValid = true;

    // Validar campos de texto y select
    const fieldsToValidate = [
        'nombre', 'email', 'telefono', 'fechaNacimiento', 'grado', 'seccion',
        'numeroMatricula', 'nombreEmergencia', 'relacionEmergencia', 'telefonoEmergencia'
    ];

    fieldsToValidate.forEach(field => {
        const value = formData.get(field) || '';
        const result = validateField(field, value);
        if (!result.valid) {
            errors[field] = result.message;
            isFormValid = false;
        }
    });

    // Validar checkboxes
    const aceptoTerminos = formData.get('aceptoTerminos') === 'on';
    const resultTerminos = validateCheckbox('aceptoTerminos', aceptoTerminos);
    if (!resultTerminos.valid) {
        errors.aceptoTerminos = resultTerminos.message;
        isFormValid = false;
    }

    const aceptoPrivacidad = formData.get('aceptoPrivacidad') === 'on';
    const resultPrivacidad = validateCheckbox('aceptoPrivacidad', aceptoPrivacidad);
    if (!resultPrivacidad.valid) {
        errors.aceptoPrivacidad = resultPrivacidad.message;
        isFormValid = false;
    }

    return { isFormValid, errors };
}

// ============================================================================
// EXPORTAR FUNCIONES
// ============================================================================

export { validationRules, validateField, validateCheckbox, validateForm };
