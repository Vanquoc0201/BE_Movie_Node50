import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_SECRET } from 'src/common/constant/app.constant';
import { PrismaService } from 'src/modules/prisma/prisma.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService : PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ACCESS_TOKEN_SECRET as string,
    });
  }

  async validate(payload: any) {
    const user = await this.prismaService.users.findUnique({
      where : { userId : payload.userId },
    })
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy người dùng.');
    }
    const { matKhau, ...userWithoutPassword } = user; 
    return userWithoutPassword; 
  }
}