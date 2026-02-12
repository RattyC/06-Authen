// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

type JwtPayload = { sub: string; email: string; role?: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_ACCESS_SECRET') || '',
        });
    }

    async validate(payload: any) {
    
        console.log(' Token แกะออกมาได้ payload:', payload);

        if (!payload) {
            console.log(' Payload is missing');
            return null; 
        }

        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}
