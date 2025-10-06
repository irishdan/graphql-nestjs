import { DtoInterface } from '~/common/dto/dto.interface';

export interface CacheHandlerInterface {
  get<T extends DtoInterface>(key: string, transformer?: (data: object) => T): Promise<T | null>;
  set(dto: DtoInterface, ttl?: number): Promise<void>;
}
