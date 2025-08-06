const SetQuantity = ({
  quantity,
  cardCounter,
  handleQtyIncrease,
  handleQtyDecrease,
}) => {
  const btnStyles = "border-[1.2px] border-slate-800 px-3 py-1 rounded";
  return (
    <div className="flex gap-8 items-center">
      {cardCounter ? null : <div className="font-semibold">QUANTITY</div>}
      <div className="items-center flex md:flex-row flex-col gap-4 lg:text-[22px] text-sm">
        <button disabled={quantity <= 1}
        onClick ={handleQtyDecrease}
        className={btnStyles}>
          -
        </button>

        <div className="text-red-500 items-center">
            {quantity}
        </div>
        <button className={btnStyles}
        onClick={handleQtyIncrease}>
          +
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;
