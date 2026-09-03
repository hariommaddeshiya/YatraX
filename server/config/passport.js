import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/Schemas.js';
import { isMongoConnected, localStore } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'yatrx-super-secret-sih-2026-jwt-key-998877';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

export const configurePassport = (passportInstance) => {
  passportInstance.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        if (isMongoConnected) {
          const user = await User.findById(jwt_payload.id).select('-password');
          if (user) {
            return done(null, user);
          }
        }
        
        // In-memory fallback lookup
        const memUser = (localStore.users || []).find(u => u.id === jwt_payload.id || u._id === jwt_payload.id);
        if (memUser) {
          const sanitized = { ...memUser };
          delete sanitized.password;
          return done(null, sanitized);
        }

        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
