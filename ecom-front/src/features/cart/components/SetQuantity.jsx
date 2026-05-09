const SetQuantity = ({ 
  quantity, 
  cardCounter, 
  handleQtyIncrease, 
  handleQtyDecrease 
}) => {
  // Enhanced styles for a premium feel
  const btnStyles = `
    w-10 h-10 flex items-center justify-center rounded-xl 
    border-2 border-slate-100 bg-white text-slate-600
    hover:border-teal-500 hover:text-teal-600 hover:shadow-md
    active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed 
    transition-all duration-200 font-bold text-xl
  `;

  return (
    <div className="flex gap-6 items-center">
      {/* Label Styling */}
      {!cardCounter && (
        <div className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">
          Quantity
        </div>
      )}

      <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm">
        {/* Decrease Button */}
        <button 
          disabled={quantity <= 1} 
          onClick={handleQtyDecrease} 
          className={btnStyles}
          aria-label="Decrease quantity"
        >
          −
        </button>

        {/* Quantity Display */}
        <div className="px-6 font-black text-teal-700 min-w-[3rem] text-center text-xl tabular-nums">
          {quantity}
        </div>

        {/* Increase Button */}
        <button 
          className={btnStyles} 
          onClick={handleQtyIncrease}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;