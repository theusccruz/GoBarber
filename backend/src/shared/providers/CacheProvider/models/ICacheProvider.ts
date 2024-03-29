export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  invalidate(key: string): Promise<void>;
  recover<T>(key: string): Promise<T | null>; // T argumento de tipo
  invalidatePrefix(prefix: string): Promise<void>;
}
