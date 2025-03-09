export const FISCAL_YEAR_APIS = {
  CREATE_FISCAL_YEAR: 'year/create',
  DELETE_FISCAL_YEAR: (id: number) => `year/${id}/delete`,
  UPDATE_FISCAL_YEAR: (id: number) => `year/${id}/update`,
  GET_FISCAL_YEAR: (id: number) => `year/${id}`,
};
