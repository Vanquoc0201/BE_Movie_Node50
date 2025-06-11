import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from './Dto/pagination-user.dto';
import { AdduserDto } from './Dto/adduser-user.dto';
import { UpdateUserDto } from './Dto/update-user.dto';

@Controller('QuanLyNguoiDung')
export class UserController {
    constructor (private readonly userService : UserService){}



    @Get('LayDanhSachNguoiDung')
    @ApiBearerAuth('AccessToken')
    async getAllUser(){
        return await this.userService.getAllUser();
    }



    @Get('LayDanhSachNguoiDungPhanTrang')
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
    @ApiBearerAuth('AccessToken')
    async addUser(
        @Body()
        body : AdduserDto
    ){
        return this.userService.addUser(body)
    }



    @Delete('XoaNguoiDung')
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
    @ApiBearerAuth('AccessToken')
    async updateUser(
        @Body() body: UpdateUserDto
    ){
        return this.userService.updateUser(body)
    }


    @Get('LayThongTinNguoiDung')
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
    @ApiBearerAuth('AccessToken')
    async getAllUserType(){
        const allUserType = await this.userService.getAllUserType()
        return {
            message : 'Lấy danh sách loại người dùng thành công',
            ...allUserType,
        }
    }
}
