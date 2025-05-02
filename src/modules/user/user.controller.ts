import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from './Dto/pagination-user.dto';
import { AdduserDto } from './Dto/adduser-user.dto';

@Controller('QuanLyNguoiDung')
export class UserController {
    constructor (private readonly userService : UserService){}



    @Get('LayDanhSachNguoiDung')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('AccessToken')
    async getAllUser(){
        const allUser = await this.userService.getAllUser()
        return {
            message : 'Lấy danh sách người dùng thành công',
            ...allUser,
        }
    }



    @Get('LayDanhSachNguoiDungPhanTrang')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('AccessToken')
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Nếu không truyền thì mặc định là 1',
        example: '1',
      })
      @ApiQuery({
        name: 'pageSize',
        required: false,
        description: 'Nếu không truyền thì mặc định là 3',
        example: '3',
      })
      @ApiQuery({
        name: 'search',
        required: false,
        description: 'Từ khóa tìm kiếm',
        example: 'quoc',
      })
    async getAllUserPagination(
        @Query('page') page: string ,
        @Query('pageSize') pageSize: string,
        @Query('search') search: string
      ) {
        const paginationDto: PaginationDto = {
          page,
          pageSize,
          search,
        };
        return this.userService.getAllUserPagination(paginationDto);
    }



    @Get('TimKiemNguoiDung')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('AccessToken')
    @ApiQuery({
        name: 'taiKhoan',
        required: true,
        description: 'Tài khoản cần tìm kiếm',
        example: 'quoc',
    })
    async searchUser (
        @Query('taiKhoan') taiKhoan:string
    ){
        return this.userService.searchUser(taiKhoan)
    }



    @Post('ThemNguoiDung')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('AccessToken')
    async addUser(
        @Body()
        body : AdduserDto
    ){
        return this.userService.addUser(body)
    }



    @Delete('XoaNguoiDung')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('AccessToken')
    @ApiQuery({
        name: 'taiKhoan',
        required: true,
        description: 'Tài khoản cần xóa',
        example: 'nguyenvana123',
    })
    async deleteUser(
        @Query('taiKhoan') taiKhoan:string
    ){
        return this.userService.deleteUser(taiKhoan)
    }



    @Put('CapNhatThongTinNguoiDung')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('AccessToken')
    async updateUser(
        @Body() body: AdduserDto
    ){
        return this.userService.updateUser(body)
    }


    @Get('LayThongTinNguoiDung')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('AccessToken')
    @ApiQuery({
        name: 'taiKhoan',
        required: true,
        description: 'Tài khoản cần lấy thông tin',
        example: 'nguyenvanb'
    })
    async getUserInfo(
        @Query('taiKhoan') taiKhoan: string
    ){
        return this.userService.getUserInfo(taiKhoan)
    }


    @Get('LayDanhSachLoaiNguoiDung')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('AccessToken')
    async getAllUserType(){
        const allUserType = await this.userService.getAllUserType()
        return {
            message : 'Lấy danh sách loại người dùng thành công',
            ...allUserType,
        }
    }
}
