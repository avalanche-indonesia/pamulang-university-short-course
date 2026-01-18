import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  //  aktifkan validation 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Event Simple Storage DApp API')
    .setDescription('The Simple Storage dApp Web3 API documentation With NestJS and Swagger')
    .setVersion('1.0')
    .addTag(' Author : Eldrick Arsy L. 251011401100')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('myswagger', app, documentFactory);

  const port = process.env.PORT || 3000;
await app.listen(port);


}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});