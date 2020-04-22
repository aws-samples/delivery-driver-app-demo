
<template>
 <section>
    <b-navbar class="is-light">
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
               Delivery Driver App Demo
            </b-navbar-item>
        </template>
       
        <template slot="end" v-if="isAuthenticated">
            <b-navbar-dropdown v-bind:label=loggedInUser.username>
            <b-navbar-item tag="router-link" :to="{ path: '/profile' }">
                My Profile
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/orders' }">
                Orders
            </b-navbar-item>
             <b-navbar-item tag="router-link" :to="{ path: '/deliveries' }">
                Deliveries
            </b-navbar-item>
            <hr class="navbar-divider">
            <b-navbar-item @click="logout">
                Logout
            </b-navbar-item>
            </b-navbar-dropdown>
       </template>
        <template slot="end" v-else  >
           <b-navbar-item tag="router-link" :to="{ path: '/register' }">
                Register
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/login' }">
                Login
            </b-navbar-item>
      </template>
       
    </b-navbar>
    </section>
</template>

<script>

import {mapGetters} from 'vuex'

export default {
   
  computed: {
   ...mapGetters(['isAuthenticated','loggedInUser'])
  },
  methods: {
  async logout() {
    await this.$auth.logout();
  },
  
  }
}
</script>