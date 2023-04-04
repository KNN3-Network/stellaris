import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAddressList:any = create()(
  persist(
    (set, get) => ({
      addressList: [],
      setAddressList: (val: any) => {
        set({
          addressList: val,
        });
      },
      clearAddressList: () => {
        set({
          addressList: []
        });
      },
    }),
    {
      name: "addressStore",
    }
  )
);


export const loginAccountState:any = create()(
  persist(
    (set, get) => ({
      loginAccount: '',
      setLoginAccount: (val: any) => {
        set({
          loginAccount: val,
        });
      },
      clearAccount: () => {
        set({
          loginAccount: ''
        });
      },
    }),
    {
      name: "loginAccountStore",
    }
  )
);

export const starkProviderState:any = create()(
  persist(
    (set, get) => ({
      provider: '',
      setProvider: (val: any) => {
        set({
          provider: val,
        });
      },
      clearProvider: () => {
        set({
          loginProvider: ''
        });
      },
    }),
    {
      name: "provider",
    }
  )
);

export const conditionState:any = create()(
  persist(
    (set, get) => ({
      isCondition: false,
      setIsCondition: (val: any) => {
        set({
          isCondition: val,
        });
      }
    }),
    {
      name: "condition",
    }
  )
);
