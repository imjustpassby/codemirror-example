<template>
  <div>
        <code-mirror v-model="code" :options="cmOptions" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
// 引入主题后还需要在 options 中指定主题才会生效
import 'codemirror/theme/panda-syntax.css'
// 语法高亮
import 'codemirror/mode/sql/sql.js'
// 代码提示,补全
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/sql-hint.js'
const defaultCode = '-- 左ctrl键开启代码提示补全功能\nSELECT * FROM tableA\n'
export default {
  name: 'CodeMirror',
  props: [''],
  data() {
    return {
      code: defaultCode,
      mode: { name: 'MySQL', mime: 'text/x-mysql', mode: 'sql' },
      // 默认配置
      cmOptions: {
        // 缩进格式
        tabSize: 4,
        // 主题，对应主题库 JS 需要提前引入
        theme: 'panda-syntax',
        // 显示行号
        lineNumbers: true,
        line: true,
        extraKeys: { Ctrl: 'autocomplete' }
      }
    }
  },

  components: {
    codeMirror: codemirror
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {}
}
</script>
//
<style lang="less">
// .ant-tabs-nav-container {
//   background-color: #292a2b;
//   color: #fff;
// }

// .ant-tabs-bar {
//   margin: 0;
// }

// .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
//   color: #ffb86c !important;
//   border-bottom: 1px solid #fff;
// }

// .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
//   background-color: #292a2b;
//   border: none;
// }

// .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab .ant-tabs-close-x {
//   color: #fff;
// }

// .ant-tabs-extra-content {
//   background-color: #292a2b;
//   & .ant-tabs-new-tab {
//     color: #fff;
//     margin-right: 10px;
//   }
// }
//
</style>
