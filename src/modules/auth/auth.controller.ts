import { Body, Controller , Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './Dto/register-auth.dto';
import { LoginDto } from './Dto/login-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RefreshTokenDto } from './Dto/refreshtoken-auth.dto';

@Controller('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('DangKy')
    async register(
        @Body()
        body : RegisterDto
    ){
        return this.authService.register(body)
    }
    @Post('DangNhap')
    async login(
        @Body()
        body : LoginDto
    ){
        return this.authService.login(body)
    }
    @Get('LayThongTinNguoiDungDangNhap')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('AccessToken')
    async getUserInfo(
        @Request()
        req: any
    ){
        return this.authService.getUserInfo(req.user)
    }
    @Post('RefreshToken')
    async refreshToken(
        @Body()
        body : RefreshTokenDto
    ){
        return this.authService.refreshToken(body)
    }
}
