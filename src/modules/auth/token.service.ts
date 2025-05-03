import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ACCESS_TOKEN_EXPIRES, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES, REFRESH_TOKEN_SECRET } from "src/common/constant/app.constant";
@Injectable()
export class TokenService {
    constructor(private readonly jwtService : JwtService){}
    createToken(userId:number) {
        const accessToken = this.jwtService.sign({ userId: userId },  {
            expiresIn: ACCESS_TOKEN_EXPIRES,
            secret : ACCESS_TOKEN_SECRET
           });
       const refreshToken = this.jwtService.sign({ userId: userId },  {
           expiresIn:REFRESH_TOKEN_EXPIRES,
           secret: REFRESH_TOKEN_SECRET
        })
        return { accessToken, refreshToken };
    }
}