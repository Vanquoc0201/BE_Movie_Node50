import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './common/constant/app.constant';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ProtectGuard } from './modules/auth/protect/protect.guard';
import { ResponseSuccessInterceptor } from './common/interceptor/response-success.interceptor';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ những field không có trong dto
      forbidNonWhitelisted: true, // Nếu trong dto không khai báo thì sẽ bắn lỗi => throw error
    }),
  ); // bật validation global
  const reflector = app.get(Reflector)
  app.useGlobalGuards( new ProtectGuard(reflector))
  app.useGlobalInterceptors( new LoggingInterceptor())
  app.useGlobalInterceptors( new ResponseSuccessInterceptor())
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'AccessToken',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory, {
    swaggerOptions: { persistAuthorization: true },
  });
  await app.listen(PORT ?? 3000);
}
bootstrap();
