const crypto = require("crypto");
const { User, getNextUserId } = require("./userService");

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || "local-dev-secret";
const TOKEN_EXPIRES_IN_MS = 24 * 60 * 60 * 1000;

function toBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value) {
  return crypto.createHmac("sha256", TOKEN_SECRET).update(value).digest("base64url");
}

async function findAccount(username, password) {
  const normalizedUsername = String(username || "").trim();
  if (!normalizedUsername || !password) {
    return null;
  }

  const user = await User.findOne({ username: normalizedUsername }).select("+password").lean();
  if (!user || !user.password || user.password !== password) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    fullName: user.username,
    role: user.role === "Admin" ? "admin" : "user",
  };
}

function mapAuthRoleToUserRole(authRole) {
  return authRole === "admin" ? "Admin" : "User";
}

async function registerAccount({ username, password, role }) {
  const normalizedUsername = String(username || "").trim();
  const normalizedRole = role === "admin" ? "admin" : "user";

  const existingUser = await User.findOne({ username: normalizedUsername }).lean();
  if (existingUser) {
    return { error: "username already exists." };
  }

  const nextId = await getNextUserId();
  const today = new Date();
  const dateRegistered = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`;

  const newUser = await User.create({
    id: nextId,
    username: normalizedUsername,
    dateRegistered,
    role: mapAuthRoleToUserRole(normalizedRole),
    status: "active",
    password: String(password || "").trim(),
  });

  return {
    data: {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    },
  };
}

function createToken(account) {
  const payload = {
    userId: account.id,
    sub: account.username,
    role: account.role,
    fullName: account.fullName,
    exp: Date.now() + TOKEN_EXPIRES_IN_MS,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = sign(encodedPayload);
  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));
    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

module.exports = {
  findAccount,
  registerAccount,
  createToken,
  verifyToken,
};
