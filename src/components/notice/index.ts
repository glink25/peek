// import NoticeProvider from "./NoticeProvider.vue";

// export default NoticeProvider

// export * from "./notice"
import { useNoticeProvider } from "../../lib"

export const { provider: NoticeProvider, showNotice } = useNoticeProvider()