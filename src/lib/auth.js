import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "attendee",
            },
            isBlocked: {
                type: "boolean",
                required: false,
                defaultValue: false,
            },
            isPremium: {
                type: "boolean",
                required: false,
                defaultValue: false,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    return {
                        data: {
                            ...user,
                            role: user.role || "attendee",
                            isBlocked: user.isBlocked ?? false,
                            isPremium: user.isPremium ?? false,
                        },
                    };
                },
            },
        },
    },
});