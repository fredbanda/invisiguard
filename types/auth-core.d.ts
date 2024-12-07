import type {AdapterUser as DefaultAdapterUser} from 'next-auth/core/adapters';
import {users} from '@/drizzle/schema';

declare module 'next-auth/core/adapters' {
    export interface AdapterUser extends DefaultAdapterUser {
        role: (typeof users.$inferSelect)['role'];
        company: (typeof users.$inferSelect)['company'];
        phone: (typeof users.$inferSelect)['phone'];
        emailVerified: (typeof users.$inferSelect)['emailVerified'];
    }
}