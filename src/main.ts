import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { ValidationException } from './exceptions/validation.exception';
import { AllExceptionsFilter } from './filters/all.filter';
import useSwaggerUIAuthStoragePlugin from './swagger_plugin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*'
    },
    bodyParser: false
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const formatErrors = (errorsToFromat: ValidationError[]) => {
          return errorsToFromat.reduce(
            (accumulator: Record<string, unknown>, error: ValidationError) => {
              let constraints: any;
              if (Array.isArray(error.children) && error.children.length) {
                constraints = formatErrors(error.children);
              } else {
                constraints =
                  (error.constraints &&
                    Object.values(error.constraints).join(', ')) ||
                  '';
              }
              return {
                ...accumulator,
                [error.property]: constraints,
              };
            },
            {},
          );
        };
        const messages = formatErrors(errors);

        return new ValidationException(messages);
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Bizness')
    .setDescription('API endpoints for Bizness App')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'all',
      plugins: [useSwaggerUIAuthStoragePlugin()],
    },
  });

  app.use(helmet());
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();


const configService = app.get(ConfigService);
  const server = await app.listen(+configService.get<string>('port'));

  server.setTimeout(1200000);
  
  console.log(`${process.env.MODE} app running on: ${await app.getUrl()}`);
}
bootstrap();
