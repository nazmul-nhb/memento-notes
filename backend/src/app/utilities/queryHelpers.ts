import type { Document, Model, Query } from 'mongoose';
import { normalizeNumber } from 'nhb-toolbox';
import type { Maybe } from 'nhb-toolbox/types';

/** Get the pagination metadata for a query.  */
export async function getQueryMeta(
	model: Model<Document>,
	modelQuery: Query<Document[], Document>,
	query: Maybe<Record<string, unknown>>
) {
	const total = await model.countDocuments(modelQuery.getFilter());

	const limit = normalizeNumber(query?.limit) ?? 10;
	const page = normalizeNumber(query?.page) ?? 1;

	const totalPages = Math.ceil(total / limit);

	return {
		page,
		limit,
		total,
		totalPages,
		...(page > 1 && { prevPage: page - 1 }),
		...(page < totalPages && { nextPage: page + 1 }),
	};
}
