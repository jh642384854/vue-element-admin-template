<template>
  <keyword-reply-form :is-edit="true"></keyword-reply-form>
</template>

<script>
import KeywordReplyForm from './form'

export default {
  name: "CreateKeywordReply",
  components: { KeywordReplyForm }
}

</script>