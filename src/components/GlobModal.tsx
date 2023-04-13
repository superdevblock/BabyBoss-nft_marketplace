/* This example requires Tailwind CSS v2.0+ */
import { Children, Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'


type Props = {
  open: any,
  setOpen: any
  children: any,
  size: any
};
export default function GlobModal({ open, setOpen, children, size }: Props) {


  const cancelButtonRef = useRef<any>(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={`relative w-full ${size === "sm" && " lg:max-w-sm"} ${size === "xl" && " lg:max-w-xl"} bg-br p-5 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 `}>
          {children}

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

