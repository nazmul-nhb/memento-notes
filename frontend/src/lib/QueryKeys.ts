import type { IPaginationParams } from '@/types';

export class QueryKeys<Key extends string> {
	public readonly all: Readonly<[Key]>;

	constructor(key: Key) {
		this.all = [key];
	}

	get lists() {
		return [...this.all, 'list'] as const;
	}

	list(params?: IPaginationParams) {
		return [...this.lists, params] as const;
	}
}
