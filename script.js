// Dados iniciais
let menuItems = [
    { id: 1, name: "Bolinho de Bacalhau", price: 28.90, category: "petiscos", description: "Deliciosos bolinhos de bacalhau crocantes por fora e macios por dentro.", color: "#8B4513" },
    { id: 2, name: "Balde de Cerveja", price: 45.00, category: "bebidas", description: "Balde com 5 cervejas geladas da sua preferência.", color: "#FFD700" },
    { id: 3, name: "Rifo Domínguez", price: 32.50, category: "pratos", description: "Prato especial da casa com carne suína temperada e acompanhamentos.", color: "#D2691E" },
    { id: 4, name: "Torre de Cerveja", price: 89.90, category: "bebidas", description: "Torre de cerveja com 2 litros da sua escolha.", color: "#FFD700" },
    { id: 5, name: "Palada", price: 24.90, category: "petiscos", description: "Tradicional petisco nordestino feito com carne seca.", color: "#8B4513" }
];

let cart = [];
let orders = [];
let reservations = [];
let isAdminLoggedIn = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();
    renderMenu();
    updateCartDisplay();
    renderAccompaniments();
    showSection('home');
});

// Funções de navegação
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostrar a seção solicitada
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
    }
    
    // Scroll para a seção
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showAdminSection(sectionId) {
    // Esconder todos os painéis do admin
    document.querySelectorAll('#adminInterface > .admin-panel > div').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    // Mostrar o painel solicitado
    const panel = document.getElementById(sectionId);
    if (panel) {
        panel.classList.remove('hidden');
    }
}

function showCartInterface() {
    showSection('cartInterface');
}

// Funções do menu
function renderMenu() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    menuGrid.innerHTML = menuItems.map(item => `
        <div class="menu-item">
            <div class="menu-item-img" style="background-color: ${item.color}">
                ${getItemIcon(item.category)}
            </div>
            <div class="menu-item-content">
                <h3 class="menu-item-title">${item.name}</h3>
                <div class="menu-item-price">R$ ${item.price.toFixed(2)}</div>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-actions">
                    <button class="btn btn-primary" onclick="addToCart(${item.id})">Adicionar ao Carrinho</button>
                </div>
            </div>
        </div>
    `).join('');
}

function getItemIcon(category) {
    const icons = {
        'petiscos': '🍤',
        'bebidas': '🍺',
        'pratos': '🍽️'
    };
    return icons[category] || '🍴';
}

// Funções do carrinho
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
        const existingItem = cart.find(i => i.id === itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCartDisplay();
        alert(`${item.name} adicionado ao carrinho!`);
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');

    if (cartItems && cartTotal && cartCount) {
        let total = 0;
        let itemsHTML = '';

        if (cart.length === 0) {
            itemsHTML = '<p>Seu carrinho está vazio.</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                itemsHTML += `
                    <div class="cart-item">
                        <div>
                            <strong>${item.name}</strong>
                            <div>R$ ${item.price.toFixed(2)} x ${item.quantity}</div>
                        </div>
                        <div>
                            R$ ${itemTotal.toFixed(2)}
                            <button class="btn btn-secondary" onclick="removeFromCart(${item.id})">Remover</button>
                        </div>
                    </div>
                `;
            });
        }

        cartItems.innerHTML = itemsHTML;
        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        updateCartDisplay();
    }
}

// Acompanhamentos
function renderAccompaniments() {
    const savoryGrid = document.getElementById('savoryAccompaniments');
    const sweetGrid = document.getElementById('sweetAccompaniments');

    if (savoryGrid) {
        savoryGrid.innerHTML = `
            <div class="accompaniment-item">
                <input type="checkbox" id="ketchup">
                <label for="ketchup">Ketchup</label>
            </div>
            <div class="accompaniment-item">
                <input type="checkbox" id="maionese">
                <label for="maionese">Maionese</label>
            </div>
            <div class="accompaniment-item">
                <input type="checkbox" id="molho-verde">
                <label for="molho-verde">Molho Verde</label>
            </div>
        `;
    }

    if (sweetGrid) {
        sweetGrid.innerHTML = `
            <div class="accompaniment-item">
                <input type="checkbox" id="chocolate">
                <label for="chocolate">Calda de Chocolate</label>
            </div>
            <div class="accompaniment-item">
                <input type="checkbox" id="morango">
                <label for="morango">Calda de Morango</label>
            </div>
            <div class="accompaniment-item">
                <input type="checkbox" id="caramelo">
                <label for="caramelo">Calda de Caramelo</label>
            </div>
        `;
    }
}

// Processar pedido
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.');
        return;
    }
    showSection('checkout');
}

function processPayment() {
    const customerName = document.getElementById('customerName').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    if (!customerName || !customerAddress || !customerPhone || !paymentMethod) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Criar pedido
    const order = {
        id: Date.now(),
        customerName,
        customerAddress,
        customerPhone,
        paymentMethod,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        date: new Date().toLocaleString('pt-BR')
    };

    orders.push(order);
    saveToStorage();

    alert('Pedido realizado com sucesso! Em breve entraremos em contato para confirmar.');

    // Limpar carrinho
    cart = [];
    updateCartDisplay();
    showSection('home');
}

// Reservas
function makeReservation() {
    const name = document.getElementById('reservationName').value;
    const phone = document.getElementById('reservationPhone').value;
    const date = document.getElementById('reservationDate').value;
    const time = document.getElementById('reservationTime').value;
    const guests = document.getElementById('reservationGuests').value;

    if (!name || !phone || !date || !time || !guests) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const reservation = {
        id: Date.now(),
        name,
        phone,
        date,
        time,
        guests: parseInt(guests),
        status: 'pending'
    };

    reservations.push(reservation);
    saveToStorage();

    alert('Reserva realizada com sucesso! Entraremos em contato para confirmar.');

    // Limpar formulário
    document.getElementById('reservationName').value = '';
    document.getElementById('reservationPhone').value = '';
    document.getElementById('reservationDate').value = '';
    document.getElementById('reservationTime').value = '';
    document.getElementById('reservationGuests').value = '';
}

// Admin
function loginAdmin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (username === 'admin' && password === 'admin123') {
        isAdminLoggedIn = true;
        document.getElementById('mainInterface').classList.add('hidden');
        document.getElementById('adminInterface').classList.remove('hidden');
        renderAdminData();
    } else {
        alert('Usuário ou senha incorretos.');
    }
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    document.getElementById('adminInterface').classList.add('hidden');
    document.getElementById('mainInterface').classList.remove('hidden');
    showSection('home');
}

function renderAdminData() {
    renderOrdersAdmin();
    renderReservationsAdmin();
}

function renderOrdersAdmin() {
    const pendingOrders = document.getElementById('pendingOrders');
    const confirmedOrders = document.getElementById('confirmedOrders');
    const deliveredOrders = document.getElementById('deliveredOrders');

    if (pendingOrders && confirmedOrders && deliveredOrders) {
        pendingOrders.innerHTML = '';
        confirmedOrders.innerHTML = '';
        deliveredOrders.innerHTML = '';

        orders.forEach(order => {
            const orderCard = `
                <div class="order-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h4>Pedido #${order.id}</h4>
                        <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
                    </div>
                    <p><strong>Cliente:</strong> ${order.customerName}</p>
                    <p><strong>Endereço:</strong> ${order.customerAddress}</p>
                    <p><strong>Telefone:</strong> ${order.customerPhone}</p>
                    <p><strong>Total:</strong> R$ ${order.total.toFixed(2)}</p>
                    <div style="margin-top: 1rem;">
                        <button class="btn btn-success" onclick="updateOrderStatus(${order.id}, 'confirmed')">Confirmar</button>
                        <button class="btn btn-primary" onclick="updateOrderStatus(${order.id}, 'delivered')">Entregue</button>
                        <button class="btn btn-danger" onclick="deleteOrder(${order.id})">Excluir</button>
                    </div>
                </div>
            `;

            if (order.status === 'pending') {
                pendingOrders.innerHTML += orderCard;
            } else if (order.status === 'confirmed') {
                confirmedOrders.innerHTML += orderCard;
            } else if (order.status === 'delivered') {
                deliveredOrders.innerHTML += orderCard;
            }
        });

        if (pendingOrders.innerHTML === '') pendingOrders.innerHTML = '<p>Nenhum pedido pendente</p>';
        if (confirmedOrders.innerHTML === '') confirmedOrders.innerHTML = '<p>Nenhum pedido confirmado</p>';
        if (deliveredOrders.innerHTML === '') deliveredOrders.innerHTML = '<p>Nenhum pedido entregue</p>';
    }
}

function renderReservationsAdmin() {
    const pendingReservations = document.getElementById('pendingReservations');
    const confirmedReservations = document.getElementById('confirmedReservations');

    if (pendingReservations && confirmedReservations) {
        pendingReservations.innerHTML = '';
        confirmedReservations.innerHTML = '';

        reservations.forEach(reservation => {
            const reservationCard = `
                <div class="reservation-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h4>Reserva #${reservation.id}</h4>
                        <span class="order-status status-${reservation.status}">${getStatusText(reservation.status)}</span>
                    </div>
                    <p><strong>Cliente:</strong> ${reservation.name}</p>
                    <p><strong>Telefone:</strong> ${reservation.phone}</p>
                    <p><strong>Data:</strong> ${reservation.date}</p>
                    <p><strong>Horário:</strong> ${reservation.time}</p>
                    <p><strong>Pessoas:</strong> ${reservation.guests}</p>
                    <div style="margin-top: 1rem;">
                        <button class="btn btn-success" onclick="updateReservationStatus(${reservation.id}, 'confirmed')">Confirmar</button>
                        <button class="btn btn-danger" onclick="deleteReservation(${reservation.id})">Excluir</button>
                    </div>
                </div>
            `;

            if (reservation.status === 'pending') {
                pendingReservations.innerHTML += reservationCard;
            } else if (reservation.status === 'confirmed') {
                confirmedReservations.innerHTML += reservationCard;
            }
        });

        if (pendingReservations.innerHTML === '') pendingReservations.innerHTML = '<p>Nenhuma reserva pendente</p>';
        if (confirmedReservations.innerHTML === '') confirmedReservations.innerHTML = '<p>Nenhuma reserva confirmada</p>';
    }
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendente',
        'confirmed': 'Confirmado',
        'delivered': 'Entregue'
    };
    return statusMap[status] || status;
}

function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        saveToStorage();
        renderOrdersAdmin();
    }
}

function updateReservationStatus(reservationId, status) {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
        reservation.status = status;
        saveToStorage();
        renderReservationsAdmin();
    }
}

function deleteOrder(orderId) {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
        orders = orders.filter(o => o.id !== orderId);
        saveToStorage();
        renderOrdersAdmin();
    }
}

function deleteReservation(reservationId) {
    if (confirm('Tem certeza que deseja excluir esta reserva?')) {
        reservations = reservations.filter(r => r.id !== reservationId);
        saveToStorage();
        renderReservationsAdmin();
    }
}

// Storage
function saveToStorage() {
    localStorage.setItem('petiscariaOrders', JSON.stringify(orders));
    localStorage.setItem('petiscariaReservations', JSON.stringify(reservations));
}

function loadFromStorage() {
    const savedOrders = localStorage.getItem('petiscariaOrders');
    const savedReservations = localStorage.getItem('petiscariaReservations');

    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
    if (savedReservations) {
        reservations = JSON.parse(savedReservations);
    }
}