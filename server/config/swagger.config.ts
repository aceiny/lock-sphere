import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const SetupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Lock Sphere API')
    .setDescription('API Documentation for Lock Sphere')
    .setVersion('1.0')
    .addCookieAuth(
      'sessionId',
      {
        type: 'apiKey',
        in: 'cookie',
        description: 'Session cookie authentication',
      },
      'session-auth'
    )
    .addServer('http://localhost:3000', 'Local environment')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

  // Apply security globally
  document.security = [{'session-auth': [] }];

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
      tagsSorter: 'alpha',
    },
    customSiteTitle: 'Lock Sphere API Docs',
  });
};
