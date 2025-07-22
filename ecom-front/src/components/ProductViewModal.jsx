import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { IoMdClose } from "react-icons/io";
import Status from "./Status";
import { MdClose, MdDone } from "react-icons/md";

export default function ProductViewModal({
  open,
  setOpen,
  product,
  isAvailable,
}) {
  const {
    id,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
  } = product || {};

  return (
    <>
      <Dialog
        open={open}
        as="div"
        className="relative z-10 "
        onClose={() => setOpen(false)}
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all md:max-w-[620px] "
            >
              {image && (
                <div className="flex justify-center aspect-[3/2] ">
                  <img
                    className="w-full h-full cursor-pointer"
                    src={image}
                    alt={productName}
                  ></img>
                </div>
              )}
              <div className="p-5">
                <DialogTitle
                  as="h3"
                  className="text-2xl font-semibold text-slate-800 pr-3 pb-3"
                >
                  {productName}
                </DialogTitle>
                <div className="flex justify-between items-center mr-3">
                  {specialPrice ? (
                    <div className="flex items-center gap-4 ">
                      <span className="text-gray-500 line-through">
                        ${Number(price).toFixed(2)}
                      </span>
                      <span className="text-xl font-bold text-slate-700">
                        ${Number(specialPrice).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xl font-bold text-slate-700">
                        ${Number(price).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {isAvailable ? (
                    <>
                      <Status
                        text="In Stock"
                        icon={MdDone}
                        bg="bg-teal-200"
                        color="text-teal-900"
                      />
                    </>
                  ) : (
                   <Status
                        text="Out-of-Stock"
                        icon={MdClose}
                        bg="bg-rose-200"
                        color="text-rose-900"
                      />
                  )}
                </div>

                <div className="mt-2 flex justify-between items-center">
                  <p className="pr-3 mt-2 text-sm/6 text-slate-600 max-w-[80%]">
                    {description}
                  </p>
                  <Button
                    className="pr-3  inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700 w-[20%] justify-center"
                    onClick={() => setOpen(false)}
                  >
                    <IoMdClose />
                    Close
                  </Button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
