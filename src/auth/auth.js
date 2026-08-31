const USERS_KEY = "catly_users";
const SESSION_KEY = "catly_current_user";

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
}

export function signup(userId, password) {
  const users = getUsers();

  const id = userId.trim().toUpperCase();

  if (!id || !password) {
    return {
      success: false,
      message: "Please enter your CAT User ID and password.",
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters.",
    };
  }

  if (users[id]) {
    return {
      success: false,
      message: "This CAT User ID is already registered.",
    };
  }

  users[id] = {
    userId: id,
    targetPercentile: 95,
    mocksAttempted: 0,
    bestMock: 0,
    preparationProgress: 0,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Store password separately for this prototype.
  // In production this MUST be replaced by proper backend authentication.
  localStorage.setItem(`catly_password_${id}`, password);

  localStorage.setItem(SESSION_KEY, JSON.stringify(users[id]));

  return {
    success: true,
    user: users[id],
  };
}

export function login(userId, password) {
  const users = getUsers();
  const id = userId.trim().toUpperCase();

  if (!users[id]) {
    return {
      success: false,
      message: "CAT User ID not found.",
    };
  }

  const savedPassword = localStorage.getItem(`catly_password_${id}`);

  if (savedPassword !== password) {
    return {
      success: false,
      message: "Incorrect password.",
    };
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(users[id]));

  return {
    success: true,
    user: users[id],
  };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  const user = localStorage.getItem(SESSION_KEY);

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}