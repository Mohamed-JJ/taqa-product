import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [process.env.FRONT_URL!],
      credentials: true,
      // allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    },
  });
  const config = new DocumentBuilder()
    .setTitle('TAQA anomaly detection api')
    .setDescription(
      'this is an api setup with machine learning for taqa maroc for anomaly detection'
    )
    .setVersion('1.0')
    .addTag('TAQA')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
