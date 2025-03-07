export const ITEM_APIS = {
  CREATE_ITEM: 'item/create',
  DELETE_ITEM: (id: number) => `item/${id}/delete`,
  UPDATE_ITEM: (id: number) => `item/${id}/update`,
  GET_ITEM: (id: number) => `item/${id}`,
};
