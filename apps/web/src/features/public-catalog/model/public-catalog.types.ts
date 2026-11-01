export type PublicListOptions<TQuery, TData> = Readonly<{
  enabled?: boolean;
  seed?: Readonly<{ query: TQuery; data: TData }>;
}>;
