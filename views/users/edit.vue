<template>
  <user-form :is-edit="true"></user-form>
</template>

<script>
import UserForm from './form'

export default {
  name: "CreateUser",
  components: { UserForm }
}

</script>