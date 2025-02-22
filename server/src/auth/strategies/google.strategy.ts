// auth/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { GoogleConfig } from 'config/google.config';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      ...GoogleConfig,
      passReqToCallback: true, // Enable passing the request
    });
    
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = {
      email: profile.emails[0].value,
      name: `${profile.name.givenName} ${profile.name.familyName}`,
      profile_picture: profile.photos[0].value,
    };
    const created_user = await this.authService.validateUserWithGoogle(req , user);
    done(null, created_user);
  }
}
