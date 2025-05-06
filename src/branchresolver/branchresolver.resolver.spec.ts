import { Test, TestingModule } from '@nestjs/testing';
import { BranchresolverResolver } from './branchresolver.resolver.js';

describe('BranchresolverResolver', () => {
  let resolver: BranchresolverResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BranchresolverResolver],
    }).compile();

    resolver = module.get<BranchresolverResolver>(BranchresolverResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
