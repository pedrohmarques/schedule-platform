import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /** O que sai daqui é exatamente o que o @CurrentUser() entrega. */
  validate(payload: JwtPayload): CurrentUserPayload {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      profileId: payload.profileId,
    };
  }
}
