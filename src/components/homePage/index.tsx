import React from 'react'
import Icon from '../icon'
import iconsObj from '../../assets/icons'
import './index.css'

const HpmePage = () => {
    return <div className='homePageContainer'>
    <div className='title'>Omni Near Wallet</div>
        <div className='iconContainer'>
            <div className='bg'><Icon className='omniLogo' src={iconsObj.omniLogo}/></div>
            <Icon className='nearMenu' src={iconsObj.nearMenu}/>
        </div>
     <input className='password' type='password' placeholder='Enter password'/>
     <button type='button' className='btn'>Unlock</button>
    </div>
}

export default HpmePage