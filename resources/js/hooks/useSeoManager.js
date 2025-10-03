import { useEffect } from "react"
import { useSeoStore } from "@/Store/useSeoStore"

export const useSeoManager = (seo) => {
    const setSeo = useSeoStore(state => state.setSeo)

    useEffect(() => {
        if (seo) {
            setSeo(seo)
        }
    }, [seo, setSeo])
}
