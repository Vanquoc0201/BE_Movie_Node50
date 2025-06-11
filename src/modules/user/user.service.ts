import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './Dto/pagination-user.dto';
import { AdduserDto } from './Dto/adduser-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './Dto/update-user.dto';
@Injectable()
export class UserService {
    constructor(private readonly prismaService : PrismaService) {}
    async getAllUser(){
        const users = await this.prismaService.users.findMany();
        return {
            status: 'success',
            message: 'Lấy danh sách người dùng thành công',
            data: users,
        };
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
        return {
            status: 'success',
            message: `Lấy danh sách người dùng với tài khoản ${taiKhoan} thành công`,
            data: user,
        };
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
    async deleteUser(taiKhoan: string){
        const user = await this.prismaService.users.findUnique({
            where: { taiKhoan },
        });
        if (!user) {
            throw new BadRequestException('Tài khoản không tồn tại');
        }
        await this.prismaService.users.delete({
            where: { taiKhoan },
        });
        return {
            message: 'Xóa người dùng thành công',
            ...user,
        };
    }
    async updateUser(body: UpdateUserDto) {
        const { taiKhoan, hoTen, email, soDt, loaiNguoiDung } = body;
        const existingUser = await this.prismaService.users.findUnique({
            where: { taiKhoan },
        });
        if (!existingUser) {
            throw new BadRequestException('Tài khoản không tồn tại');
        }
        const dataToUpdate: any = {
            ...(hoTen && { hoTen }),
            ...(email && { email }),
            ...(soDt && { soDt }),
            ...(loaiNguoiDung && { loaiNguoiDung }),
        };
        const updatedUser = await this.prismaService.users.update({
            where: { taiKhoan },
            data: dataToUpdate,
        });
        return {
            message: 'Cập nhật người dùng thành công',
            ...updatedUser,
        };
    }

    async getUserInfo(taiKhoan: string) {
        const user = await this.prismaService.users.findUnique({
            where: { taiKhoan },
        });
        if (!user) {
            throw new BadRequestException('Tài khoản không tồn tại');
        }
        return {
            message: 'Lấy thông tin người dùng thành công',
            ...user,
        };
    }
    async getAllUserType() {
        const userTypes = await this.prismaService.users.findMany({
            where: {
                loaiNguoiDung: {
                    not: null, // Lọc ra loại người dùng không null
                },
            },
            distinct: ['loaiNguoiDung'], // Loại bỏ các loại người dùng trùng lặp
            select: {
                loaiNguoiDung: true, // Chỉ lấy trường loaiNguoiDung ẩn các field khác
            },
        });
        if (!userTypes.length) {
            throw new BadRequestException('Không tìm thấy loại người dùng nào');
        }
        return userTypes.map((item) => item.loaiNguoiDung); 
    }
    

    
}
