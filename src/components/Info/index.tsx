import React, {useState} from 'react'
import './index.css'
import {ReactComponent as ArrowIcon} from '../../images/arrow.svg'
import {ReactComponent as NearIcon} from '../../images/nearIcon.svg'
import {ReactComponent as LockIcon} from '../../images/lockIcon.svg'
import {ReactComponent as SettingsIcon} from '../../images/settingsIcon.svg'
import {ReactComponent as CopyIcon} from '../../images/copyIcon.svg'
import {ReactComponent as ArrowGroupIcon} from '../../images/arrowGroup.svg'

const balance = [
 {title: 'Available ballance', value: '0.83 NEAR'}, 
 {title: 'Staked', value: '0 NEAR'}
]

const Info = () => {
    const [step, setStep] = useState('tokens')

    return <div className='infoContainer'>
      <div className='header'>
        <div className='item'>
         <button className='backBtn'>
            <ArrowIcon/>
         </button>
         <button className='dropdownBtn'>
            <NearIcon className='nearIcon'/>
            <div>Wallet 1 </div>
            <ArrowIcon className='arrowIcon'/>
         </button>
        </div>
        <div className='item titleContainer'>
          <NearIcon className='nearIconTitle'/>
          <span className='title'>Near Wallet</span>   
        </div>
        <div className='item'>
          <button>
            <LockIcon className='lockIcon'/>
          </button>
          <button>
            <SettingsIcon className='settingIcon'/>
          </button>
        </div>
      </div>
      <div className='body'>
       <div className='balanceContainer'>
        <div className='token'>
         df4d1274f600ee... <CopyIcon className='copyIcon'/>
        </div>
        <div className='title'>Balance</div>
        <div className='balance'>0.93245 NEAR</div>
        <div className='text'>≈ $6.9208 USD</div>
       </div>
       <div className='cardContainer'>
        {balance?.map(el => {
            return <div className='card'>
                  <div className='valueContainer'>
                     <div>{el?.title}</div>
                     <div className='value'><div className='near'>
                        </div>{el?.value}</div>
                     </div>
                  <button className='btn'><ArrowIcon/></button>
                </div>
        })}
       </div>
      <button className='btnSend'><ArrowGroupIcon className='arrowGroup'/>Send</button>
      <div className='btnConteiner'>
        <button onClick={() => setStep('tokens')} className={step === 'tokens' ?  'active' : ''}>Tokens</button>
        <button onClick={() => setStep('NFT')} className={step === 'NFT' ?  'active' : ''}>NFT</button>
      </div>
      </div>
      <div className='footerInfo'>
        <div className='text'>You don’t have tokens</div>
        <button className='btn'>Add Token</button>
      </div>
    </div>
}

export default Info