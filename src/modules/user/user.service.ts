import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './Dto/pagination-user.dto';
import { AdduserDto } from './Dto/adduser-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
    constructor(private readonly prismaService : PrismaService) {}
    async getAllUser(){
        return await this.prismaService.users.findMany();
    }
    async getAllUserPagination(paginationDto: PaginationDto) {
        let { page, pageSize , search } = paginationDto;
        page = +page > 0 ? +page : 1;
        pageSize = +pageSize > 0 ? +pageSize : 3;
        search = search || ``;
        const skip = (page - 1) * pageSize;
        const where = { taiKhoan: { contains: search } };
        const users = await this.prismaService.users.findMany({
            skip: skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            where: where,
        });
        if(!users.length){
            throw new BadRequestException('Không tìm thấy người dùng nào');
        }
        const totalItem = await this.prismaService.users.count({
            where: where,
          });
        const totalPage = Math.ceil(totalItem / pageSize);
        return {
            page: page,
            pageSize: pageSize,
            totalItem: totalItem,
            totalPage: totalPage,
            items: users || [],
        };
    }
    async searchUser(taiKhoan: string) {
        const where = { taiKhoan: { contains: taiKhoan } };
        const user = await this.prismaService.users.findMany({
            where: where
        });
        if (!user.length) {
            throw new BadRequestException('Không tìm thấy người dùng nào');
        }
        return user;
    }
    async addUser(body : AdduserDto){
        const { taiKhoan, matKhau, hoTen, email, soDt, loaiNguoiDung } = body;
        const hashedPassword = await bcrypt.hash(matKhau, 10);
        const existingUser = await this.prismaService.users.findUnique({
            where: { taiKhoan },
        });
        const existingEmail = await this.prismaService.users.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new BadRequestException('Tài khoản đã tồn tại');
        }
        if (existingEmail) {
            throw new BadRequestException('Email đã tồn tại');
        }
        const newUser = await this.prismaService.users.create({
            data: {
                taiKhoan,
                matKhau: hashedPassword,
                hoTen,
                email,
                soDt,
                loaiNguoiDung,
            },
        })
        const { matKhau: _ , ...userWithoutPassword } = newUser;
        return {
            message: 'Thêm người dùng thành công',
            ...userWithoutPassword,
        }
    }
}
