import GlobModal from 'components/GlobModal';
import Sidebar from 'components/Sidebar'
import Topbar from 'components/Topbar'
import { CHAIN } from 'config';
import useBNBBalance from 'hooks/useBNBBalance';
import useLmbBalance from 'hooks/useLMBBalance';
import useSwapInfo from 'hooks/useSwapInfo';
import { useWeb3Context } from 'hooks/useWeb3Context';
import { useState } from 'react';
import { toast } from 'react-toastify';
import useRegisterState from 'hooks/useRegisterState';
import { TaurusModal } from 'views/modals/Modals';
import { Direction } from 'react-toastify/dist/utils';
import getDisplayStringFromNumber from 'utils/getDisplayStringFromNumber';

const BuyTaurus = () => {
    const web3Context = useWeb3Context();
    const [taurusModal, setTaurusModal] = useState(false)
    const [bnbAmount, setBNBAmount] = useState(0)
    const [lmbAmount, setLmbAmount] = useState(0)
    const [inputState, setInputState] = useState(true)
    const [isBuy, setIsBuy] = useState(true)
    const bnbBalance: number = useBNBBalance(web3Context?.provider, web3Context?.account)
    const lmbBalance: number = useLmbBalance(web3Context?.provider, web3Context?.account)

    const isRegistered = useRegisterState(web3Context?.account)
    useSwapInfo(web3Context, isBuy, inputState, bnbAmount, setBNBAmount, lmbAmount, setLmbAmount)

    const handleChangeBNBAmount = (e: any) => {
        setBNBAmount(e.target.value)
        if(isBuy)
            setInputState(true)
        else 
            setInputState(false)
    }

    const handleChangeLmbAmount = (e: any) => {
        setLmbAmount(e.target.value)
        if(isBuy)
            setInputState(false)
        else
            setInputState(true)
    }

    const handleSwap = () => {
        if(check())
            setTaurusModal(true)
    }

    const check = () => { 
        if(!web3Context?.provider || !web3Context?.account) {
            toast.error('Confirm the wallet connected.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return false
        }       
        if(web3Context?.chainId !== CHAIN) {
            toast.error('Invalid Network.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return false
        }
        if(!isRegistered) {
            toast.error('You are not registered.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return false
        }
        if(isBuy && bnbAmount > bnbBalance - 0.01) {
            toast.error('Insuficient Balance.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return false
        }
        if(!isBuy && lmbAmount > lmbBalance) {
            toast.error('Insuficient Balance.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return false
        }
        if(lmbAmount <= 0 || bnbAmount <= 0) {
            toast.error('Invalid Input Value.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return false
        }
        return true;
    }

    const handleBNBMax = () => {
        setBNBAmount(bnbBalance - 0.01)
        setInputState(true)
    }

    const handleTaurusMax = () => {
        setLmbAmount(lmbBalance)
        setInputState(true)
    }

    const handleReverse = () => {
        setIsBuy(!isBuy)
        setBNBAmount(0)
        setLmbAmount(0)
    }

    return (
        <div className=' w-full flex items-center gap-5'>            
            <GlobModal size="xl" open={taurusModal} setOpen={setTaurusModal} >
                <TaurusModal  setTaurusModal={setTaurusModal} isBuy={isBuy} inputState={inputState} bnbAmount={Number(bnbAmount)} lmbAmount={Number(lmbAmount)} setBNBAmount={setBNBAmount} setLmbAmount={setLmbAmount} />
            </GlobModal>
            <div className='relative z-50'>
                <Sidebar />
            </div>
            <div className=' lg:ml-56 pr-5 w-full'>
                <Topbar />
                <div className=' px-3 w-full'>
                    <h1 className=' text-3xl text-white'>Buy Taurus token</h1>
                    <div className=' mt-4 w-full p-16 rounded-xl' style={{ background: "#08171F" }}>
                        <h1 className=' text-xl font-bold text-white'>Swap</h1>
                        <p className=' text-gray-400 text-sm w-full pb-4 pt-2'>Buy Taurus Token in an istant!</p>
                        <div style={{borderTop:"1px solid rgba(255,255,255,0.1)"}} className=' w-full mt-10  pt-10'>
                            <div className=' w-full flex  items-center flex-col gap-4 lg:flex-row justify-between '>
                                {isBuy && <div className=' w-full'>
                                    <div className=' w-full lg:w-96 rounded-2xl overflow-hidden flex items-center justify-between' style={{ background: "#0A1C26" }}>
                                        <div className=' p-3 flex items-center gap-2'>
                                            <div className=' p-2 rounded-full' style={{ background: "rgba(255, 181, 0, 0.1)" }}>
                                                <img src="/images/BNB.png" className=' w-5' alt="" />
                                            </div>
                                            <p className=' text-white'>BNB</p>
                                        </div>
                                        <div className=' w-32 p-3 h-full' style={{ background: "#0C222E" }}>
                                            <p className=' text-gray-500 text-sm'>Balance</p>
                                            <p className=' text-sm text-white'>{getDisplayStringFromNumber(bnbBalance)}</p>
                                        </div>
                                    </div>
                                    <div className=' mt-3 w-full lg:w-96 rounded-2xl overflow-hidden flex items-center justify-between' style={{ background: "#0A1C26" }}>
                                    <input type="number" value={bnbAmount} onChange={handleChangeBNBAmount} className=' w-full h-full outline-none border-none bg-transparent px-3' placeholder='0.00' />
                                        <div className=' w-44 p-4 h-full flex items-center justify-center' style={{ background: "#0C222E" }}>
                                            <button onClick={handleBNBMax} className=' text-sm text-pr px-2 py-1 rounded-xl' style={{ background: "#061117" }}>max</button>
                                        </div>
                                    </div>
                                </div>}
                                {!isBuy && <div className=' w-full'>
                                    <div className=' w-full lg:w-96 rounded-2xl overflow-hidden flex items-center justify-between' style={{ background: "#0A1C26" }}>
                                        <div className=' p-3 flex items-center gap-2'>
                                            <div className=' p-2 rounded-full' style={{ background: "rgba(148, 228, 231, 0.1)" }}>
                                                <img src="/images/smlogo.png" className=' w-5' alt="" />
                                            </div>
                                            <p className=' text-white'>TAU</p>
                                        </div>
                                        <div className=' w-32 p-3 h-full' style={{ background: "#0C222E" }}>
                                            <p className=' text-gray-500 text-sm'>Balance</p>
                                            <p className=' text-sm text-white'>{getDisplayStringFromNumber(lmbBalance)}</p>
                                        </div>
                                    </div>
                                    <div className=' mt-3 w-full lg:w-96 rounded-2xl overflow-hidden flex items-center justify-between' style={{ background: "#0A1C26" }}>
                                    <input type="number" value={lmbAmount} onChange={handleChangeLmbAmount} className=' w-full h-full outline-none border-none bg-transparent px-3' placeholder='0.00' />
                                        <div className=' w-44 p-4 h-full flex items-center justify-center' style={{ background: "#0C222E" }}>
                                            <button onClick={handleTaurusMax} className=' text-sm text-pr px-2 py-1 rounded-xl' style={{ background: "#061117" }}>max</button>
                                        </div>
                                    </div>
                                </div>}
                                <div className=' w-full flex items-center justify-center'>
                                    <button onClick={handleReverse}><img src="/images/swap.png" className=' cursor-pointer' alt="" /></button>
                                </div>
                                {isBuy && <div className=' w-full'>
                                    <div className=' w-full lg:w-96 rounded-2xl overflow-hidden flex items-center justify-between' style={{ background: "#0A1C26" }}>
                                        <div className=' p-3 flex items-center gap-2'>
                                            <div className=' p-2 rounded-full' style={{ background: "rgba(148, 228, 231, 0.1)" }}>
                                                <img src="/images/smlogo.png" className=' w-5' alt="" />
                                            </div>
                                            <p className=' text-white'>TAU</p>
                                        </div>
                                        <div className=' w-32 p-3 h-full' style={{ background: "#0C222E" }}>
                                            <p className=' text-gray-500 text-sm'>Balance</p>
                                            <p className=' text-sm text-white'>{getDisplayStringFromNumber(lmbBalance)}</p>
                                        </div>
                                    </div>
                                    <div className=' mt-3 w-full lg:w-96 rounded-2xl overflow-hidden flex items-center justify-between' style={{ background: "#0A1C26" }}>
                                    <input type="number" value={lmbAmount} onChange={handleChangeLmbAmount} className=' w-full h-full outline-none border-none bg-transparent px-3' placeholder='0.00' />
                                        <div className=' w-40 p-8 h-full flex items-center justify-center' style={{ background: "#0C222E" }}>
                                        </div>
                                    </div>
                                </div>}
                                {!isBuy && <div className=' w-full'>
                                    <div className=' w-full lg:w-96 rounded-2xl overflow-hidden flex items-center justify-between' style={{ background: "#0A1C26" }}>
                                        <div className=' p-3 flex items-center gap-2'>
                                            <div className=' p-2 rounded-full' style={{ background: "rgba(255, 181, 0, 0.1)" }}>
                                                <img src="/images/BNB.png" className=' w-5' alt="" />
                                            </div>
                                            <p className=' text-white'>BNB</p>
                                        </div>
                                        <div className=' w-32 p-3 h-full' style={{ background: "#0C222E" }}>
                                            <p className=' text-gray-500 text-sm'>Balance</p>
                                            <p className=' text-sm text-white'>{getDisplayStringFromNumber(bnbBalance)}</p>
                                        </div>
                                    </div>
                                    <div className=' mt-3 w-full lg:w-96 rounded-2xl overflow-hidden flex items-center justify-between' style={{ background: "#0A1C26" }}>
                                    <input type="number" value={bnbAmount} onChange={handleChangeBNBAmount} className=' w-full h-full outline-none border-none bg-transparent px-3' placeholder='0.00' />
                                        <div className=' w-40 p-8 h-full flex items-center justify-center' style={{ background: "#0C222E" }}>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <div className=' mt-10 w-full flex items-center justify-center'>
                            <button onClick={handleSwap} style={{borderRadius:"40px"}} className=' w-full lg:w-96 flex items-center justify-center py-4 text-sm font-bold bg-pr text-sr'>{isBuy? "Buy" : "Sell"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyTaurus