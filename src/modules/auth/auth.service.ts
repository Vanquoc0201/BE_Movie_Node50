import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './Dto/register-auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginDto } from './Dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import * as jwt from 'jsonwebtoken';
import { RefreshTokenDto } from './Dto/refreshtoken-auth.dto';
import { ACCESS_TOKEN_SECRET , REFRESH_TOKEN_SECRET } from 'src/common/constant/app.constant';
@Injectable()
export class AuthService {
    constructor(private readonly prismaService : PrismaService , private readonly tokenService : TokenService){}
    async register(body: RegisterDto) {
      try {
        const userExists = await this.prismaService.users.findUnique({
          where: {
            taiKhoan: body.taiKhoan,
          },
        });
    
        if (userExists) throw new BadRequestException('Tài khoản đã tồn tại vui lòng đăng nhập');
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.matKhau, salt);
        const userNew = await this.prismaService.users.create({
          data: {
            ...body,
            matKhau : hashedPassword,
            loaiNguoiDung : 'KhachHang',
          }
        });
        const { matKhau, ...userWithoutPassword } = userNew;
        return {
          message: 'Đăng ký thành công',
          ...userWithoutPassword,
        };
      } catch (error) {
        console.error('Đăng ký lỗi:', error); // Giữ lại để debug

  if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
    throw new ConflictException('Email đã tồn tại!');
  }

  // Nếu đã là một HttpException (như BadRequestException), thì throw lại luôn
  if (error instanceof HttpException) {
    throw error;
  }

  throw new InternalServerErrorException('Lỗi máy chủ, vui lòng thử lại sau');
      }
    }
    
    async login(body: LoginDto) {
      const userExists = await this.prismaService.users.findUnique({
        where: {
          taiKhoan: body.taiKhoan,
        },
      });
      if (!userExists) {
        throw new BadRequestException('Tài khoản chưa được đăng ký vui lòng đăng ký');
      }
      if (!userExists.matKhau) {
        throw new BadRequestException('Mật khẩu không hợp lệ');
      }
      const isPassword = await bcrypt.compare(body.matKhau, userExists.matKhau);
      if (!isPassword) {
        throw new BadRequestException('Mật khẩu không chính xác');
      }
      const tokens = this.tokenService.createToken(userExists.userId);
      return { ...tokens, user: userExists };
    }
    async getUserInfo(user: any) {
      return user;
    }
    async refreshToken(body : RefreshTokenDto) {
      const { accessToken, refreshToken } = body;
    if (!accessToken) {
      throw new UnauthorizedException('Không có access token');
    }
    if (!refreshToken) {
      throw new UnauthorizedException('Không có refresh token');
    }
    let decodeAccessToken;
    let decodeRefreshToken;
    try {
      decodeAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET as string, { ignoreExpiration: true });
    } catch (error) {
      throw new UnauthorizedException('Access token không hợp lệ');
    }
    try {
      decodeRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string);
    } catch (error) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    if (decodeRefreshToken.userId !== decodeAccessToken.userId) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    const tokens = this.tokenService.createToken(decodeRefreshToken.userId);
    return {  message :'Làm mới token thành công', ...tokens };
    }
    
}
