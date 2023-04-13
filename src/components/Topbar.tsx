import React, { useContext } from 'react'
import { useWeb3Context } from 'hooks/useWeb3Context'
import { MainContext } from 'App'
import { Link } from 'react-router-dom'
const Topbar = () => {
  const web3Context = useWeb3Context()
  const displayAddress = `${web3Context?.account.substring(web3Context?.account.length - 10)}`
  const {setToggle, toggle} = useContext<any>(MainContext)
  return (
    <div className=' w-full flex items-center justify-between pt-3'>
      <Link to="/">
        <img  className=' block cursor-pointer lg:hidden w-10 h-10 object-contain' src="/images/smlogo.png" alt="" />
      </Link>
      <div className=' block lg:hidden'>
      <img onClick={()=>setToggle(!toggle)}  className={toggle? ' block cursor-pointer lg:hidden w-8 h-8 object-contain transform rotate-90': ' block cursor-pointer lg:hidden w-8 h-8 object-contain'} src="/images/align-right.png" alt="" />
      </div>
      <button className=' border-2 border-pr hidden lg:block rounded-3xl text-pr bg-transparent px-3 py-2 text-sm'>
        {displayAddress}
      </button>
    </div>
  )
}

export default Topbar