export interface IFilter {
  /* Column name */
  column?: string;

  /* Operators */
  or?: IFilter[];
  and?: IFilter[];
  eq?: string;
  ne?: string;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;

  /* Regex & Search */
  regex?: string;
  regexOptions?: string;
  search?: string;
}
