import { createContext, PropsWithChildren, useCallback, useState } from "react";

type DeviceContextProps = {
    isTV: boolean
}

export const DeviceContext = createContext<DeviceContextProps>({} as DeviceContextProps)

export function DeviceProvider({isTV, children}: PropsWithChildren<DeviceContextProps>) {
    return (
        <DeviceContext.Provider value={{
            isTV,
        }}>
            {children}
        </DeviceContext.Provider>
    )
}