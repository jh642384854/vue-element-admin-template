<template>
  <user-form :is-edit="false"></user-form>
</template>

<script>
import UserForm from './form'

export default {
  name: "CreateUser",
  components: { UserForm }
}

</script>