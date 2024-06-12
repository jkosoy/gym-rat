import { useContext } from "react";
import { DeviceContext } from "../contexts/DeviceContext";

export function useDevice() {
    return useContext(DeviceContext);
}