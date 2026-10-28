import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function findAdminUser(db, username, password) {
  const collectionNames = ["admin", "admins"];
  const matches = [];

  for (const name of collectionNames) {
    const adminUser = await db.collection(name).findOne({ username });
    if (adminUser) matches.push(adminUser);
  }

  if (!matches.length) return null;

  const exactMatch = matches.find((item) => item.password === password);
  return exactMatch || matches[0];
}

async function ensureDefaultAdmin(db) {
  const targetCollection = (await db.listCollections({ name: "admins" }).hasNext())
    ? "admins"
    : "admin";

  const adminCollection = db.collection(targetCollection);
  const existingAdmin = await adminCollection.findOne({ username: DEFAULT_ADMIN_USERNAME });

  if (!existingAdmin) {
    await adminCollection.updateOne(
      { username: DEFAULT_ADMIN_USERNAME },
      {
        $setOnInsert: {
          username: DEFAULT_ADMIN_USERNAME,
          password: DEFAULT_ADMIN_PASSWORD,
          role: "superadmin",
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  return adminCollection.findOne({ username: DEFAULT_ADMIN_USERNAME });
}

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const trimmedUsername = String(username).trim();
    const adminUser = await findAdminUser(db, trimmedUsername, String(password));

    if (!adminUser) {
      const fallbackAdmin = await ensureDefaultAdmin(db);
      const isDefaultCredentials =
        trimmedUsername === DEFAULT_ADMIN_USERNAME && String(password) === DEFAULT_ADMIN_PASSWORD;

      if (!isDefaultCredentials || !fallbackAdmin) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials (User not found)" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Secure login successful",
          user: { username: fallbackAdmin.username, role: fallbackAdmin.role || "superadmin" },
        },
        { status: 200 }
      );
    }

    if (adminUser.password !== String(password)) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials (Wrong password)" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Secure login successful",
        user: { username: adminUser.username, role: adminUser.role || "superadmin" },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}