import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException} from '@nestjs/common';
import { ACCESS_TOKEN_SECRET } from 'src/common/constant/app.constant';
import { PrismaService } from 'src/modules/prisma/prisma.service';


@Injectable()
export class ProtectStrategy extends PassportStrategy(Strategy, 'protect') {
  constructor(private readonly prismaService : PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ACCESS_TOKEN_SECRET || 'KHÔNG LẤY ĐƯỢC TOKEN Ở ENV',
    });
  }

  async validate(payload: any) {
    const user = await this.prismaService.users.findUnique({
        where: {
           userId: payload.userId,
        },
     });
     if (!user) {
        throw new UnauthorizedException(`Không tìm thấy user`);
    }
    return user;
    ;
  }
}
