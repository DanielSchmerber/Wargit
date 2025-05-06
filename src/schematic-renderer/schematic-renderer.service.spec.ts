import { Test, TestingModule } from '@nestjs/testing';
import { SchematicRendererService } from './schematic-renderer.service.mjs';

describe('SchematicRendererService', () => {
  let service: SchematicRendererService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchematicRendererService],
    }).compile();

    service = module.get<SchematicRendererService>(SchematicRendererService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
