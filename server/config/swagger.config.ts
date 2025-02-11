import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const SetupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Lock Sphere')
    .setDescription(`
      API Documentation for lock sphere app:
    `)
    .setVersion('1.0')
    // JWT Auth configuration
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    // Session Auth configuration
    .addCookieAuth(
      'session_id',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'session_id',
        description: 'Session cookie authentication',
      },
      'session-auth'
    )
    // API sections
    .addTag('Auth', 'Authentication endpoints (JWT and Session)')
    .addTag('Users', 'User management endpoints')
    .addTag('Public', 'Public endpoints - no auth required')
    .addServer('http://localhost:3000', 'Local environment')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Add security requirements globally
  document.security = [
    {
      'JWT-auth': [],
      'session-auth': [],
    },
  ];

  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
      tagsSorter: 'alpha',
    },
    customSiteTitle: 'Lock Sphere Api docs',
  };

  SwaggerModule.setup('api/docs', app, document, customOptions);
};