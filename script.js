const form = document.querySelector('#formDaftar');
const fields = form.querySelectorAll('input');
const nama = document.querySelector('#nama');
const email = document.querySelector('#email');
const hp = document.querySelector('#hp');
const password = document.querySelector('#password');
const retypePassword = document.querySelector('#retypePassword');
const tanggal = document.querySelector('#tanggal');
const statusForm = document.querySelector('#statusForm');

const pesan = {
    nama: {
        kosong: 'Nama wajib diisi.',
        pendek: 'Nama minimal 3 karakter.'
    },
    email: {
        kosong: 'Email wajib diisi.',
        format: 'Format email salah. Contoh: nama@domain.com'
    },
    hp: {
        kosong: 'Nomor WhatsApp wajib diisi.',
        format: 'Format nomor salah. Gunakan 08 dan 10–13 digit. Contoh: 081234567890'
    },
    password: {
        kosong: 'Password wajib diisi.',
        pendek: 'Password harus minimal 8 digit.'
    },
    retypePassword: {
        kosong: 'Re-type Password wajib diisi.',
        beda: 'Password dan Re-type Password berbeda.'
    },
    tanggal: {
        kosong: 'Tanggal lahir wajib diisi.',
        umur: 'Usia harus minimal 20 tahun.'
    }
};

function showError(input, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    const errorElement =
        document.getElementById(input.id + '-error');
    errorElement.textContent = message;
    return false;
}

function clearError(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.removeAttribute('aria-invalid');
    const errorElement =
        document.getElementById(input.id + '-error');
    errorElement.textContent = '';
    return true;
}

function tanggalMaksimalUmur20() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 20);
    return today.toISOString().split('T')[0];
}
tanggal.max = tanggalMaksimalUmur20();

function cekField(input) {
    const value = input.value.trim();
    const validity = input.validity;
    const p = pesan[input.id];
    if (value === '') {
        return showError(input, p.kosong);
    }

    if (input.id === 'password' && validity.tooShort) {
        return showError(input, p.pendek);
    }

    if (
        input.id === 'retypePassword' &&
        input.value !== password.value
    ) {
        return showError(input, p.beda);
    }

    if (
        input.id === 'tanggal' &&
        input.value > tanggal.max
    ) {
        return showError(input, p.umur);
    }

    if (validity.typeMismatch || validity.patternMismatch) {
        if (input.id === 'email') {
            return showError(input, p.format);
        }
        if (input.id === 'hp') {
            return showError(input, p.format);
        }
    }
    if (validity.tooShort) {
        return showError(input, p.pendek);
    }
    return clearError(input);
}

function semuaFieldValid() {
    let valid = true;
    for (const input of fields) {
        if (!cekField(input)) {
            valid = false;
        }
    }

    if (
        password.value !== '' &&
        retypePassword.value !== '' &&
        password.value !== retypePassword.value
    ) {
        showError(
            retypePassword,
            pesan.retypePassword.beda
        );
        valid = false;
    }
    return valid;
}

function fokusErrorPertama() {
    const firstError =
        form.querySelector('[aria-invalid="true"]');
    if (firstError) {
        firstError.focus();
    }
}

for (const input of fields) {
    input.addEventListener('blur', function () {
        cekField(input);
    });
}

password.addEventListener('input', function () {
    if (retypePassword.value !== '') {
        cekField(retypePassword);
    }
});

retypePassword.addEventListener('input', function () {
    if (retypePassword.value === '') {
        return;
    }
    cekField(retypePassword);
});

form.addEventListener('submit', function (event) {
    event.preventDefault();  // Mencegah form langsung terkirim

    statusForm.className = ''; // Bersihkan status sebelumnya
    statusForm.textContent = '';

    const valid = semuaFieldValid(); // Jalankan seluruh validasi

    if (!valid) { // Jika ada error:
        fokusErrorPertama(); 
        return;
    }

    statusForm.textContent =
        'Pendaftaran berhasil! Semua data sudah sesuai aturan.';
    statusForm.className =
        'alert alert-success mt-3';

    form.reset(); // Kosongkan form setelah berhasil

    for (const input of fields) { // Hilangkan tanda valid setelah reset
        input.classList.remove('is-valid');
    }
});
