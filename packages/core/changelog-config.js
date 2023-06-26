module.exports = {
  writerOpts: {
    transform: (commit, context) => {
      if (commit.type === 'feat') {
        commit.type = '✨ Features | 新功能'
      } else if (commit.type === 'fix') {
        commit.type = '🐛 Bug Fixes | Bug 修复'
      } else if (commit.type === 'perf') {
        commit.type = '⚡ Performance Improvements | 性能优化'
      } else if (commit.type === 'revert' || commit.revert) {
        commit.type = '⏪ Reverts | 回退'
      } else if (discard) {
        return
      } else if (commit.type === 'docs') {
        commit.type = '📝 Documentation | 文档'
      } else if (commit.type === 'style') {
        commit.type = '💄 Styles | 风格'
      } else if (commit.type === 'refactor') {
        commit.type = '♻ Code Refactoring | 代码重构'
      } else if (commit.type === 'test') {
        commit.type = '✅ Tests | 测试'
      } else if (commit.type === 'build') {
        commit.type = '👷‍ Build System | 构建'
      } else if (commit.type === 'ci') {
        commit.type = '🔧 Continuous Integration | CI 配置'
      } else if (commit.type === 'chore') {
        commit.type = '🎫 Chores | 其他更新'
      }
      return commit
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
  }
}
