<template>
  <a-tabs
    v-model="activeKey"
    type="editable-card"
    @edit="onEdit"
    @change="changeTab"
  >
    <a-tab-pane
      v-for="pane in panes"
      :key="pane.key"
      :tab="pane.title"
      :closable="pane.closable"
    >
      <a-button
        class="submit"
        type="primary"
        shape="circle"
        icon="cloud-upload"
        @click="submitCode"
      ></a-button>
      <code-mirror v-model="pane.content" :options="cmOptions" />
    </a-tab-pane>
  </a-tabs>
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
import { postSql } from '@/api/codeMirror'
const defaultCode = '-- 左ctrl键开启代码提示补全功能\nSELECT * FROM tableA;\n'
const panes = [
  { title: 'Tab 1', content: defaultCode, key: '1' },
  { title: 'Tab 2', content: defaultCode, key: '2' },
  { title: 'Tab 3', content: defaultCode, key: '3' }
]
export default {
  name: 'CodeMirror',
  props: [''],
  data() {
    return {
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
      },
      activeKey: panes[0].key,
      panes,
      newTabIndex: 0
    }
  },

  components: {
    codeMirror: codemirror
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    changeTab(key) {
      console.log(key)
    },
    onEdit(targetKey, action) {
      this[action](targetKey)
    },
    add() {
      const panes = this.panes
      const activeKey = `newTab${this.newTabIndex++}`
      panes.push({
        title: 'New Tab',
        content: '-- 左ctrl键开启代码提示补全功能\nSELECT * FROM tableA\n',
        key: activeKey
      })
      this.panes = panes
      this.activeKey = activeKey
    },
    remove(targetKey) {
      let activeKey = this.activeKey
      let lastIndex
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1
        }
      })
      const panes = this.panes.filter(pane => pane.key !== targetKey)
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key
        } else {
          activeKey = panes[0].key
        }
      }
      this.panes = panes
      this.activeKey = activeKey
    },
    async submitCode() {
      let currentCode = null
      for (const code of panes) {
        if (code.key == this.activeKey) {
          currentCode = code
          // TODO: api
          console.log(currentCode.content)
          await postSql({ sql: currentCode.content })
          return
        }
      }
    }
  }
}
</script>
<style lang="less">
.ant-tabs-nav-container {
  background-color: #292a2b;
  color: #fff;
}

.ant-tabs-bar {
  margin: 0;
}

.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  color: #ffb86c !important;
  border-bottom: 1px solid #fff;
}

.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  background-color: #292a2b;
  border: none;
}

.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab .ant-tabs-close-x {
  color: #fff;
}

.ant-tabs-extra-content {
  background-color: #292a2b;
  & .ant-tabs-new-tab {
    color: #fff;
    margin-right: 10px;
  }
}

.ant-tabs-tab-prev.ant-tabs-tab-arrow-show,
.ant-tabs-tab-next.ant-tabs-tab-arrow-show {
  color: white;
}

.submit {
  position: fixed;
  right: 4px;
  top: 30px;
  z-index: 9999;
}
</style>
