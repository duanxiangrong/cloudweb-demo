<template>
      <div class="record-list-data">
        <table >
          <thead>
              <tr>
              <th class="hint-father hover">
                 <p><span>{{ $t('record.cp.interestsUser') }}</span></p>
                 <div class="hint">
                    <p>{{ $t('record.cp.interestsUserHover') }}</p>
                 </div>
               </th>
               <!-- <th>{{ $t('record.cp.interestsUser') }}</th> -->
               <th>{{ $t('record.cp.balanceUser') }}</th>
               <th>{{ $t('record.cp.marginUser') }}</th>
               <th style="width: 160px;">{{ $t('record.cp.noMoneyTwo') }}</th>
               <!-- <th style="width: 140px;">{{ $t('record.cp.onMoney') }}</th> -->
               <th>{{ $t('record.cp.freezeVol') }}</th>
              </tr>
            </thead>
            <tbody class="current-entrust">
                  <tr v-if="token">
                    <td>{{ getUserSumAssert()|retainDecimals({decimal: com.valueUnit}) }}</td>
                    <!-- <td>{{ accounts.available_vol|retainDecimals({decimal: com.valueUnit}) }}</td> -->
                    <td>{{ getBalanceUser()|retainDecimals({decimal: com.valueUnit}) }}</td>
                    <td>{{ com.imTotal|retainDecimals({decimal: com.valueUnit}) }}</td>
                    <td>{{ com.PNL|retainDecimals({decimal: com.valueUnit}) }}</td>
                    <!-- <td>{{ accounts.realised_vol|retainDecimals({decimal: com.valueUnit}) }}</td> -->
                    <td>{{ accounts.freeze_vol |retainDecimals({decimal: com.valueUnit}) }} {{ accounts.coin_code }}</td>
                </tr>
            </tbody>
       </table>
      </div>
</template>
<script>
// import Formula from '../../../assets/js/formula/index.js'
// import Formula from '../../../assets/js/formula/index.js'
export default {
  name: 'assets',
  computed: {
    token() {
      return this.$store.state.auth.token
    },
    com() {
      return this.$store.state.com
    },
    ticker() {
      return this.$store.state.market.ticker
    },
    productInfo() {
      return this.$store.state.market.productInfo
    },
    accounts() {
      return this.$store.state.auth.accounts || {}
    },
    cabinList() {
      return this.$store.state.market.cabinList
    }
  },
  methods: {
    // // 获取精度
    // gePrecision(value, unit, integer = 8) {
    //   let _unit = this.productInfo[unit].lastIndexOf('.') + 1
    //   return Utils.retainDecimals(value, {integer, decimal: _unit})
    // },
    // 获取可用资产
    // getCanAssert() {
    //   let assert = this.accounts.available_vol
    //   let money = this.$store.state.market.longOptions + this.$store.state.market.sortOptions
    //   return money < 0 ? (assert - money) : assert
    // },
    // 获取仓位保证金
    // getPositions() {
    //   let total = 0
    //   this.cabinList.forEach(item => {
    //     total += Number(item.im)
    //     // total += this.LongOrSort(item.hold_vol, item.hold_avg_price, item.position_type === 1, item.im)
    //   })
    //   return total
    // },
    // 未实现盈亏
    // LongOrSort(vol, openPrice, way, im) {
    //   if (!this.ticker.fair_price) {
    //     return 0
    //   }
    //   return Formula.LongOrSort(vol, openPrice, this.ticker.fair_price, Formula.contractObj.getContract(this.productInfo), way)
    // },
    // 获取价值精度
    // getValueUnit() {
    //   return this.productInfo.value_unit.lastIndexOf('.') + 1
    // },
    // 获取账户权益
    getUserSumAssert() {
      // 可用 + 冻结 + 未实现盈亏
      return Number(this.accounts.available_vol) + Number(this.accounts.freeze_vol) + this.com.PNL + this.com.imTotal
    },
    // 获取保证金余额
    getBalanceUser() {
      return Number(this.accounts.available_vol) + Math.min((this.com.positionLoss + this.com.imTotal), 0)
    }
  }
}
</script>

<style lang="less" scoped>
@import "./list";
.record-list-data {
   tr {
       height: 50px;
       th, td {
          //  text-align: center
          &:last-child {
            width: 120px;
            text-align: right;
          }
       }
   }
}
</style>
