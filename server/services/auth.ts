import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { storage } from '../storage';
import { sendWelcomeEmail, sendVerificationEmail } from './email';
import type { InsertUserAccount, UserAccount } from '@shared/schema';

export interface AuthService {
  register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<{ user: UserAccount; requiresVerification: boolean }>;
  
  login(email: string, password: string): Promise<{ user: UserAccount; token: string } | null>;
  verifyEmail(token: string): Promise<UserAccount | null>;
  resendVerification(email: string): Promise<boolean>;
  forgotPassword(email: string): Promise<boolean>;
  resetPassword(token: string, newPassword: string): Promise<UserAccount | null>;
}

class DatabaseAuthService implements AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;
  private readonly JWT_EXPIRES_IN = '7d';

  constructor() {
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required for security');
    }
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<{ user: UserAccount; requiresVerification: boolean }> {
    // Check if user already exists
    const existingUser = await storage.getUserAccountByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user account
    const newUserData: InsertUserAccount = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || null,
      passwordHash,
      emailVerificationToken,
      emailVerificationExpires,
      emailVerified: false,
    };

    const user = await storage.createUserAccount(newUserData);

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.firstName, emailVerificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail registration if email fails
    }

    return { 
      user, 
      requiresVerification: true 
    };
  }

  async login(email: string, password: string): Promise<{ user: UserAccount; token: string } | null> {
    const user = await storage.getUserAccountByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.JWT_SECRET!,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    return { user, token };
  }

  async verifyEmail(token: string): Promise<UserAccount | null> {
    const user = await storage.verifyUserEmail(token);
    if (user) {
      // Send welcome email after successful verification
      try {
        await sendWelcomeEmail(user.email, user.firstName);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't fail verification if welcome email fails
      }
    }
    return user;
  }

  async resendVerification(email: string): Promise<boolean> {
    const user = await storage.getUserAccountByEmail(email);
    if (!user || user.emailVerified) {
      return false;
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await storage.updateUserAccount(user.id, {
      emailVerificationToken,
      emailVerificationExpires,
    });

    try {
      await sendVerificationEmail(user.email, user.firstName, emailVerificationToken);
      return true;
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      return false;
    }
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await storage.getUserAccountByEmail(email);
    if (!user) {
      return false; // Don't reveal if email exists
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await storage.setPasswordResetToken(email, resetToken, resetExpires);

    // TODO: Send password reset email
    // await sendPasswordResetEmail(user.email, user.firstName, resetToken);

    return true;
  }

  async resetPassword(token: string, newPassword: string): Promise<UserAccount | null> {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    return await storage.resetPassword(token, passwordHash);
  }

  verifyToken(token: string): { userId: number; email: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET!) as any;
      return { userId: decoded.userId, email: decoded.email };
    } catch (error) {
      return null;
    }
  }
}

export const authService = new DatabaseAuthService();