<template>
      <div class="record-list-data">
        <table >
          <thead>
              <tr>
               <th class="width-560">{{ $t('common.table.contract') }}</th>
               <th>{{ $t('common.table.direction') }}</th>
               <th>{{ $t('common.table.entrustNumber') }}</th>
               <th>{{ $t('common.table.entrustPrice') }}</th>
               <th>{{ $t('common.table.dealQuantity') }}</th>
               <th>{{ $t('common.table.averagePrice') }}</th>
               <th class="width-750">{{ $t('common.table.entrustedValue', {name: com.marginUnit}) }}</th>
               <th class="width-750">{{ $t('common.table.type') }}</th>
               <th class="width-750">{{ $t('common.table.source') }}</th>
               <th class="width-750" style="width: 150px;">{{ $t('common.table.time') }}</th>
               <th>{{ $t('common.table.options') }}</th>
              </tr>
            </thead>
            <tbody class="current-entrust">
                  <tr :key="item.oid" v-for="item in curryEntrustList">
                    <td class="width-560 btn" style="cursor: pointer;" @click="IdCopy(item.oid)" :title="'ID:' + item.oid + $t('common.table.clickCopy')"><st-row align="center"><i :class="~[1, 2].indexOf(item.side) ? 'green' : 'red'"></i> <span>{{ productInfo.symbol }}</span></st-row></td>
                    <td>{{ $t(`common.positions_${item.side}`) }}</td>
                    <td>{{ item.qty }}</td>
                    <td>{{ item.px }}</td>
                    <td>{{ item.cum_qty }}</td>
                    <td>{{ item.avg_px|retainDecimals({decimal: com.pxUnit}) }}</td>
                    <td class="width-750">{{ getPositionsValue(item.qty, item.px)|retainDecimals({decimal: com.valueUnit}) }}</td>
                    <td class="width-750">{{ $t(`common.priceType_${item.category}`) }}</td>
                    <td class="width-750">{{ $t(`common.table.${~item.origin.indexOf('PLAN') ? 'PLAN' : item.origin}`) }}</td>
                    <td class="width-750">
                      {{item.created_at|timeFormat}}
                    </td>
                    <td class="options">
                        <a v-if="item.origin !== 'SYSTEM'" @click="cancelOrders(item.oid)">{{ $t('common.table.cancel') }}</a>
                    </td>
                </tr>
                  <!-- <tr>
                    <td><st-row align="center"><i class="red"></i> <span>XBTUSD</span></st-row></td>
                    <td>平仓开多</td>
                    <td>-1,000,000</td>
                    <td>10,000</td>
                    <td>10,000</td>
                    <td>1,000,00</td>
                    <td>100.0000</td>
                    <td>限价</td>
                    <td>安卓</td>
                    <td>
                        <p>2018/03/08</p>
                        <p>12:30:55</p>
                    </td>
                    <td class="options">
                        <a class="green" href="">{{ $t('common.table.cancel') }}</a>
                    </td>
                </tr> -->
            </tbody>
       </table>
          <st-row direction="column" v-if="!curryEntrustList || !curryEntrustList.length" align="center" class="no-data">
            <img src="../../../assets/img/no-data.png" alt="">
            <p>{{ $t('record.noData') }}</p>
       </st-row>
      </div>
</template>
<script>
import ClipboardJS from 'clipboard'
import Formula from '../../../assets/js/formula/index.js'
export default {
  data() {
    return {
      offset: 0
    }
  },
  computed: {
    com() {
      return this.$store.state.com
    },
    productInfo() {
      return this.$store.state.market.productInfo
    },
    curryEntrustList() {
      return this.$store.state.market.curryEntrustList
    }
  },
  methods: {
    // 复制id
    IdCopy(id) {
      this.copy = new ClipboardJS('.btn', {
        text: function () {
          return id
        }
      })
      this.$alert('s', this.$t('bonus.copyMessage'))
    },
    getPositionsValue(vol, price) {
      return Formula.CalculateContractValue(vol, price, Formula.contractObj.getContract(this.productInfo))
    },
    confirmEntrustClose() {
      this.showConfirmEntrust = false
    },
    unwindClose() {
      this.showUnwind = false
    },
    cancelOrders(oid) {
      let nonce = parseInt(Date.now() / 1000)
      this.swapsApi.cancelOrders({orders: [{instrument_id: this.productInfo.instrument_id, orders: [oid]}], nonce})
      .then(res => {
        if (res.errno === 'OK') {
          this.$alert('s', this.$t('common.cancelSuccess'))
        }
      })
    }
  }
  // created() {
  //   console.log(this.curryEntrustList)
  // }
}
</script>

<style lang="less" scoped>
@import "./list";
.record-list-data .current-entrust {
   tr {
       height: 50px;
       td {
           p {
               text-align: center;
           }
       }
        .options {
            width: 70px;
          a {
            display: block;
            margin: 0 auto;
            text-align: center;
            width: 60px;
            height: 20px;
            line-height: 18px;
            border: 1px solid #F8B500;
            color: #F8B500;
            &.hover {
               border: 1px solid #3C9FFB;
               color:  #3C9FFB;
            }
          }
      }
   }
}
</style>
