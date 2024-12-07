import { users } from '@/drizzle/schema';
import type {User as DefaultUser} from 'next-auth';
import type {JWT as DefaultJWT} from 'next-auth/jwt';


declare module "next-auth" {
    interface User extends DefaultUser {
        role: (typeof users.$inferSelect)['role'];
        company: (typeof users.$inferSelect)['company'];
        phone: (typeof users.$inferSelect)['phone'];
        emailVerified: (typeof users.$inferSelect)['emailVerified'];
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: (typeof users.$inferSelect)['id'];
        role: (typeof users.$inferSelect)['role'];
        company: (typeof users.$inferSelect)['company'];
        phone: (typeof users.$inferSelect)['phone'];
        emailVerified: (typeof users.$inferSelect)['emailVerified'];
       
    }
}