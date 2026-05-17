// ============================================================================
// CONFIGURACIÓN INICIAL
// ============================================================================

const STUDENTS_STORAGE_KEY = 'registered_students';
const form = document.getElementById('registroForm');
const successMessage = document.getElementById('successMessage');
const alumnosTable = document.getElementById('alumnosTable').querySelector('tbody');
const noStudentsMessage = document.getElementById('noStudents');

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    loadStudentsFromStorage();
    setupFormListeners();
    setupTableListeners();
    setupKeyboardShortcuts();
});

// ============================================================================
// LISTENERS DEL FORMULARIO
// ============================================================================

function setupFormListeners() {
    // Validación en tiempo real para todos los campos
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.type === 'checkbox') {
                validateCheckbox(input.name, input.checked);
            } else {
                validateField(input.name, input.value);
            }
        });

        input.addEventListener('input', () => {
            if (input.type !== 'checkbox') {
                // Limpiar error mientras el usuario escribe
                if (input.classList.contains('error')) {
                    const errorElement = document.getElementById(`error${input.name.charAt(0).toUpperCase() + input.name.slice(1)}`);
                    if (errorElement) {
                        errorElement.style.display = 'none';
                    }
                    input.classList.remove('error');
                }
            }
        });
    });

    // Envío del formulario
    form.addEventListener('submit', handleFormSubmit);
}

// ============================================================================
// MANEJO DEL ENVÍO DEL FORMULARIO
// ============================================================================

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const { isFormValid, errors } = validateForm(formData);

    if (!isFormValid) {
        console.log('Errores de validación:', errors);
        return;
    }

    // Crear objeto alumno
    const newStudent = {
        id: generateId(),
        nombre: formData.get('nombre').trim(),
        email: formData.get('email').trim().toLowerCase(),
        telefono: formData.get('telefono').trim(),
        fechaNacimiento: formData.get('fechaNacimiento'),
        grado: formData.get('grado'),
        seccion: formData.get('seccion').trim(),
        numeroMatricula: formData.get('numeroMatricula').trim(),
        nombreEmergencia: formData.get('nombreEmergencia').trim(),
        relacionEmergencia: formData.get('relacionEmergencia'),
        telefonoEmergencia: formData.get('telefonoEmergencia').trim(),
        fechaRegistro: new Date().toISOString()
    };

    // Verificar duplicados
    const students = getStudentsFromStorage();
    const isDuplicate = students.some(s => 
        s.email === newStudent.email || 
        s.numeroMatricula === newStudent.numeroMatricula
    );

    if (isDuplicate) {
        alert('❌ Error: El email o número de matrícula ya está registrado.');
        return;
    }

    // Guardar estudiante
    students.push(newStudent);
    saveStudentsToStorage(students);

    // Mostrar mensaje de éxito
    showSuccessMessage();

    // Limpiar formulario
    form.reset();
    clearAllValidationUI();

    // Recargar tabla
    loadStudentsFromStorage();

    // Hacer scroll a la tabla
    document.querySelector('.table-wrapper').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================================
// GESTIÓN DE ALMACENAMIENTO
// ============================================================================

function saveStudentsToStorage(students) {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
}

function getStudentsFromStorage() {
    const data = localStorage.getItem(STUDENTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function loadStudentsFromStorage() {
    const students = getStudentsFromStorage();

    // Limpiar tabla
    alumnosTable.innerHTML = '';

    if (students.length === 0) {
        noStudentsMessage.style.display = 'block';
        return;
    }

    noStudentsMessage.style.display = 'none';

    // Agregar filas a la tabla
    students.forEach(student => {
        addStudentToTable(student);
    });

    updateStats(students);
}

function addStudentToTable(student) {
    const row = document.createElement('tr');
    row.dataset.studentId = student.id;

    row.innerHTML = `
        <td>${escapeHtml(student.nombre)}</td>
        <td>${escapeHtml(student.email)}</td>
        <td>Año ${student.grado}</td>
        <td>${escapeHtml(student.seccion)}</td>
        <td>${escapeHtml(student.numeroMatricula)}</td>
        <td>
            <div class="action-buttons">
                <button type="button" class="btn-small btn-edit" onclick="viewStudent('${student.id}')">Ver</button>
                <button type="button" class="btn-small btn-delete" onclick="deleteStudent('${student.id}')">Eliminar</button>
            </div>
        </td>
    `;

    alumnosTable.appendChild(row);
}

// ============================================================================
// ACCIONES DE TABLA
// ============================================================================

function viewStudent(studentId) {
    const students = getStudentsFromStorage();
    const student = students.find(s => s.id === studentId);

    if (!student) {
        alert('❌ Alumno no encontrado.');
        return;
    }

    const info = `
📋 INFORMACIÓN DEL ALUMNO

👤 DATOS PERSONALES:
• Nombre: ${student.nombre}
• Email: ${student.email}
• Teléfono: ${student.telefono || 'No proporcionado'}
• Fecha de Nacimiento: ${formatDate(student.fechaNacimiento)}

🎓 INFORMACIÓN ACADÉMICA:
• Grado: Año ${student.grado}
• Sección: ${student.seccion}
• Matrícula: ${student.numeroMatricula}

🆘 CONTACTO DE EMERGENCIA:
• Nombre: ${student.nombreEmergencia}
• Relación: ${student.relacionEmergencia}
• Teléfono: ${student.telefonoEmergencia}

📅 FECHA DE REGISTRO:
${formatDate(student.fechaRegistro)}
    `;

    alert(info);
}

function deleteStudent(studentId) {
    if (!confirm('¿Está seguro de que desea eliminar este alumno?')) {
        return;
    }

    let students = getStudentsFromStorage();
    students = students.filter(s => s.id !== studentId);

    saveStudentsToStorage(students);
    loadStudentsFromStorage();

    alert('✅ Alumno eliminado correctamente.');
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function generateId() {
    return `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

function showSuccessMessage() {
    successMessage.classList.remove('hidden');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 3000);
}

function resetForm() {
    form.reset();
    clearAllValidationUI();
    successMessage.classList.add('hidden');
}

function clearAllValidationUI() {
    form.querySelectorAll('input, select').forEach(field => {
        field.classList.remove('valid', 'error');
        const errorElement = document.getElementById(`error${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`);
        if (errorElement) {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }
    });
}

function updateStats(students) {
    // Aquí se pueden agregar estadísticas si es necesario
    console.log(`Total de alumnos registrados: ${students.length}`);
}

// ============================================================================
// ATAJOS DE TECLADO
// ============================================================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+N: Nuevo registro
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            resetForm();
            form.scrollIntoView({ behavior: 'smooth' });
        }

        // Ctrl+E: Exportar a CSV
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            exportToCSV();
        }

        // Ctrl+L: Limpiar todos los datos (con confirmación)
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            if (confirm('⚠️ ¿Está seguro de que desea eliminar TODOS los alumnos registrados? Esta acción no se puede deshacer.')) {
                localStorage.removeItem(STUDENTS_STORAGE_KEY);
                loadStudentsFromStorage();
                alert('✅ Todos los datos han sido eliminados.');
            }
        }
    });
}

// ============================================================================
// EXPORTACIÓN A CSV
// ============================================================================

function exportToCSV() {
    const students = getStudentsFromStorage();

    if (students.length === 0) {
        alert('⚠️ No hay alumnos para exportar.');
        return;
    }

    // Encabezados
    const headers = [
        'Nombre',
        'Email',
        'Teléfono',
        'Fecha de Nacimiento',
        'Grado',
        'Sección',
        'Matrícula',
        'Contacto Emergencia',
        'Relación',
        'Teléfono Emergencia',
        'Fecha de Registro'
    ];

    // Datos
    const rows = students.map(student => [
        `"${student.nombre}"`,
        `"${student.email}"`,
        `"${student.telefono}"`,
        `"${student.fechaNacimiento}"`,
        `"${student.grado}"`,
        `"${student.seccion}"`,
        `"${student.numeroMatricula}"`,
        `"${student.nombreEmergencia}"`,
        `"${student.relacionEmergencia}"`,
        `"${student.telefonoEmergencia}"`,
        `"${new Date(student.fechaRegistro).toLocaleString('es-ES')}"`
    ]);

    // Crear CSV
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.join(',') + '\n';
    });

    // Descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `alumnos_registrados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('✅ Archivo CSV exportado correctamente.');
}

// ============================================================================
// LISTENERS DE TABLA
// ============================================================================

function setupTableListeners() {
    // Eventos delegados para los botones de la tabla
    alumnosTable.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit')) {
            const studentId = e.target.closest('tr').dataset.studentId;
            viewStudent(studentId);
        } else if (e.target.classList.contains('btn-delete')) {
            const studentId = e.target.closest('tr').dataset.studentId;
            deleteStudent(studentId);
        }
    });
}
