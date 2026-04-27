<script setup lang="ts">
const currentYear = 2026;
const icpRecordNumber = '皖ICP备2026011109号';
</script>

<template>
  <footer class="record-footer">
    <div class="record-footer__inner">
      <div class="record-footer__notes">
        <p>备案主体信息提交使用真实姓名，站内展示名“暮宇_Twilighter”为个人网络昵称。</p>
        <p>网站目前处于备案流程中，上线后将在首页底部按要求展示正式备案号并链接至工信部备案系统。</p>
      </div>
      <div class="record-footer__meta">
        <p>{{ `© ${currentYear} 暮宇_Twilighter. All rights reserved.` }}</p>
        <a
            v-if="icpRecordNumber"
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer nofollow"
        >
          {{ icpRecordNumber }}
        </a>
        <p v-else>
          备案号：备案流程中，预留位置
        </p>
      </div>
    </div>
  </footer>
</template>
