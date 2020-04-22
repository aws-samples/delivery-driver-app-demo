<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-fouth">
          <h3 class="title">Orders</h3>
          <Notification :message="error" v-if="error"/>

        </div>
       
        <div class="column" />
     </div>
    <div class="columns">
    <div class="column is-half">
    <div>
      <no-ssr placeholder="loading...">
      <vuetable ref="vuetable"
        :fields="[{name:'ordernum',title:'Order #'},{name:'name',title:'Customer Name'},{name:'phonenumber',title:'Phone Number'},'actions']"
        :api-mode="false"
        :data="localData"
      >
      	<div slot="actions" slot-scope="props">
           <button class="button is-danger is-outlined"
           @click="deleteOrder(props.rowData)">
              <span>Delete</span>
              <span class="icon is-small">
                <fa icon="user-times" />
              </span>
            </button>
			  </div>
      </vuetable>

      </no-ssr>
    </div>
    </div>
    </div>
    
    <div style="padding:10px">
   
   <button class="button is-primary is-outlined"
            @click="isComponentModalActive = true" >
            <span>Create Order</span>
              <span class="icon is-small">
                <fa icon="plus" />
             </span>
    </button>
     <b-modal :active.sync="isComponentModalActive"
                 has-modal-card
                 trap-focus
                 aria-role="dialog"
                 aria-modal>
            <modal-form v-bind:localData="this.localData"></modal-form>
        </b-modal>
    </div>
    </div>
    
  </section>
</template>
 
<script>
import Vuetable from 'vuetable-2'
import _ from 'lodash'
import Notification from '~/components/Notification'
import ModalForm from '~/components/NewOrderModal'
 
export default {
  components: {
    Vuetable,
    Notification,
    ModalForm
  },
  data() {
    return {
      isComponentModalActive: false,
      localData:[],
      error:''
    };
  },
   async  mounted () {
      try {
        let ret =  await this.$axios.get('order')
        this.localData=ret.data
      }
      catch(e)
      {
         if (e.response)
            this.error = e.response.data.message
        else
            this.error = e.message
      }

    },
  methods: {
  
    async checkNumber(phonenumber) {
        if(phonenumber.isValid)
         this.e164=phonenumber.e164
    },
    async deleteOrder(rowData) {
     
      //console.log(rowData)
       let newOrderList = _.cloneDeep(this.localData)
        newOrderList =_.remove(newOrderList,function(c){
        return c.ordernum!=rowData.ordernum
      })
      try {
        let ret =  await this.$axios.post('order', {orders:newOrderList})
        if(ret.status == 200)
        {
          this.localData=newOrderList
        }
      }
      catch(e)
      {
         if (e.response)
            this.error = e.response.data.message
        else
            this.error = e.message
        
      }

    },
  },
  
  
}
</script>
