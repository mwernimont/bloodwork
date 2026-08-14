export function buildSetClause(body, allowedFields, startIndex = 1) {
  const fields = [];
  const values = [];
  let i = startIndex;

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      fields.push(`${field} = $${i++}`);
      values.push(body[field]);
    }
  }

  return { fields, values, nextIndex: i };
}
