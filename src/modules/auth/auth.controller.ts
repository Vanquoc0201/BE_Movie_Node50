import { Body, Controller , Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './Dto/register-auth.dto';
import { LoginDto } from './Dto/login-auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RefreshTokenDto } from './Dto/refreshtoken-auth.dto';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Public()
    @Post('DangKy')
    async register(
        @Body()
        body : RegisterDto
    ){
        return this.authService.register(body)
    }
    @Public()
    @Post('DangNhap')
    async login(
        @Body()
        body : LoginDto
    ){
        return this.authService.login(body)
    }
    @Get('LayThongTinNguoiDungDangNhap')
    @ApiBearerAuth('AccessToken')
    async getUserInfo(
        @Request()
        req: any
    ){
        return this.authService.getUserInfo(req.user)
    }
    @Public()
    @Post('RefreshToken')
    async refreshToken(
        @Body()
        body : RefreshTokenDto
    ){
        return this.authService.refreshToken(body)
    }
}
