import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Event Simple Storage DApp API')
    .setDescription('The Simple Storage dApp Web3 API documentation')
    .setVersion('1.0')
    .addTag('Author : Eldrick Arsy Listyannika  251011401100')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('myswagger', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
