import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs'; // ⬅️ TAMBAH INI

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Event Simple Storage DApp API')
    .setDescription('The Simple Storage dApp Web3 API documentation')
    .setVersion('1.0')
    .addTag('Author : Eldrick Arsy Listyannika 251011401100')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ⬇️ NARUH DI SINI (INI PENTING)
  writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('myswagger', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on port ${port}`);
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
