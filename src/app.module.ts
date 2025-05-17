import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ProjectresolverResolver } from './projectresolver/projectresolver.resolver.js';
import { UserResolver } from './userresolver/userResolver.js';
import { BranchresolverResolver } from './branchresolver/branchresolver.resolver.js';
import { CommitresolverResolver } from './commitresolver/commitresolver.resolver.js';
import { ProjectService } from './projectservice/project.service.js';
import { UserService } from './userservice/userservice.service.js';
import { SchematicRendererService } from './schematic-renderer/schematic-renderer.service.mjs';
import { FaweService } from './fawe/fawe.service.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module.js';
import { AuthResolver } from './auth/auth.resolver.js';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/static'
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ["./**/*.graphql"],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      playground: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    ProjectresolverResolver, 
    UserResolver, 
    BranchresolverResolver, 
    CommitresolverResolver, 
    ProjectService, 
    UserService, 
    SchematicRendererService, 
    FaweService,
    AuthResolver
  ],
})
export class AppModule {}
