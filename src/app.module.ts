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
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ["./**/*.graphql"],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      playground: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ProjectresolverResolver, UserResolver, BranchresolverResolver, CommitresolverResolver, ProjectService, UserService, SchematicRendererService],
})
export class AppModule {}
