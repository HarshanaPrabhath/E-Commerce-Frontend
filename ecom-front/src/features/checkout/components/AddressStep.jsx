import { MdLocalShipping } from "react-icons/md";

function AddressStep({
  isLoadingAddresses,
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  buildAddressLabel,
  addressForm,
  setAddressForm,
  isSavingAddress,
  onAddAddress,
  onBackPayment,
  onContinueReview,
}) {
  return (
    <>
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
        <MdLocalShipping className="text-teal-600" />
        Delivery Address
      </h2>

      {isLoadingAddresses ? (
        <p className="text-slate-500">Loading addresses...</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <label
              key={address.addressId}
              className={`block border rounded-xl p-4 cursor-pointer ${
                String(selectedAddressId) === String(address.addressId)
                  ? "border-teal-500 bg-teal-50/50"
                  : "border-slate-200"
              }`}
            >
              <input
                type="radio"
                name="selectedAddress"
                className="mr-2"
                checked={String(selectedAddressId) === String(address.addressId)}
                onChange={() => setSelectedAddressId(String(address.addressId))}
              />
              <span className="text-sm font-medium text-slate-700">
                {buildAddressLabel(address)}
              </span>
            </label>
          ))}
          {addresses.length === 0 && (
            <p className="text-slate-500 text-sm">No saved address yet. Add one below.</p>
          )}
        </div>
      )}

      <div className="border-t border-slate-100 pt-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Add New Address</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Street"
            value={addressForm.street}
            onChange={(e) =>
              setAddressForm((prev) => ({ ...prev, street: e.target.value }))
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-100"
          />
          <input
            type="text"
            placeholder="Building Name"
            value={addressForm.buildingName}
            onChange={(e) =>
              setAddressForm((prev) => ({ ...prev, buildingName: e.target.value }))
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-100"
          />
          <input
            type="text"
            placeholder="City"
            value={addressForm.city}
            onChange={(e) =>
              setAddressForm((prev) => ({ ...prev, city: e.target.value }))
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-100"
          />
          <input
            type="text"
            placeholder="State"
            value={addressForm.state}
            onChange={(e) =>
              setAddressForm((prev) => ({ ...prev, state: e.target.value }))
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-100"
          />
          <input
            type="text"
            placeholder="Country"
            value={addressForm.country}
            onChange={(e) =>
              setAddressForm((prev) => ({ ...prev, country: e.target.value }))
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-100"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Pincode"
            value={addressForm.pincode}
            onChange={(e) =>
              setAddressForm((prev) => ({ ...prev, pincode: e.target.value }))
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-100"
          />
        </div>
        <button
          type="button"
          onClick={onAddAddress}
          disabled={isSavingAddress}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl disabled:opacity-60"
        >
          {isSavingAddress ? "Saving Address..." : "Add Address"}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBackPayment}
          className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold"
        >
          Back to Payment
        </button>
        <button
          type="button"
          onClick={onContinueReview}
          className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold"
        >
          Continue to Place Order
        </button>
      </div>
    </>
  );
}

export default AddressStep;
