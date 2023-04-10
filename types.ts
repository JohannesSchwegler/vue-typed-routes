type DeepReadonly<T extends Record<string, any>> = {
	readonly [Key in keyof T]: T[Key] extends Function
		? T[Key]
		: T extends Record<string, any>
		? DeepReadonly<T[Key]>
		: T[Key];
};
      
type RouteWithName = Omit<RouteRecordRaw, 'name'> & { name: RouteRecordName };

// Sets all attributes in RouteRecordRaw to readonly 
type ReadonlyRouteRecordRaw = DeepReadonly<RouteWithName>;

type ExtractRouteNames<T extends readonly ReadonlyRouteRecordRaw[], Acc extends string = ''> = T extends readonly [
	infer H extends ReadonlyRouteRecordRaw,
	...infer R extends ReadonlyRouteRecordRaw[]
]
	? H['children'] extends readonly ReadonlyRouteRecordRaw[]
		? ExtractRouteNames<R, Acc | ExtractRouteNames<H['children']>>
		: ExtractRouteNames<R, Acc | (H['name'] & string)>
	: Acc;


type ExtractRoutePaths<
	T extends readonly ReadonlyRouteRecordRaw[],
	Acc extends { [key: string]: string | ((...args: any[]) => any) } = {}
> = T extends readonly [infer H extends ReadonlyRouteRecordRaw, ...infer R extends ReadonlyRouteRecordRaw[]]
	? H['children'] extends readonly DeepReadonly<ReadonlyRouteRecordRaw>[] | undefined
		? ExtractRoutePaths<
				R,
				Acc & {
					[key in H['name']]: { ROOT: H['path'] } & ExtractRoutePaths<Exclude<H['children'], undefined>>;
				}
		  >
		: ExtractRoutePaths<R, Acc & { [key in H['name']]: H['path'] }>
	: Acc;


type ExtractRoutePathsWithParams<
	T extends readonly ReadonlyRouteRecordRaw[],
	Acc extends { [key: string]: string | ((...args: any[]) => any) } = {}
> = T extends readonly [infer H extends ReadonlyRouteRecordRaw, ...infer R extends ReadonlyRouteRecordRaw[]]
	? H['children'] extends readonly DeepReadonly<ReadonlyRouteRecordRaw>[] | undefined
		? ExtractRoutePathsWithParams<
				R,
				Acc & {
					[key in H['name'] as Uppercase<H['name'] & string>]: { ROOT: H['path'] } & ExtractRoutePathsWithParams<
						Exclude<H['children'], undefined>
					>;
				}
		  >
		: ExtractRoutePathsWithParams<R, Acc & RouteWithParams<H>>
	: Acc;
