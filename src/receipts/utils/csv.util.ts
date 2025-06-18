export function toCsv(rows: any[], fields: string[]): string {
  const escape = (val: any) =>
    typeof val === 'string'
      ? `"${val.replace(/"/g, '""')}"`
      : val == null
      ? ''
      : val;
  const header = fields.join(',');
  const data = rows
    .map(row => fields.map(f => escape(row[f])).join(','))
    .join('\n');
  return `${header}\n${data}`;
}
