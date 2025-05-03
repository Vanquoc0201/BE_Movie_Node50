
import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';

@Injectable()
export class ProtectGuard extends AuthGuard('protect') {
    constructor(private reflector: Reflector) {
        super();
      }
      canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) {
          return true;
        }
        return super.canActivate(context);
      }
      handleRequest(err: any, user:any, info:any) {
        
        
        if (err || !user) {
            if(info instanceof TokenExpiredError){
                throw new ForbiddenException(info.message) // 403 để FE refreshToken
            }
            if(info instanceof JsonWebTokenError){
                throw new UnauthorizedException(info.message) // 401 để FE kick người dùng 
            }
          throw err || new UnauthorizedException();
        }
        return user;
      }
}
