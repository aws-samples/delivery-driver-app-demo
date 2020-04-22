<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Register!</h2>

          <Notification :message="error" v-if="error"/>

          <form method="post" @submit.prevent="register">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="username"
                  v-model="username"
                  required
                >
              </div>
            </div>
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  type="email"
                  class="input"
                  name="email"
                  v-model="email"
                  required
                >
              </div>
            </div>
             <div class="field">
              <label class="label">Phone Number</label>
              <div class="control">
               
                <VuePhoneNumberInput v-model="phoneNumber" v-on:update="checkNumber" />
                
              </div> 
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  type="password"
                  class="input"
                  name="password"
                  v-model="password"
                  required
                >
              </div>
            </div>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">Register</button>
            </div>
          </form>

          <div class="has-text-centered" style="margin-top: 20px">
            Already got an account? <nuxt-link to="/login">Login</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Notification from '~/components/Notification'


export default {
  middleware: 'guest',
  components: {
    Notification,
  },

  data() {
    return {
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
      e164:'',
      error: null
    }
  },
   
  
  methods: {
    async checkNumber(phonenumber) {
        if(phonenumber.isValid)
         this.e164=phonenumber.e164
    },
    async register() {
      try {
        console.log(JSON.stringify(this.phoneNumber,null,2))
        
        await this.$axios.post('user', {
          username: this.username,
          email: this.email,
          phonenumber: this.e164,
          password: this.password
        })

        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          },
        })

        this.$router.push('/deliveries')
      } catch (e) {
        console.dir(e)
        if (e.response)
            this.error = e.response.data.message
        else
             this.error = e.message
      
         
      }
    }
  },
 
}
</script>