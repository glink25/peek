import { defineComponent, h, nextTick } from "vue"
import { createProvider } from "../overlay"
import { Content } from "../utils/content"
import { keys } from "../utils/key";
import ConfirmProvider from "./ConfirmProvider.vue";


export type Selections<V = any> = (readonly string[]) | (readonly { label: string, value: V, entering?: () => Promise<any> }[])


export type ConfirmOption<V extends any = any, CustomSelections extends Selections<V> = string[]> = {
    customClass?: string;
    customContentClass?: string;
    selections?: CustomSelections;
    showClose?: boolean
    modalClose?: boolean
} & Content

export type ConfirmProps = ConfirmOption<any, any> & { onSelect: (selection: any) => void }

export type ConfirmVueProps = {
    customClass?: string;
    customContentClass?: string;
    selections?: any[];
    showClose?: boolean
    modalClose?: boolean
    onSelect: (selection: any) => void

}


export const UNSELECT_CLOSE = Symbol('UNSELECT_CLOSE')


export const useConfirmProvider = () => {
    const { bindings, push, remove } = createProvider<ConfirmOption>()

    const closeConfirm = (id: number, selection: any) => {
        const index = bindings.value.findIndex(c => c.key === id)
        if (index == -1) return
        nextTick(() => {
            remove(id)
        })
    }

    const showConfirm = <V extends any = any, CustomSelections extends Selections<V> = string[]>(option: ConfirmOption<V, CustomSelections>) => {

        return new Promise<CustomSelections[number] extends object ? CustomSelections[number]['value'] : CustomSelections[number]>((res, rej) => {
            const mergedOption: ConfirmProps = {
                ...{ selections: ['Cancel', 'Ok'] }, ...option, onSelect: (select) => {
                    if (select === UNSELECT_CLOSE) {
                        rej('confirm closed without selection')
                    }
                    else if (select !== undefined) {
                        res(select)
                    }
                    closeConfirm(cId, select)
                    return
                }
            }
            const cId = push(mergedOption as any)
        })
    }

    const provider = defineComponent({
        setup: (_, { slots }) => {
            return () => h(ConfirmProvider as any, { bindings: bindings.value }, { ...slots })
        }
    })

    return { provider, showConfirm }
}