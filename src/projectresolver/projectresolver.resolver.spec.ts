import { Test, TestingModule } from '@nestjs/testing';
import { ProjectresolverResolver } from './projectresolver.resolver.js';

describe('ProjectresolverResolver', () => {
  let resolver: ProjectresolverResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectresolverResolver],
    }).compile();

    resolver = module.get<ProjectresolverResolver>(ProjectresolverResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
