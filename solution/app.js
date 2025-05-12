// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const serverUrl = 'http://localhost:5000/api';
const storageKey = 'savedState';

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const routes = {
  '/dashboard': { title: 'My Account', templateId: 'dashboard', init: refresh },
  '/login': { title: 'Login', templateId: 'login' }
};

function navigate(path) {
  window.history.pushState({}, path, window.location.origin + path);
  updateRoute();
}

function updateRoute() {
  const path = window.location.pathname;
  const route = routes[path];

  if (!route) return navigate('/dashboard');

  const template = document.getElementById(route.templateId);
  const view = template.content.cloneNode(true);
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(view);

  if (typeof route.init === 'function') route.init();

  document.title = route.title;
}

// ---------------------------------------------------------------------------
// API interactions
// ---------------------------------------------------------------------------

async function sendRequest(api, method = 'GET', body = null, useAuth = true) {
  const headers = body ? { 'Content-Type': 'application/json' } : {};
  if (useAuth && state.token) {
    headers['Authorization'] = 'Bearer ' + state.token;
  }

  try {
    const response = await fetch(serverUrl + api, {
      method,
      headers,
      body
    });
    return await response.json();
  } catch (error) {
    return { error: error.message || 'Unknown error' };
  }
}

async function loginUser(credentials) {
  return sendRequest('/auth/login', 'POST', credentials, false);
}

async function getAccount(user) {
  return sendRequest('/accounts/' + encodeURIComponent(user));
}

async function createAccount(account) {
  return sendRequest('/auth/register', 'POST', account);
}

async function createTransaction(user, transaction) {
  return sendRequest(`/accounts/${user}/transactions`, 'POST', transaction);
}

// ---------------------------------------------------------------------------
// Global state
// ---------------------------------------------------------------------------

let state = Object.freeze({
  account: null,
  token: null
});

function updateState(updates) {
  state = Object.freeze({ ...state, ...updates });
  localStorage.setItem(storageKey, JSON.stringify({ account: state.account, token: state.token }));
}

// ---------------------------------------------------------------------------
// Login/register
// ---------------------------------------------------------------------------

async function login() {
  const loginForm = document.getElementById('loginForm');
  const user = loginForm.user.value;
  const password = loginForm.password.value;

  const payload = JSON.stringify({ user, password });
  const result = await loginUser(payload);

  if (result.error || !result.token) {
    return updateElement('loginError', result.error || 'Login failed');
  }

  updateState({ token: result.token });

  const accountData = await getAccount(user);
  if (accountData.error) {
    return updateElement('loginError', accountData.error);
  }

  updateState({ account: accountData });
  navigate('/dashboard');
}

async function register() {
  const registerForm = document.getElementById('registerForm');
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData);
  const jsonData = JSON.stringify(data);

  const result = await createAccount(jsonData);

  if (result.error) {
    return updateElement('registerError', result.error);
  }

  // Simulate login after register
  const loginResult = await loginUser(JSON.stringify({ user: data.user, password: data.password }));
  if (loginResult.error || !loginResult.token) {
    return updateElement('registerError', loginResult.error || 'Auto login failed');
  }

  updateState({ token: loginResult.token, account: result });
  navigate('/dashboard');
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

async function updateAccountData() {
  const account = state.account;
  if (!account) return logout();

  const data = await getAccount(account.user);
  if (data.error) return logout();

  updateState({ account: data });
}

async function refresh() {
  await updateAccountData();
  updateDashboard();
}

function updateDashboard() {
  const account = state.account;
  if (!account) return logout();

  updateElement('description', account.description);
  updateElement('balance', account.balance.toFixed(2));
  updateElement('currency', account.currency);

  const transactionsRows = document.createDocumentFragment();
  for (const transaction of account.transactions) {
    const transactionRow = createTransactionRow(transaction);
    transactionsRows.appendChild(transactionRow);
  }
  updateElement('transactions', transactionsRows);
}

function createTransactionRow(transaction) {
  const template = document.getElementById('transaction');
  const row = template.content.cloneNode(true);
  const tr = row.querySelector('tr');
  tr.children[0].textContent = transaction.date;
  tr.children[1].textContent = transaction.object;
  tr.children[2].textContent = transaction.amount.toFixed(2);
  return row;
}

function addTransaction() {
  const dialog = document.getElementById('transactionDialog');
  dialog.classList.add('show');

  const form = document.getElementById('transactionForm');
  form.reset();
  form.date.valueAsDate = new Date();
}

async function confirmTransaction() {
  const dialog = document.getElementById('transactionDialog');
  dialog.classList.remove('show');

  const form = document.getElementById('transactionForm');
  const formData = new FormData(form);
  const jsonData = JSON.stringify(Object.fromEntries(formData));

  const data = await createTransaction(state.account.user, jsonData);
  if (data.error) {
    return updateElement('transactionError', data.error);
  }

  const updatedAccount = {
    ...state.account,
    balance: state.account.balance + data.amount,
    transactions: [...state.account.transactions, data]
  };

  updateState({ account: updatedAccount });
  updateDashboard();
}

function cancelTransaction() {
  const dialog = document.getElementById('transactionDialog');
  dialog.classList.remove('show');
}

function logout() {
  updateState({ account: null, token: null });
  navigate('/login');
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------

function updateElement(id, textOrNode) {
  const el = document.getElementById(id);
  el.textContent = '';
  el.append(textOrNode);
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

function init() {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const { account, token } = JSON.parse(saved);
    updateState({ account, token });
  }

  window.onpopstate = () => updateRoute();
  updateRoute();
}

init();
