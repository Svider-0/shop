const shopName = 'ЭлектроникаПро';
let year = 2026;
let products = [];

const users = [
    { login: 'admin', password: 'admin123' },
    { login: 'ivan', password: 'qwerty1' }
];

function formatPrice(value) {
    return value.toLocaleString('ru-RU') + ' руб.';
}

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        console.log(shopName, year, products.length);
        console.log(formatPrice(products[0].price));
        for (const item of products) {
            if (item.price > 10000) console.log('Дорогой товар:', item.name);
        }
        renderProducts(products);
    })
    .catch(error => console.error('Ошибка загрузки:', error));

function renderProducts(list) {
    const productList = document.querySelector('#product-list');
    if (!productList) return;
    let html = '';
    for (const item of list) {
        html += '<article class="product-card">' +
            '<span class="badge">Хит</span>' +
            '<img src="' + item.image + '" alt="' + item.name + '" loading="lazy">' +
            '<h3>' + item.name + '</h3>' +
            '<p>Цена: ' + formatPrice(item.price) + '</p>' +
            '<p><button class="btn-buy">В корзину</button></p>' +
            '</article>';
    }
    productList.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    const btnAll = document.querySelector('#btn-all');
    const btnCheap = document.querySelector('#btn-cheap');
    const categoryFilter = document.querySelector('#category-filter');
    const form = document.querySelector('#order-form');
    const message = document.querySelector('#form-message');
    const loginForm = document.querySelector('#login-form');
    const userInfo = document.querySelector('#user-info');
    const menuBtn = document.querySelector('#menu-btn');
    const nav = document.querySelector('#menu');

    if (btnAll) btnAll.addEventListener('click', () => renderProducts(products));

    if (btnCheap) btnCheap.addEventListener('click', () => {
        const cheap = products.filter(item => item.price <= 10000);
        renderProducts(cheap);
    });

    if (categoryFilter) categoryFilter.addEventListener('change', function (event) {
        const value = event.target.value;
        if (value === 'all') {
            renderProducts(products);
            return;
        }
        const filtered = products.filter(item => item.category === value);
        renderProducts(filtered);
    });

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = form.elements.name.value.trim();
            const email = form.elements.email.value.trim();
            const quantity = Number(form.elements.quantity.value);

            if (name.length < 2) { message.textContent = 'Укажите имя (минимум 2 символа)'; return; }
            if (!email.includes('@') || !email.includes('.')) { message.textContent = 'Укажите корректный email'; return; }
            if (!(quantity >= 1 && quantity <= 10)) { message.textContent = 'Количество от 1 до 10'; return; }

            message.textContent = 'Заказ принят! Спасибо, ' + name + '.';
            message.style.color = 'green';
            form.reset();
        });
    }

    const savedUser = sessionStorage.getItem('user');
    if (savedUser && loginForm && userInfo) {
        loginForm.hidden = true;
        userInfo.textContent = 'Вы вошли как: ' + savedUser;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const login = event.target.login.value.trim();
            const password = event.target.password.value;

            const found = users.some(function (u) {
                return u.login === login && u.password === password;
            });

            if (found) {
                sessionStorage.setItem('user', login);
                loginForm.hidden = true;
                if (userInfo) userInfo.textContent = 'Вы вошли как: ' + login;
            } else {
                alert('Неверные данные');
            }
        });
    }

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function () {
            nav.classList.toggle('open');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                nav.classList.remove('open');
            });
        });
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-buy')) {
            if (!sessionStorage.getItem('user')) {
                alert('Войдите, чтобы добавить товар');
                return;
            }
            alert('Товар добавлен в корзину');
        }
    });
});