<template>
  <div>
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
        <code-mirror
          :ref="'codeEditor' + pane.key"
          v-model="pane.content"
          :options="cmOptions"
        />
      </a-tab-pane>
      <a-tooltip
        class="submit"
        placement="top"
        title="提交代码"
        slot="tabBarExtraContent"
      >
        <a-button
          type="primary"
          shape="circle"
          icon="cloud-upload"
          @click="submitCode"
        ></a-button>
      </a-tooltip>
      <a-tooltip
        class="snippets"
        placement="top"
        title="格式化代码"
        slot="tabBarExtraContent"
      >
        <a-button
          type="primary"
          shape="circle"
          icon="snippets"
          @click="formatCode"
        ></a-button>
      </a-tooltip>
      <a-tooltip
        class="rename"
        placement="top"
        title="重命名文件"
        slot="tabBarExtraContent"
      >
        <a-button
          type="primary"
          shape="circle"
          icon="edit"
          @click="setModalVisible(true)"
        ></a-button>
      </a-tooltip>
    </a-tabs>

    <a-modal
      title="重命名文件"
      :dialog-style="{ top: '20px' }"
      :visible="modalVisible"
      @ok="renameCode"
      @cancel="() => setModalVisible(false)"
    >
      <a-input v-model="renameText" />
    </a-modal>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'

// require codemirror styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/panda-syntax.css'
import 'codemirror/addon/selection/active-line'
// 语法高亮
import 'codemirror/mode/sql/sql.js'
// 代码提示,补全
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/sql-hint.js'
//sublime编辑器效果
import 'codemirror/keymap/sublime'
import 'codemirror/addon/display/autorefresh'
// 关键字搜索
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/jump-to-line.js'

import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'

// sql代码格式化
import sqlFormatter from 'sql-formatter'

import { postSql } from '@/api/codeMirror'

const defaultCode =
  '-- “左ctrl键” 开启代码提示补全功能\nSELECT * FROM tableA;\n'
const panes = [{ title: 'Tab 1', content: defaultCode, key: 'tab 1' }]

export default {
  name: 'CodeMirror',
  props: [''],
  data() {
    return {
      // 默认配置
      cmOptions: {
        mode: 'text/x-mysql',
        // 缩进格式
        tabSize: 4,
        // 主题，对应主题库 JS 需要提前引入
        theme: 'panda-syntax',
        // 显示行号
        lineNumbers: true,
        line: true,
        extraKeys: { Ctrl: 'autocomplete' },
        styleActiveLine: true,
        highlightDifferences: true,
        keyMap: 'sublime',
        lint: true,
        autoRefresh: true
      },
      activeKey: panes[0].key,
      panes,
      newTabIndex: 1,
      modalVisible: false,
      renameText: ''
    }
  },

  components: {
    codeMirror: codemirror
  },

  computed: {
    codeEditor() {
      return this.$refs[`codeEditor${this.activeKey}`][0].codemirror
    }
  },

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
      const activeKey = `newTab ${this.newTabIndex}`
      panes.push({
        title: `New Tab ${this.newTabIndex++}`,
        content: defaultCode,
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
          await postSql({ sql: currentCode.content })
          return
        }
      }
    },
    formatCode() {
      let currentCode = null
      for (const code of panes) {
        if (code.key == this.activeKey) {
          currentCode = code
          this.$nextTick(() => {
            this.codeEditor.setValue(sqlFormatter.format(currentCode.content))
          })
          return
        }
      }
    },
    renameCode() {
      let currentCode = null
      for (const code of panes) {
        if (code.key == this.activeKey) {
          currentCode = code
          if (this.renameText.trim().length) {
            currentCode.title = this.renameText.trim()
            this.setModalVisible(false)
            return
          }
          this.$message.warning('文件名不能为空！')
        }
      }
    },
    setModalVisible(modalVisible) {
      this.modalVisible = modalVisible
      this.renameText = ''
    }
  }
}
</script>
<style lang="less">
.CodeMirror {
  min-height: 100vh;
  padding-bottom: 10px;
}
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
  right: 30px;
  top: 90%;
  z-index: 9999;
}

.snippets {
  position: fixed;
  right: 65px;
  top: 90%;
  z-index: 9999;
}

.rename {
  position: fixed;
  right: 100px;
  top: 90%;
  z-index: 9999;
}

body::-webkit-scrollbar-thumb {
  background: #c97e2e;
}

::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background: #ffb86c;
}

::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  background: #292a2b;
}
</style>
