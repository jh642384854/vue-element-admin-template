<template>
  <article-form :is-edit="true"></article-form>
</template>

<script>
import ArticleForm from './components/form'

export default {
  name: "EditArticle",
  components: { ArticleForm }
}

</script>