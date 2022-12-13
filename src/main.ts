import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await await NestFactory.create(AppModule);

  app.enableCors({
    methods: ['OPTION', 'GET', 'POST', 'PUT', 'DELETE'],
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Blog')
    .setDescription('The blog API description')
    .setVersion('1.0')
    .addTag('blog')
    .addBearerAuth(
      {
        type: 'http',
        schema: 'Bearer',
        bearerFormat: 'Token',
      } as SecuritySchemeObject,
      'Bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
