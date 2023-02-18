// import ConfirmProvider from "./ConfirmProvider.vue"

// export default ConfirmProvider;
// export * from "./confirm"

import { useConfirmProvider } from "../../lib"

export const { provider: ConfirmProvider, showConfirm } = useConfirmProvider()