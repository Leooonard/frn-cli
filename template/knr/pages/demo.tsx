import * as React from 'react'
import CouponStyle from '../assets/styles/demoStyle'

export default class extends React.Component {

  render() {
    return (
      <div>
        <div className="hotelCouponCtn">
          <p>
          1.  包含1张70元酒店优惠券
          </p>
          <p>
          2.  适用于单价大于250元的国内酒店房型（含港澳台），旅行社房型不支持使用优惠券
          </p>
          <p>
          3.  70元现金将在酒店订单成交后3个工作日内返还至您的携程账户
          </p>
          <p>
          4.  优惠券自发放之日起30天内有效
          </p>
          <p>
          5.	每张优惠券限用一次，每张订单限用一张优惠券，优惠券不得转赠他人
          </p>
          <p>
          6.	订单取消后，优惠券将实时退还到账户（实际未入住用户除外）
          </p>
          <p>
          7.	优惠券不支持单独退订；已使用或已过期优惠券的套餐订单若发生退订，需在支付退订费时退还相应优惠券金额
          </p>
        </div>
        <CouponStyle />
      </div>
    )
  }
}