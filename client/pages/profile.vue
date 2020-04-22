<template>
  <section class="section">
    <div class="container">
      <h2 class="title">My Profile</h2>
      <div class="content">
        <p>
          <strong>Username:</strong>
          {{ user.username }}
        </p>
         <p>
          <strong>Phone Number:</strong>
          {{ user.phonenumber }}
        </p>
        <p>
          <strong>Email:</strong>
          {{ user.email }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import {mapState} from 'vuex'

export default {
  middleware: 'auth',
  computed: {
    ...mapState('auth', ['loggedIn', 'user'])
  }
}
</script>