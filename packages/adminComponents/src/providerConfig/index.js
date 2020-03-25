import React from 'react';
import { ConfigProvider } from 'antd';

export const ContainerContext = React.createContext('');
export default (props) => {
  return (
    <ContainerContext.Provider value={props.getPopupContainer}>
      <ConfigProvider {...props}>
        {props.children}
      </ConfigProvider>
    </ContainerContext.Provider>
  );
};
