import { URI } from 'api-control/api'
import axios from 'axios'
import Sidebar from 'components/Sidebar'
import Topbar from 'components/Topbar'
import { useWeb3Context } from 'hooks/useWeb3Context'
import React, { useState } from 'react'
import encryptParams from 'utils/encryption'
import getDisplayStringFromNumber from 'utils/getDisplayStringFromNumber'
import getNFTNameFromId from 'utils/getNFTNameFromId'

const Notifications = () => {
    const [notifications, setNotifications]: any = React.useState()
    const web3Context = useWeb3Context()
    React.useEffect(() => {

        if (web3Context?.provider && web3Context?.account) {
            const body = {
                public_key: web3Context?.account.toLowerCase()
            }
            axios.post(`${URI}/notification/get`, {params: encryptParams(body)})
                .then((res) => {
                    setNotifications(res.data)
                })
        }

    }, [web3Context])

    return (
        <div className=' w-full flex items-center gap-5'>
            <div className='relative z-50'>
                <Sidebar />
            </div>
            <div className=' lg:ml-56 pr-5 w-full'>
                <Topbar />
                <div className=' px-3 w-full'>
                    <h1 className=' text-3xl text-white'>Notifications</h1>
                    {notifications?.early?.length !== 0 &&
                        <>
                            <p className=' text-white pt-5 pb-2'>Earliar</p>
                            <div style={{ background: "#0A1C26" }} className=' lg:w-5/6 w-full  p-5 rounded-2xl '>
                                {notifications?.early?.map((item: any, ind: any) => {
                                    const _date = new Date(item?.date)
                                    return ( <div className=' w-full mt-5 flex items-center flex-wrap justify-between' key={ind}>
                                        <div className=' flex items-center gap-3'>
                                            {item?.typeN === "newuser" && <img className=' w-12' src="/images/notifications.png" alt="" />}
                                            {item?.typeN === "earn" && <img className=' w-12' src="/images/bbnb.png" alt="" />}
                                            {item?.typeN === "claim" && <img className=' w-12' src="/images/bbnb.png" alt="" />}
                                            {item?.typeN === "stake" && <img className=' w-12' src="/images/su.png" alt="" />}
                                            {item?.typeN === "unstake" && <img className=' w-12' src="/images/su.png" alt="" />}
                                            {item?.typeN === "swap" && <img className=' w-12' src="/images/nswap.png" alt="" />}
                                            {item?.typeN === "buylambo" && <img className=' w-12' src="/images/nswap.png" alt="" />}
                                            {item?.typeN === "selllambo" && <img className=' w-12' src="/images/nswap.png" alt="" />}
                                            {item?.typeN === "buy" && <img className=' w-12' src="/images/bbnb.png" alt="" />}

                                            {/*============== text------------------ */}
                                            {item?.typeN === "newuser" && <p className=' text-gray-500 text-sm'>New User <span className=' text-white'>{item?.desc}</span> is registered at level {item?.level} </p>}
                                            {item?.typeN === "earn" && <p className=' text-gray-500 text-sm'>You have gained <span className=' text-white'> {getDisplayStringFromNumber(Number(item?.desc))}</span>{` BNB to your level${item?.level}.`}</p>}
                                            {item?.typeN === "claim" && <p className=' text-gray-500 text-sm'>Congratulations! Your Staking has worked effectively. <span className=' text-white'>Your earned {getDisplayStringFromNumber(Number(item?.desc))} TAU!!!</span></p>}
                                            {item?.typeN === "stake" && <p className=' text-gray-500 text-sm'>You just staked <span className=' text-white'>{getNFTNameFromId(item?.id)}</span>.</p>}
                                            {item?.typeN === "unstake" && <p className=' text-gray-500 text-sm'>You just unstaked <span className=' text-white'>{getNFTNameFromId(item?.id)}</span>.</p>}
                                            {item?.typeN === "swap" && <p className=' text-gray-500 text-sm'>You just bought <span className=' text-white'>{getDisplayStringFromNumber(Number(item?.desc))} TAU</span>  from Pancakeswap! </p>}
                                            {item?.typeN === "buylambo" && <p className=' text-gray-500 text-sm'>You just bought <span className=' text-white'>{getDisplayStringFromNumber(Number(item?.desc))} TAU</span>  from Pancakeswap! </p>}
                                            {item?.typeN === "selllambo" && <p className=' text-gray-500 text-sm'>You just sold <span className=' text-white'>{getDisplayStringFromNumber(Number(item?.desc))} TAU</span>  from Pancakeswap! </p>}
                                            {item?.typeN === "buy" && <p className=' text-gray-500 text-sm'>You just bought <span className=' text-white'>{getNFTNameFromId(item?.id)}</span> successfully.</p>}
                                        </div>
                                        <p className=' text-gray-500 text-sm'>{_date.toLocaleString()}</p>
                                    </div>)
                                    }
                                )}
                            </div>
                        </>
                    }
                    {notifications?.past?.length !== 0 &&
                        <>
                            <p className=' text-white pt-5 pb-2'>Past Notifications</p>
                            <div style={{ background: "#08171F" }} className=' lg:w-5/6 w-full  p-5 rounded-2xl '>
                                {notifications?.past?.map((item: any, ind: any) => (
                                    <div className=' w-full mt-5 flex items-center flex-wrap justify-between' key={ind}>
                                        <div className=' flex items-center gap-3'>
                                            {item?.typeN === "newuser" && <img className=' w-12' src="/images/notifications.png" alt="" />}
                                            {item?.typeN === "earn" && <img className=' w-12' src="/images/bbnb.png" alt="" />}
                                            {item?.typeN === "claim" && <img className=' w-12' src="/images/bbnb.png" alt="" />}
                                            {item?.typeN === "stake" && <img className=' w-12' src="/images/su.png" alt="" />}
                                            {item?.typeN === "unstake" && <img className=' w-12' src="/images/su.png" alt="" />}
                                            {item?.typeN === "swap" && <img className=' w-12' src="/images/nswap.png" alt="" />}
                                            {item?.typeN === "buylambo" && <img className=' w-12' src="/images/nswap.png" alt="" />}
                                            {item?.typeN === "selllambo" && <img className=' w-12' src="/images/nswap.png" alt="" />}
                                            {item?.typeN === "buy" && <img className=' w-12' src="/images/bbnb.png" alt="" />}

                                            {/*============== text------------------ */}
                                            {item?.typeN === "newuser" && <p className=' text-gray-500 text-sm'>New User <span className=' text-white'>{item?.desc}</span> is registered at level {item?.level} </p>}
                                            {item?.typeN === "earn" && <p className=' text-gray-500 text-sm'>You have gained <span className=' text-white'> {getDisplayStringFromNumber(Number(item?.desc))}</span>{` BNB to your level${item?.level}.`}</p>}
                                            {item?.typeN === "claim" && <p className=' text-gray-500 text-sm'>Congratulations! Your Staking has worked effectively. <span className=' text-white'>Your earned {getDisplayStringFromNumber(Number(item?.desc))} TAU!!!</span></p>}
                                            {item?.typeN === "stake" && <p className=' text-gray-500 text-sm'>You have staked <span className=' text-white'>{getNFTNameFromId(item?.id)}</span>.</p>}
                                            {item?.typeN === "unstake" && <p className=' text-gray-500 text-sm'>You have unstaked <span className=' text-white'>{getNFTNameFromId(item?.id)}</span>.</p>}
                                            {item?.typeN === "swap" && <p className=' text-gray-500 text-sm'>You have bought <span className=' text-white'>{getDisplayStringFromNumber(Number(item?.desc))} TAU</span>  from Pancakeswap! </p>}
                                            {item?.typeN === "buylambo" && <p className=' text-gray-500 text-sm'>You have bought <span className=' text-white'>{getDisplayStringFromNumber(Number(item?.desc))} TAU</span>  from Pancakeswap! </p>}
                                            {item?.typeN === "selllambo" && <p className=' text-gray-500 text-sm'>You have sold <span className=' text-white'>{getDisplayStringFromNumber(Number(item?.desc))} TAU</span>  from Pancakeswap! </p>}
                                            {item?.typeN === "buy" && <p className=' text-gray-500 text-sm'>You have bought <span className=' text-white'>{getNFTNameFromId(item?.id)}</span> successfully.</p>}

                                        </div>
                                        <p className=' text-gray-500 text-sm'>{item?.date?.slice(0, 10)}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Notifications