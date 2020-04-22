<template>
    <section>
            <form>
                <div class="modal-card" style="width: auto">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Add Order</p>
                    </header>
                    <section class="modal-card-body">
                        

                        <b-field label="Customer Name">
                            <b-input
                                :value="name"
                                v-model="name"
                                placeholder="Customer Name"
                                required>
                            </b-input>
                        </b-field>

                        <b-field label="Phone Number">
                              <VuePhoneNumberInput v-model="phonenumber" v-on:update="checkNumber" />
                        </b-field>
                       
                    </section>
                    <footer class="modal-card-foot">
                        <b-button type="is-primary" @click="addOrder()" outlined>Add</b-button>
                        <b-button  @click="$parent.close()" outlined>Close</b-button>
                        
                    </footer>
                </div>
            </form>
            </section>
</template>
<script>

import {mapGetters} from 'vuex'

export default {
   
    props: ['localData'],
    data() {
    return {
      email:'',
      username:'',
      phonenumber:'',
      ordernum:'',
      e164:''
    };
  },
   methods: {
     async checkNumber(phonenumber) {
        if(phonenumber.isValid)
         this.e164=phonenumber.e164
    },
    
    async addOrder() {
      let item={}
      item.name=this.name
      item.phonenumber=this.e164
     item.ordernum = Math.floor(Math.random()*900000) + 100000;
      let newOrderList = _.cloneDeep(this.localData)
      newOrderList.push(item)
      try {
        let ret =  await this.$axios.post('order', {orders:newOrderList})
        if(ret.status == 200)
        {
          this.localData.push(item)
          this.name=''
          this.phonenumber=''
          this.ordernum=''
          this.$parent.close()
        }
      }
      catch(e)
      {
         if (e.response)
            this.error = e.response.data.message
        else
            this.error = e.message
        
      }
    }
  
  }
}

</script>