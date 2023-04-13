import { useWeb3Context } from 'hooks/useWeb3Context'
import React, { useEffect, useState } from 'react'
import { useGenealogicalTree, useReferralGenealogicalTree } from 'state/referral/hooks'
const Geneological = () => {
    // const [userData, setUserData] = useState<any>({})
    // useEffect(() => {
    //     const localData = localStorage.getItem("user")
    //     setUserData(JSON.parse(localData || '{}'))
    // }, [])
    const web3Context = useWeb3Context()
    useGenealogicalTree(web3Context?.account)
    const genealogicalTree = useReferralGenealogicalTree()

    return (
        <div className=' my-6 w-full'>
            <p className=' text-sm text-white pb-1'> Genealogical Tree</p>
            <div className=' w-full  mt-2 border border-sr flex flex-col  overflow-hidden rounded-xl'>
                <div className=' py-3 flex items-center justify-between bg-sr px-3'>
                    <p className=' text-white text-sm'>Public key</p>
                    <p className=' text-white text-sm'>User level</p>
                </div>
                {genealogicalTree.map((item: any, key: any) => {
                    return <div key={key} className=' py-3 w-full px-2 flex items-center border-t border-sr justify-between'>
                        <p className=' text-sm text-white'>{item.publicKey}</p>
                        <p className=' text-pr text-sm'>{item.level}</p>
                    </div>  
                })}
                {/* {userData?.parent_refs?.length !== 0 && <>
                    {
                        userData?.parent_refs?.[0] && <div className=' py-3 w-full px-2 flex items-center border-t border-sr justify-between'>
                            <p className=' text-sm text-white'>{userData?.parent_refs[0]?.first_parent}</p>
                            <p className=' text-pr text-sm'>Level 1</p>
                        </div>
                    }
                    
                    {
                        userData?.parent_refs?.[1] && <div className=' py-3 w-full px-2 flex items-center border-t border-sr justify-between'>
                            <p className=' text-sm text-white'>{userData?.parent_refs[1]?.second_parent}</p>
                            <p className=' text-pr text-sm'>Level 2</p>
                        </div>
                    }
                    {
                        userData?.parent_refs?.[2] && <div className=' py-3 w-full px-2 flex items-center border-t border-sr justify-between'>
                            <p className=' text-sm text-white'>{userData?.parent_refs[2]?.third_parent}</p>
                            <p className=' text-pr text-sm'>Level 3</p>
                        </div>
                    }
                    {
                        userData?.parent_refs?.[3] && <div className=' py-3 w-full px-2 flex items-center border-t border-sr justify-between'>
                            <p className=' text-sm text-white'>{userData?.parent_refs[3]?.four_parent}</p>
                            <p className=' text-pr text-sm'>Level 4</p>
                        </div>
                    }
                </>} */}
            </div>
        </div>
    )
}

export default Geneological