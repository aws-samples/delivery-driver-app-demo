<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-fouth">
          <h3 class="title">Deliveries</h3>
          <Notification :message="error" v-if="error"/>

        </div>
       
        <div class="column" />
     </div>
    <div class="columns">
    <div class="column is-half">
    <div>
      <no-ssr placeholder="loading...">
      <vuetable ref="vuetable"
        :fields="[{name:'orderNumber',title:'Order #'},{name:'customerName',title:'Customer Name'},{name:'proxyPhoneNumber',title:'Proxy Number'},'expiration','actions']"
        :api-mode="false"
        :data="localData"
      >
        <div slot="expiration" slot-scope="props" >
          
              <div id="timer" class="timer">
                <!--  Timer Component  -->
                <Timer 
                        v-bind:expirymin=props.rowData.expiryMinutes
                        v-bind:starttime=props.rowData.createdTimestamp
                        trans='{  
                        "day":"Day",
                        "hours":"Hours",
                        "minutes":"Min",
                        "seconds":"Sec",
                        "expired":"Expired.",
                        "running":"Valid for",
                        "upcoming":"",
                        "status": {
                            "expired":"Expired",
                            "running":"Running",
                            "upcoming":"Future"
                        }}'
                        ></Timer>
                <!--  End! Timer Component  -->
        </div>
            
		</div>
      	<div slot="actions" slot-scope="props">
           <button class="button is-success  is-outlined"
           @click="deleteDelivery(props.rowData)">
              <span>Complete</span>
              <span class="icon is-small">
              
                <fa icon="check-square" />
              </span>
            </button>
		</div>
      </vuetable>

      </no-ssr>
    </div>
    </div>
    </div>
    </div>
   
    
    <div class="container">
    <div class="columns">
    <div class="column is-half">
     <div class="partition">
       <div class="partition-title">Delivery Request</div>
      
       <form  @submit.prevent="addDelivery">
          
            <div class="field">
              <label class="label">Orders</label>
               
                <no-ssr placeholder="loading...">
                <div class="field">
                <div class="control proxytable">
                   <multiselect v-model="selected"  deselect-label="Can't remove this value" track-by="name" label="name" :custom-label="customLabel" placeholder="Select a Customer" :options="options" :searchable="false" :allow-empty="false">
                        <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.name}} - #{{ option.ordernum }}</strong> </template>
                    </multiselect>
                </div>
                </div>

                </no-ssr>
              
            </div>
              
            <div class="control">
              <button type="submit" class="button is-info is-small"><span>Accept Delivery</span>
              <span class="icon is-small">
              
                <fa icon="truck" />
              </span></button>
            </div>
          </form>
          <br>
           <p>
             <br>
              No Orders? Create a new one <nuxt-link to="/orders">here.</nuxt-link>
          </p>
     </div>
        </div>
       </div>
  </section>
</template>
 
<script>
import Vuetable from 'vuetable-2'
import _ from 'lodash'
import Notification from '~/components/Notification'
import Timer from '~/components/Timer'
export default {
  components: {
    Vuetable,
    Notification,
    Timer
  },
  data() {
    return {
      cphonenumber:'',
      localData:[],
      error:'',
      selected:null,
      options: [],
    };
  },
   async  mounted () {
      try {
        let ret =  await this.$axios.get('order')
        
        this.options = ret.data
        let ret2 =  await this.$axios.get('chimeproxy/phoneproxy')
        this.localData=ret2.data
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
  
    
    async deleteDelivery(rowData) {
      //console.log(rowData)
       let newDeliveryList = _.cloneDeep(this.localData)
        newDeliveryList =_.remove(newDeliveryList,function(c){
        return c.proxyId!=rowData.proxyId
      })
      try {
        let ret =  await this.$axios.delete('chimeproxy/phoneproxy/'+rowData.proxyId)
        if(ret.status == 200)
        {
          this.localData=newDeliveryList
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
    customLabel ({ name, ordernum }) {
      return `${name} – #${ordernum}`
    },
    async addDelivery() {
      let params={}
      params.customerName=this.selected.name
      params.customerNumber=this.selected.phonenumber
      params.orderNumber=this.selected.ordernum

      try {
        let ret =  await this.$axios.post('chimeproxy/phoneproxy', params)
        let newDeliveryList = _.cloneDeep(this.localData)
        newDeliveryList.push(ret.data)
        this.localData=newDeliveryList
        this.selected = null
      
      }
      catch(e)
      {
         if (e.response)
            this.error = e.response.data.message
        else
            this.error = e.message
        
      }
    }

  },
  
  
}
</script>
<style lang="scss">
.proxytable {
   
        vertical-align: middle;

}
.partition {
    width: 100%;
    height: 100%;
    .partition-title {
      box-sizing: border-box;
      width: 100%;
      padding-top: 30px;
      text-align: center;
      letter-spacing: 1px;
      font-size: 20px;
      font-weight: 300;
    }
    .partition-form {
      padding: 0px 20px;
      box-sizing: border-box;
    }
  }

  .timer {
  font-size: 20px;
  font-weight: 500;
  color: #000;
  text-align:center;
  min-width: 125px;

      .day, .hour, .min, .sec {
        font-size: 10px;
        display: inline-block;
        font-weight: 500;
        text-align: center;
        margin: 0 5px;
        .format {
          font-weight: 300;
          font-size: 10px;
          //@include margin-start(5);
          //display: inline-block;
          opacity: 0.8;
          width: 15px;
        }
      }
      .number{
        background: rgba(51, 51, 51, 0.53);
        padding: 0 5px;
        margin-right: 0em;
        border-radius: 5px;
        display: inline-block;
        width: 15px;
        font-size: 10px;
        text-align: center;
      }
      .message {
        font-size: 10px;
        font-weight: 400;
        margin-top: 0px;
        margin-bottom: 5px;
      }
      .status-tag{
        width: 270px;
        margin: 10px auto;
        padding: 8px 0;
        font-weight: 500;
        color: #000;
        text-align: center;
        border-radius: 15px;
        &.upcoming{
          background-color: lightGreen;
        }
        &.running{
          background-color: gold;
        }
        &.expired{
          background-color: silver;
        }
      }
    }
  </style>