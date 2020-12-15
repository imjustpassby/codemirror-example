import { Button, Tabs, Tooltip, Modal, message, Input } from 'ant-design-vue'
import Vue from 'vue'

Vue.use(Button)
Vue.use(Tabs)
Vue.use(Tooltip)
Vue.use(Modal)
Vue.use(Input)

Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$message = message
