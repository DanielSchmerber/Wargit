import { Test, TestingModule } from '@nestjs/testing';
import { CommitresolverResolver } from './commitresolver.resolver.js';

describe('CommitresolverResolver', () => {
  let resolver: CommitresolverResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommitresolverResolver],
    }).compile();

    resolver = module.get<CommitresolverResolver>(CommitresolverResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
