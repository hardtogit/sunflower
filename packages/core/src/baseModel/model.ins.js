import Model from ".";

export const bmodel = new  Model({
   reducers: {
     goPageV2(state, {payload}){
        const {current, name} = payload;
        if(name){
          if(state[name] && state[name].pagination){
            const pagination = state[name].pagination;
            pagination.current = current;
            return {
              ...state,
              [name]: {... state[name]}
            };
          }
        }
        return {...state, pagination: { ...state.pagination, current}};
     },
     successPage(state, {payload}){
      const {list, name, tc} = payload;
      if(name && state[name]){
         const nobj = state[name];
         const obj = {
           ...nobj,
           pagination: {...nobj.pagination, total: tc},
           list
         };
         return {
           ...state,
           [name]: {...obj}
         };
      }
      return {
        ...state,
        pagination: {...state.pagination, total: tc},
        list
      };
     }
   }
});
